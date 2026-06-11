import { useState, useEffect } from 'react';
import {
  THICKNESS_OPTIONS,
  COLOR_SIDES_OPTIONS,
  LAMINATION_PART_OPTIONS,
  LAMINATION_PART_LABELS,
  LAMINATION_TYPE_OPTIONS
} from '@/constants/masterData';

const PricingRuleModal = ({ mode, rule, boxModels, materials, finishingOptions, onClose, onSave }) => {
  const [form, setForm] = useState({
    boxModelCode: '',
    materialCode: '',
    thickness: 300,
    colorSides: '1-sisi',
    laminationPart: 'tanpa-laminasi',
    laminationType: '',
    quantityTier: '',
    pricePerUnit: '',
    shippingCost: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && rule) {
      setForm({
        boxModelCode: rule.boxModelCode || '',
        materialCode: rule.materialCode || '',
        thickness: rule.thickness || 300,
        colorSides: rule.colorSides || '1-sisi',
        laminationPart: rule.laminationPart || 'tanpa-laminasi',
        laminationType: rule.laminationType || '',
        quantityTier: rule.quantityTier ? String(rule.quantityTier) : '',
        pricePerUnit: rule.pricePerUnit ? String(rule.pricePerUnit) : '',
        shippingCost: rule.shippingCost != null ? String(rule.shippingCost) : '',
        isActive: rule.isActive !== undefined ? rule.isActive : true,
      });
    }
  }, [mode, rule]);

  const validate = () => {
    const e = {};
    if (!form.boxModelCode) e.boxModelCode = 'Box Model wajib dipilih';
    if (!form.materialCode) e.materialCode = 'Material wajib dipilih';
    if (!form.thickness) e.thickness = 'Ketebalan wajib dipilih';
    if (!form.colorSides) e.colorSides = 'Warna cetak wajib dipilih';
    if (!form.laminationPart) e.laminationPart = 'Sisi laminasi wajib dipilih';
    if (form.laminationPart !== 'tanpa-laminasi' && !form.laminationType) {
      e.laminationType = 'Tipe laminasi wajib diisi jika ada laminasi';
    }
    if (!form.quantityTier || parseInt(form.quantityTier) <= 0) e.quantityTier = 'Quantity tier wajib diisi (angka positif)';
    if (!form.pricePerUnit || parseFloat(form.pricePerUnit) <= 0) e.pricePerUnit = 'Harga per unit wajib diisi';
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
        thickness: parseInt(form.thickness),
        quantityTier: parseInt(form.quantityTier),
        pricePerUnit: parseFloat(form.pricePerUnit),
        shippingCost: form.shippingCost !== '' ? parseFloat(form.shippingCost) : null,
        laminationType: form.laminationPart === 'tanpa-laminasi' ? null : (form.laminationType || null),
      });
    } finally {
      setSaving(false);
    }
  };

  const needsLaminationType = form.laminationPart !== 'tanpa-laminasi';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? 'Tambah Pricing Rule' : 'Edit Pricing Rule'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">Isi 7 kombinasi faktor + harga per unit</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 7 faktor label */}
          <div className="bg-gray-50 rounded-lg p-3 mb-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">7 Faktor Penentu Harga</p>
          </div>

          {/* Box Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">① Box Model <span className="text-red-500">*</span></label>
            <select
              value={form.boxModelCode}
              onChange={(e) => setForm({ ...form, boxModelCode: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary ${errors.boxModelCode ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">-- Pilih Box Model --</option>
              {boxModels.map((bm) => (
                <option key={bm.id} value={bm.code}>{bm.name} ({bm.code})</option>
              ))}
            </select>
            {errors.boxModelCode && <p className="text-red-500 text-xs mt-1">{errors.boxModelCode}</p>}
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">② Material <span className="text-red-500">*</span></label>
            <select
              value={form.materialCode}
              onChange={(e) => setForm({ ...form, materialCode: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary ${errors.materialCode ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">-- Pilih Material --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.code}>{m.name} ({m.code})</option>
              ))}
            </select>
            {errors.materialCode && <p className="text-red-500 text-xs mt-1">{errors.materialCode}</p>}
          </div>

          {/* Thickness + Color (2 col) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">③ Ketebalan <span className="text-red-500">*</span></label>
              <select
                value={form.thickness}
                onChange={(e) => setForm({ ...form, thickness: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary ${errors.thickness ? 'border-red-500' : 'border-gray-300'}`}
              >
                {THICKNESS_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t} gsm</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">④ Warna Cetak <span className="text-red-500">*</span></label>
              <select
                value={form.colorSides}
                onChange={(e) => setForm({ ...form, colorSides: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary ${errors.colorSides ? 'border-red-500' : 'border-gray-300'}`}
              >
                {COLOR_SIDES_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lamination Part */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">⑤ Sisi Laminasi <span className="text-red-500">*</span></label>
            <select
              value={form.laminationPart}
              onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, laminationPart: val, laminationType: val === 'tanpa-laminasi' ? '' : form.laminationType });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary ${errors.laminationPart ? 'border-red-500' : 'border-gray-300'}`}
            >
              {LAMINATION_PART_OPTIONS.map((l) => (
                <option key={l} value={l}>{LAMINATION_PART_LABELS[l] || l}</option>
              ))}
            </select>
          </div>

          {/* Lamination Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ⑥ Tipe Laminasi {needsLaminationType && <span className="text-red-500">*</span>}
            </label>
            <select
              value={form.laminationType}
              onChange={(e) => setForm({ ...form, laminationType: e.target.value })}
              disabled={!needsLaminationType}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary disabled:bg-gray-100 disabled:text-gray-400 ${errors.laminationType ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">{needsLaminationType ? '-- Pilih Tipe --' : 'Tidak ada (tanpa laminasi)'}</option>
              {needsLaminationType && LAMINATION_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.laminationType && <p className="text-red-500 text-xs mt-1">{errors.laminationType}</p>}
          </div>

          {/* Quantity Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">⑦ Quantity Tier (pcs) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={form.quantityTier}
              onChange={(e) => setForm({ ...form, quantityTier: e.target.value })}
              placeholder="contoh: 500"
              min="1"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary ${errors.quantityTier ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.quantityTier && <p className="text-red-500 text-xs mt-1">{errors.quantityTier}</p>}
          </div>

          {/* Harga divider */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Output Harga</p>
          </div>

          {/* Price per unit + Shipping (2 col) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga per Unit (Rp) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={form.pricePerUnit}
                onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                placeholder="contoh: 850"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary ${errors.pricePerUnit ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.pricePerUnit && <p className="text-red-500 text-xs mt-1">{errors.pricePerUnit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ongkir (Rp)</label>
              <input
                type="number"
                value={form.shippingCost}
                onChange={(e) => setForm({ ...form, shippingCost: e.target.value })}
                placeholder="Opsional"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary"
              />
            </div>
          </div>

          {/* isActive */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 text-color-secondary border-gray-300 rounded"
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

export default PricingRuleModal;
