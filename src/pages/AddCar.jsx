import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

function AddCar() {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  /* ── Fetch categories on mount ─────────────────────── */
  useEffect(() => {
    api('/vehicle-categories')
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
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
      if (specifications.trim()) formData.append('specifications', specifications.trim());
      if (image) formData.append('image', image);
      await api('/vehicles', { method: 'POST', body: formData });
      toast.success('Vehicle added successfully!');
      navigate('/dealer/vehicles');
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <Link to="/dealer/vehicles" className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to My Vehicles
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-slate-50">Add New Vehicle</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Fill in the details below to list a new vehicle.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
        {/* Image upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Image</label>
          {preview ? (
            <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
              <img src={preview} alt="Preview" className="h-[220px] w-full object-cover" />
              <button type="button" onClick={removeImage} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 backdrop-blur transition hover:bg-rose-500 hover:text-white dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-rose-500/80">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-4 py-3 dark:from-slate-900/80">
                <p className="truncate text-xs text-white dark:text-slate-300">{image?.name}</p>
              </div>
            </div>
          ) : (
            <label htmlFor="car-image" className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-sky-400 hover:bg-sky-50/50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-sky-500/40 dark:hover:bg-slate-800/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 text-gray-400 dark:bg-slate-700/50 dark:text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21ZM12 8.25h.008v.008H12V8.25Z" /></svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Click to upload an image</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">PNG, JPG, WEBP or AVIF</p>
              </div>
            </label>
          )}
          <input id="car-image" ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="car-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Name <span className="text-rose-500">*</span></label>
          <input id="car-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" placeholder="e.g. Camry" />
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label htmlFor="car-brand" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Brand <span className="text-rose-500">*</span></label>
          <input id="car-brand" type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" placeholder="e.g. Toyota" />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label htmlFor="car-price" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Price (₹) <span className="text-rose-500">*</span></label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">₹</span>
            <input id="car-price" type="number" required min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" placeholder="e.g. 35000" />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="vehicle-category" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Category <span className="text-rose-500">*</span></label>
          <select
            id="vehicle-category"
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

        {/* Specifications (optional) */}
        <div className="space-y-1.5">
          <label htmlFor="vehicle-specs" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Specifications <span className="text-gray-400 dark:text-slate-600">(optional)</span>
          </label>
          <textarea
            id="vehicle-specs"
            rows={4}
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
            placeholder='e.g. {"engine": "2.0L", "fuel": "Petrol", "mileage": "15 km/l"}'
          />
          <p className="text-xs text-gray-400 dark:text-slate-500">Enter as JSON key-value pairs.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-gray-200 pt-6 dark:border-slate-800">
          <button type="submit" disabled={formLoading} className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
            {formLoading ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Adding…</>) : 'Add Vehicle'}
          </button>
          <Link to="/dealer/vehicles" className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default AddCar;
