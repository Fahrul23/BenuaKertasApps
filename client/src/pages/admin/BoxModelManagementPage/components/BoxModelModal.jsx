import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { uploadAPI } from '@/services/api';

const BoxModelModal = ({ mode, boxModel, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    imageUrl: '',
    basePrice: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 2MB for box model)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ukuran file melebihi batas 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format gambar tidak didukung. Gunakan jpg, png, atau svg');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const response = await uploadAPI.uploadBoxModel(file);
      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: response.data.url,
        }));
        // Clear error for imageUrl if any
        if (errors.imageUrl) {
          setErrors((prev) => ({ ...prev, imageUrl: '' }));
        }
      } else {
        setUploadError(response.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && boxModel) {
      setFormData({
        code: boxModel.code || '',
        name: boxModel.name || '',
        description: boxModel.description || '',
        imageUrl: boxModel.imageUrl || '',
        basePrice: boxModel.basePrice || '',
        isActive: boxModel.isActive !== undefined ? boxModel.isActive : true,
      });
    }
  }, [mode, boxModel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL or file upload is required';
    }

    if (formData.basePrice && isNaN(formData.basePrice)) {
      newErrors.basePrice = 'Base price must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Convert basePrice to number if provided
    const dataToSave = {
      ...formData,
      basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
    };

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Box Model' : 'Edit Box Model'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., earlock-box-depan"
            />
            {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Earlock Box Depan"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent"
              placeholder="Enter box model description..."
            />
          </div>

          {/* Image URL / Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Box Model Image <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 items-start mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent ${
                    errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter image URL or upload file below"
                />
                {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
              </div>
              {formData.imageUrl && (
                <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="imageUpload"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex items-center gap-3">
                <label
                  htmlFor="imageUpload"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-gray-700 rounded-full inline-block"></span>
                      Uploading...
                    </>
                  ) : 'Upload File to Cloudinary'}
                </label>
                <span className="text-xs text-gray-500">Max 2MB (JPG, PNG, SVG)</span>
              </div>
              {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
            </div>
          </div>

          {/* Base Price */}
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Base Price (Rp)
            </label>
            <input
              type="number"
              id="basePrice"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent ${
                errors.basePrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 5000"
            />
            {errors.basePrice && <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>}
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-color-secondary border-gray-300 rounded focus:ring-color-secondary"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-color-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoxModelModal;
