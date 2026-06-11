import { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { GSM_PRICES } from '@/constants/masterData';

const MaterialModal = ({ mode, material, onClose, onSave }) => {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
    price300gsm: '',
    price350gsm: '',
    price400gsm: '',
    price450gsm: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && material) {
      setForm({
        code: material.code || '',
        name: material.name || '',
        description: material.description || '',
        imageUrl: material.imageUrl || '',
        isActive: material.isActive !== undefined ? material.isActive : true,
        price300gsm: material.price300gsm != null ? String(material.price300gsm) : '',
        price350gsm: material.price350gsm != null ? String(material.price350gsm) : '',
        price400gsm: material.price400gsm != null ? String(material.price400gsm) : '',
        price450gsm: material.price450gsm != null ? String(material.price450gsm) : '',
      });
    }
  }, [isEdit, material]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        price300gsm: form.price300gsm !== '' ? parseFloat(form.price300gsm) : null,
        price350gsm: form.price350gsm !== '' ? parseFloat(form.price350gsm) : null,
        price400gsm: form.price400gsm !== '' ? parseFloat(form.price400gsm) : null,
        price450gsm: form.price450gsm !== '' ? parseFloat(form.price450gsm) : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header strip */}
        <div className="h-1 bg-gradient-to-r from-color-darker to-color-primary" />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-color-darker to-color-primary flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEdit ? 'Edit Material' : 'Tambah Material Baru'}
            </h2>
            <p className="text-xs text-gray-500">
              {isEdit ? `Mengedit: ${material?.name}` : 'Isi form di bawah untuk menambah material baru'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Kode Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="Contoh: ART-PAPER"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nama Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Contoh: Art Paper"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi singkat material..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">URL Gambar</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all"
            />
            {form.imageUrl && (
              <div className="mt-2 w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* GSM Prices */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Harga per GSM (Rp/m²)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GSM_PRICES.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                    <input
                      type="number"
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0"
                      className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="material-isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 accent-color-primary rounded"
            />
            <label htmlFor="material-isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Material Aktif
              <span className="block text-xs font-normal text-gray-400">
                Material aktif akan ditampilkan di halaman pemesanan
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-color-darker text-white rounded-xl font-medium hover:bg-color-dark transition-colors text-sm disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
