import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/* -- Decode JWT payload to get current user email -- */
function getCurrentUserEmail() {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || payload.sub || null;
  } catch {
    return null;
  }
}

function StaffManagement() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const currentUserEmail = getCurrentUserEmail();

  /* -- Add Staff modal state -- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  /* -- Edit Permissions modal state -- */
  const [editTarget, setEditTarget] = useState(null); // staff member being edited
  const [editPerms, setEditPerms] = useState([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  /* -- Available permissions (fetched from backend) -- */
  const [permissionOptions, setPermissionOptions] = useState([]);

  /* -- Fetch available permissions from backend -- */
  const fetchPermissions = useCallback(() => {
    api('/permissions')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPermissionOptions(data);
        }
      })
      .catch(() => {
        // Silently ignore – checkboxes will stay empty until retry
      });
  }, []);

  /* -- Fetch staff list -- */
  const fetchStaff = useCallback(() => {
    setLoading(true);
    setError(null);
    api('/staff')
      .then((data) => setStaffList(data))
      .catch((err) => {
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/dealer/login', { replace: true });
          return;
        }
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    fetchStaff();
    fetchPermissions();
  }, [fetchStaff, fetchPermissions]);

  /* -- Toggle permission checkbox -- */
  const togglePerm = (name) => {
    setSelectedPerms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  /* -- Reset & close modal -- */
  const closeModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEmail('');
    setPassword('');
    setSelectedPerms([]);
    setModalError(null);
  };

  /* -- Toggle staff active/inactive -- */
  const handleToggleActive = async (staffId) => {
    setTogglingId(staffId);
    try {
      await api(`/staff/${staffId}/toggle-active`, { method: 'PATCH' });
      fetchStaff();
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      alert(err.message || 'Failed to toggle status');
    } finally {
      setTogglingId(null);
    }
  };

  /* -- Submit new staff -- */
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      await api('/staff', {
        method: 'POST',
        body: JSON.stringify({ email, password, permissions: selectedPerms }),
      });
      closeModal();
      fetchStaff();
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* -- Open edit modal with pre-filled permissions -- */
  const openEditModal = (member) => {
    const perms = Array.isArray(member.permissions)
      ? member.permissions
      : typeof member.permissions === 'string'
        ? member.permissions.split(',').map((p) => p.trim()).filter(Boolean)
        : [];
    setEditTarget(member);
    setEditPerms([...perms]);
    setEditError(null);
  };

  /* -- Close edit modal -- */
  const closeEditModal = () => {
    if (editSubmitting) return;
    setEditTarget(null);
    setEditPerms([]);
    setEditError(null);
  };

  /* -- Toggle edit permission checkbox -- */
  const toggleEditPerm = (name) => {
    setEditPerms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  /* -- Submit edited permissions -- */
  const handleEditPermissions = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditSubmitting(true);
    setEditError(null);
    try {
      await api(`/staff/${editTarget.id}/permissions`, {
        method: 'PATCH',
        body: JSON.stringify({ permissions: editPerms }),
      });
      closeEditModal();
      fetchStaff();
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* -- Header -- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-slate-50">
            Staff Management
          </h1>
          {!loading && !error && (
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {staffList.length} {staffList.length === 1 ? 'member' : 'members'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Staff
        </button>
      </div>

      {/* -- Loading -- */}
      {loading && (
        <div className="flex items-center gap-3 py-16">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">Loading staff...</p>
        </div>
      )}

      {/* -- Error -- */}
      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 dark:border-rose-500/20 dark:bg-rose-500/5">
          <p className="text-sm text-rose-600 dark:text-rose-400">Error: {error}</p>
        </div>
      )}

      {/* -- Empty state -- */}
      {!loading && !error && staffList.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white py-20 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800/60">
            <svg className="h-8 w-8 text-gray-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-700 dark:text-slate-300">No staff created yet.</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">Add your first staff member to get started.</p>
          </div>
        </div>
      )}

      {/* -- Table -- */}
      {!loading && !error && staffList.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-slate-800 dark:shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-900/80">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                    Email
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                    Status
                  </th>
                  <th className="hidden px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell dark:text-slate-500">
                    Permissions
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {staffList.map((member) => (
                  <tr
                    key={member.id}
                    className="bg-white transition-colors hover:bg-gray-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/50"
                  >
                    {/* Email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold uppercase text-sky-600 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20">
                          {member.email.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {member.email}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {(() => {
                        const isActive = member.is_active ?? member.status === 'Active';
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
                                : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:ring-gray-600'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}
                            />
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        );
                      })()}
                    </td>

                    {/* Permissions */}
                    <td className="hidden px-5 py-4 sm:table-cell">
                      {(() => {
                        const perms = Array.isArray(member.permissions)
                          ? member.permissions
                          : typeof member.permissions === 'string'
                            ? member.permissions.split(',').map((p) => p.trim()).filter(Boolean)
                            : [];
                        return perms.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {perms.map((perm) => (
                              <span
                                key={perm}
                                className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-slate-600">&mdash;</span>
                        );
                      })()}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {member.role === 'DEALER_OWNER' ? (
                          /* Owner badge — no edit / toggle actions */
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>
                            Owner
                          </span>
                        ) : (
                          <>
                            {/* Toggle Active / Deactivate */}
                            {(() => {
                              const isActive = member.is_active ?? member.status === 'Active';
                              const isSelf = currentUserEmail && member.email === currentUserEmail;
                              return (
                                <button
                                  type="button"
                                  disabled={isSelf || togglingId === member.id}
                                  onClick={() => handleToggleActive(member.id)}
                                  title={isSelf ? 'Cannot toggle your own account' : isActive ? 'Deactivate this staff member' : 'Activate this staff member'}
                                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    isActive
                                      ? 'border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10'
                                      : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10'
                                  }`}
                                >
                                  {togglingId === member.id ? (
                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                                  ) : isActive ? (
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                  ) : (
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                  )}
                                  {isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              );
                            })()}

                            {/* Edit Permissions */}
                            <button
                              type="button"
                              onClick={() => openEditModal(member)}
                              title="Edit permissions"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/5 dark:text-sky-400 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -- Add Staff Modal -- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm dark:bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Dialog */}
          <div className="relative w-full max-w-md animate-modal-in rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                  Add Staff Member
                </h3>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                  Create a new staff account with permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddStaff} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="staff-email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="staff-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="staff-password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  id="staff-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {permissionOptions.map((permission) => (
                    <label
                      key={permission.id}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition ${
                        selectedPerms.includes(permission.name)
                          ? 'border-sky-300 bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(permission.name)}
                        onChange={() => togglePerm(permission.name)}
                        className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700"
                      />
                      <span className="font-medium">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error */}
              {modalError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-500/20 dark:bg-rose-500/5">
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{modalError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Adding…
                    </>
                  ) : (
                    'Add Staff'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -- Edit Permissions Modal -- */}
      {editTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm dark:bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}
        >
          <div className="relative w-full max-w-md animate-modal-in rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                  Edit Permissions
                </h3>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                  Update permissions for this staff member.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditPermissions} className="space-y-5">
              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold uppercase text-sky-600 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20">
                    {editTarget.email.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    {editTarget.email}
                  </span>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {permissionOptions.map((permission) => (
                    <label
                      key={permission.id}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition ${
                        editPerms.includes(permission.name)
                          ? 'border-sky-300 bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editPerms.includes(permission.name)}
                        onChange={() => toggleEditPerm(permission.name)}
                        className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700"
                      />
                      <span className="font-medium">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error */}
              {editError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-500/20 dark:bg-rose-500/5">
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{editError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={editSubmitting}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving…
                    </>
                  ) : (
                    'Save Permissions'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagement;
