import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search, DollarSign, Filter } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import PricingRuleModal from './components/PricingRuleModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { SuccessModal, ErrorModal } from '@/components';

const formatRp = (v) => `Rp ${parseFloat(v || 0).toLocaleString('id-ID')}`;

const PricingRuleManagementPage = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBoxModel, setFilterBoxModel] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  // Dropdown options dari master data
  const [boxModels, setBoxModels] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [finishingOptions, setFinishingOptions] = useState([]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await masterDataAPI.getAllPricingRules();
      if (response.success) setRules(response.data);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal mengambil data pricing rules dari server.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [bm, mat, fin] = await Promise.all([
        masterDataAPI.getAllBoxModels(),
        masterDataAPI.getAllMaterials(),
        masterDataAPI.getAllFinishingOptions(),
      ]);
      if (bm.success) setBoxModels(bm.data);
      if (mat.success) setMaterials(mat.data);
      if (fin.success) setFinishingOptions(fin.data);
    } catch (error) {
      console.error('Error fetching master data for dropdowns:', error);
    }
  };

  useEffect(() => {
    fetchRules();
    fetchMasterData();
  }, []);

  const handleCreate = () => {
    setSelectedRule(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (rule) => {
    setSelectedRule(rule);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await masterDataAPI.deletePricingRule(selectedRule.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Pricing rule telah berhasil dihapus dari sistem.'
        });
        fetchRules();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Hapus',
          message: response.message || 'Gagal menghapus pricing rule.'
        });
      }
    } catch {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus pricing rule.'
      });
    }
  };

  const handleToggleStatus = async (rule) => {
    try {
      const response = await masterDataAPI.togglePricingRuleStatus(rule.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Status Diperbarui',
          message: `Status pricing rule berhasil diubah menjadi ${!rule.isActive ? 'aktif' : 'nonaktif'}.`
        });
        fetchRules();
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Ubah Status',
          message: response.message || 'Gagal mengubah status pricing rule.'
        });
      }
    } catch {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat mengubah status pricing rule.'
      });
    }
  };

  const handleSave = async (data) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createPricingRule(data);
      } else {
        response = await masterDataAPI.updatePricingRule(selectedRule.id, data);
      }
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: modalMode === 'create' ? 'Berhasil Ditambahkan' : 'Berhasil Diperbarui',
          message: response.message || 'Pricing rule berhasil disimpan.'
        });
        fetchRules();
        setIsModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal menyimpan pricing rule.'
        });
      }
    } catch {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menyimpan data pricing rule.'
      });
    }
  };

  // Unique values for filters
  const uniqueBoxModels = [...new Set(rules.map((r) => r.boxModelCode))].sort();
  const uniqueMaterials = [...new Set(rules.map((r) => r.materialCode))].sort();

  const filtered = rules.filter((r) => {
    const matchSearch = !searchTerm ||
      r.boxModelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.laminationPart.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBM = !filterBoxModel || r.boxModelCode === filterBoxModel;
    const matchMat = !filterMaterial || r.materialCode === filterMaterial;
    return matchSearch && matchBM && matchMat;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <main>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Pricing Rules Management</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Kelola matrix harga berdasarkan kombinasi 7 faktor (Box Model, Material, Ketebalan, Warna, Laminasi, Tipe, Qty)
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <DollarSign className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Cara kerja Pricing Rule</p>
            <p>Setiap baris adalah kombinasi unik dari 7 faktor. Saat pelanggan order, sistem akan mencari baris yang cocok untuk menentukan harga. Jika tidak ditemukan, admin perlu mengisi terlebih dahulu.</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari box model, material..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
                />
              </div>
              {/* Filter Box Model */}
              <div className="flex items-center gap-1.5">
                <Filter size={15} className="text-gray-400" />
                <select
                  value={filterBoxModel}
                  onChange={(e) => setFilterBoxModel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary"
                >
                  <option value="">Semua Box Model</option>
                  {uniqueBoxModels.map((bm) => (
                    <option key={bm} value={bm}>{bm}</option>
                  ))}
                </select>
              </div>
              {/* Filter Material */}
              <select
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary"
              >
                <option value="">Semua Material</option>
                {uniqueMaterials.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-color-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Tambah Harga</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-color-secondary" />
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500 font-medium">
                {rules.length === 0 ? 'Belum ada data harga. Klik "Tambah Harga" untuk mulai.' : 'Tidak ada data yang sesuai filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['ID', 'Box Model', 'Material', 'Tebal', 'Warna Cetak', 'Sisi Laminasi', 'Tipe Laminasi', 'Qty Tier', 'Harga/Unit', 'Ongkir', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs">{rule.id}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-900 max-w-32 truncate" title={rule.boxModelCode}>{rule.boxModelCode}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-900">{rule.materialCode}</td>
                      <td className="px-4 py-3 text-gray-700">{rule.thickness} gsm</td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">{rule.colorSides}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{rule.laminationPart}</td>
                      <td className="px-4 py-3">
                        {rule.laminationType ? (
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">{rule.laminationType}</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{parseInt(rule.quantityTier).toLocaleString('id-ID')} pcs</td>
                      <td className="px-4 py-3 font-semibold text-green-700">{formatRp(rule.pricePerUnit)}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {rule.shippingCost != null ? formatRp(rule.shippingCost) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {rule.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(rule)} className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors" title="Edit"><Edit2 size={14} /></button>
                          <button
                            onClick={() => handleToggleStatus(rule)}
                            className={`p-1.5 rounded transition-colors ${rule.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                            title={rule.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          ><Power size={14} /></button>
                          <button onClick={() => handleDelete(rule)} className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors" title="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Menampilkan {filtered.length} dari {rules.length} pricing rule
        </div>
      </main>

      {isModalOpen && (
        <PricingRuleModal
          mode={modalMode}
          rule={selectedRule}
          boxModels={boxModels}
          materials={materials}
          finishingOptions={finishingOptions}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          item={selectedRule ? { name: `${selectedRule.boxModelCode} / ${selectedRule.materialCode} / ${selectedRule.quantityTier} pcs` } : null}
          itemType="Pricing Rule"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}

      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};

export default PricingRuleManagementPage;
