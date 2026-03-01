import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../shared/services/api';
import { useToast } from '../../../shared/contexts/ToastContext';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [newPreview, setNewPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  /* -- Fetch categories on mount ----------------------- */
  useEffect(() => {
    api('/vehicle-categories')
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  /* -- Fetch vehicle details ------------------------- */
  useEffect(() => {
    async function fetchVehicle() {
      try {
        const data = await api(`/vehicles/${id}`);
        setName(data.name);
        setBrand(data.brand);
        setPrice(String(data.price));
        setCategoryId(data.category_id ? String(data.category_id) : '');
        setExistingImageUrl(data.image_url || null);
      } catch (err) {
        if (err.status === 401) { localStorage.removeItem('access_token'); navigate('/dealer/login', { replace: true }); return; }
        setPageError(err.message);
      } finally {
        setPageLoading(false);
      }
    }
    fetchVehicle();
  }, [id, navigate]);

  const previewUrl = newPreview || (existingImageUrl ? `${BACKEND_URL}/${existingImageUrl.replace(/^\//, '')}` : null);

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setNewImage(file);
    if (newPreview) URL.revokeObjectURL(newPreview);
    setNewPreview(file ? URL.createObjectURL(file) : null);
  };

  const removeNewImage = () => {
    setNewImage(null);
    if (newPreview) URL.revokeObjectURL(newPreview);
    setNewPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('price', price);
      formData.append('category_id', categoryId);
      if (newImage) formData.append('image', newImage);
      await api(`/vehicles/${id}`, { method: 'PUT', body: formData });
      toast.success('Vehicle updated successfully!');
      navigate('/dealer/vehicles');
    } catch (err) {
      if (err.status === 401) { localStorage.removeItem('access_token'); navigate('/dealer/login', { replace: true }); return; }
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading vehicle details…</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="mx-auto max-w-md py-32 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-500/10">
          <svg className="h-7 w-7 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Unable to load vehicle</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{pageError}</p>
        <Link to="/dealer/vehicles" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to My Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <Link to="/dealer/vehicles" className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to My Vehicles
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-slate-50">Edit Vehicle</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Update the details for <span className="font-medium text-gray-700 dark:text-slate-200">{brand} {name}</span>.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
        {/* Image section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Image</label>
          {previewUrl ? (
            <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
              <img src={previewUrl} alt={`${brand} ${name}`} className="h-[220px] w-full object-cover" />
              <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur ${newPreview ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-white/70 text-gray-500 dark:bg-slate-900/70 dark:text-slate-400'}`}>
                {newPreview ? 'New' : 'Current'}
              </span>
              {newPreview && (
                <button type="button" onClick={removeNewImage} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 backdrop-blur transition hover:bg-rose-500 hover:text-white dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-rose-500/80" title="Remove new image">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              )}
              {newImage && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-4 py-3 dark:from-slate-900/80">
                  <p className="truncate text-xs text-white dark:text-slate-300">{newImage.name}</p>
                </div>
              )}
              <label htmlFor="edit-image" className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-700 backdrop-blur transition hover:bg-sky-500 hover:text-white dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-sky-500/80">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
                Replace
              </label>
            </div>
          ) : (
            <label htmlFor="edit-image" className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-sky-400 hover:bg-sky-50/50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-sky-500/40 dark:hover:bg-slate-800/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 text-gray-400 dark:bg-slate-700/50 dark:text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21ZM12 8.25h.008v.008H12V8.25Z" /></svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Click to upload an image</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">PNG, JPG, WEBP or AVIF</p>
              </div>
            </label>
          )}
          <input id="edit-image" ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Name <span className="text-rose-500">*</span></label>
          <input id="edit-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" placeholder="e.g. Camry" />
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label htmlFor="edit-brand" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Brand <span className="text-rose-500">*</span></label>
          <input id="edit-brand" type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" placeholder="e.g. Toyota" />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Price (₹) <span className="text-rose-500">*</span></label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">₹</span>
            <input id="edit-price" type="number" required min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" placeholder="e.g. 35000" />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Category <span className="text-rose-500">*</span></label>
          <select
            id="edit-category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-gray-200 pt-6 dark:border-slate-800">
          <button type="submit" disabled={formLoading} className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
            {formLoading ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving…</>) : 'Save Changes'}
          </button>
          <Link to="/dealer/vehicles" className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default EditCar;

