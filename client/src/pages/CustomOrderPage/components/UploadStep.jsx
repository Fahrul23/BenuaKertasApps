import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const UploadStep = ({ uploadedFile, note, onFileUpload, onNoteChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileChange = (file) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (file && allowedTypes.includes(file.type)) {
      onFileUpload(file);
    } else {
      alert('Format file tidak didukung. Gunakan pdf, jpg, png, atau svg');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemoveFile = () => {
    onFileUpload(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Unggah File</h2>
        <p className="text-color-secondary text-sm font-semibold">File dalam bentuk (pdf, jpg, png, dan svg)</p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
            isDragging
              ? 'border-color-secondary bg-color-light/30'
              : 'border-gray-300 bg-white'
          } ${uploadedFile ? 'p-6' : 'p-12'}`}
        >
          {!uploadedFile ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-color-light flex items-center justify-center">
                <Upload size={32} className="text-color-secondary" />
              </div>
              <p className="text-color-black font-semibold mb-2">
                Drag & drop file di sini atau
              </p>
              <label className="cursor-pointer">
                <span className="text-color-secondary font-semibold hover:underline">
                  Pilih File
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.svg"
                  onChange={handleFileInputChange}
                />
              </label>
              <p className="text-color-gray text-sm mt-2">
                Format: PDF, JPG, PNG, SVG (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-color-light flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-color-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-color-black">{uploadedFile.name}</p>
                  <p className="text-sm text-color-gray">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors duration-300"
              >
                <X size={18} className="text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Note Area */}
      <div>
        <label className="block mb-3">
          <span className="text-color-secondary font-semibold">Note</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Tambahkan catatan atau instruksi khusus untuk pesanan Anda..."
          rows={5}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-color-secondary focus:outline-none transition-colors duration-300 resize-none text-color-black placeholder:text-color-gray"
        />
      </div>
    </div>
  );
};

export default UploadStep;
