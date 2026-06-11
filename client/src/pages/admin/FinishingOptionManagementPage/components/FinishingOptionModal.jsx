import { useState, useEffect } from 'react';
import { CATEGORY_OPTIONS } from '@/constants/masterData';

const FinishingOptionModal = ({ mode, option, onClose, onSave }) => {
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    imageUrl: '',
    category: 'side',
    additionalPrice: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && option) {
      setForm({
        code: option.code || '',
        name: option.name || '',
        description: option.description || '',
        imageUrl: option.imageUrl || '',
        category: option.category || 'side',
        additionalPrice: option.additionalPrice != null ? String(option.additionalPrice) : '',
        isActive: option.isActive !== undefined ? option.isActive : true,
      });
    }
  }, [mode, option]);

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Kode wajib diisi';
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.category) e.category = 'Kategori wajib dipilih';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        additionalPrice: form.additionalPrice !== '' ? parseFloat(form.additionalPrice) : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? 'Tambah Finishing Option' : 'Edit Finishing Option'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="contoh: tanpa-laminasi"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="contoh: Tanpa Laminasi"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Additional Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tambahan (Rp)</label>
            <input
              type="number"
              value={form.additionalPrice}
              onChange={(e) => setForm({ ...form, additionalPrice: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            />
          </div>

          {/* isActive */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 text-color-secondary border-gray-300 rounded focus:ring-color-secondary"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-color-secondary text-white rounded-lg hover:bg-opacity-90 text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? 'Menyimpan...' : mode === 'create' ? 'Tambah' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinishingOptionModal;
