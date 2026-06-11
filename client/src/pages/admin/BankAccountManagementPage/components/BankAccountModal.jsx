import { useState, useEffect } from 'react';

const BankAccountModal = ({ mode, account, onClose, onSave }) => {
  const [form, setForm] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    branch: '',
    displayOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && account) {
      setForm({
        bankName: account.bankName || '',
        accountNumber: account.accountNumber || '',
        accountHolderName: account.accountHolderName || '',
        branch: account.branch || '',
        displayOrder: account.displayOrder != null ? account.displayOrder : 0,
        isActive: account.isActive !== undefined ? account.isActive : true,
      });
    }
  }, [mode, account]);

  const validate = () => {
    const e = {};
    if (!form.bankName.trim()) e.bankName = 'Nama bank wajib diisi';
    if (!form.accountNumber.trim()) e.accountNumber = 'Nomor rekening wajib diisi';
    if (!form.accountHolderName.trim()) e.accountHolderName = 'Nama pemilik rekening wajib diisi';
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
        displayOrder: form.displayOrder !== '' ? parseInt(form.displayOrder) : 0,
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
            {mode === 'create' ? 'Tambah Rekening Bank' : 'Edit Rekening Bank'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">Masukkan rincian informasi rekening bank</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="contoh: BCA, Mandiri, BRI"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              placeholder="contoh: 8012345678"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik Rekening <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.accountHolderName}
              onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
              placeholder="contoh: PT Benua Kertas Indonesia"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cabang (Opsional)</label>
            <input
              type="text"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              placeholder="contoh: KCP Sudirman"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampilan</label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            />
            <p className="text-gray-400 text-xs mt-1">Urutan kemunculan rekening (angka lebih kecil muncul lebih dahulu)</p>
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

export default BankAccountModal;
