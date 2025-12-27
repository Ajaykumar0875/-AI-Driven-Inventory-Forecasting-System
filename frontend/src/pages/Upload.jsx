import React, { useState, useCallback } from 'react';
import { UploadCloud, FileType, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { uploadCSV } from '../services/api';

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Only CSV files are allowed');
      return;
    }
    setFile(selectedFile);
    toast.success('File selected ready for upload');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadCSV(formData);
      toast.success(`Success! Processed ${response.data.salesRecordsAdded} sales records.`);
      setFile(null); // Reset
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Data Ingestion</h2>
          <p className="text-slate-400">Upload your historical sales data to train the forecasting model.</p>
       </div>

       <div 
          className={`
            relative p-12 border-2 border-dashed rounded-3xl text-center transition-all duration-300
            ${isDragging 
              ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
              : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
       >
          <input 
            type="file" 
            accept=".csv"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center gap-4 py-8">
             <div className={`
                p-6 rounded-full transition-colors duration-300
                ${isDragging ? 'bg-blue-500/20' : 'bg-slate-700/50'}
             `}>
                {uploading ? (
                   <Loader2 size={48} className="text-blue-400 animate-spin" />
                ) : file ? (
                   <FileType size={48} className="text-emerald-400" />
                ) : (
                   <UploadCloud size={48} className={isDragging ? 'text-blue-400' : 'text-slate-400'} />
                )}
             </div>
             
             <div className="space-y-1">
                {file ? (
                  <>
                     <p className="text-xl font-medium text-white">{file.name}</p>
                     <p className="text-sm text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle size={14} /> Ready to upload
                     </p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-medium text-white">
                      {isDragging ? 'Drop it here!' : 'Click or Drag & Drop'}
                    </p>
                    <p className="text-slate-500">Supported format: .CSV</p>
                  </>
                )}
             </div>
          </div>
       </div>

       {file && (
          <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-4">
             <button
                onClick={handleUpload}
                disabled={uploading}
                className={`
                   px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200
                   ${uploading 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] text-white hover:scale-105 active:scale-95'
                   }
                `}
             >
                {uploading ? 'Processing...' : 'Upload & Analyze'}
                {!uploading && <UploadCloud size={20} />}
             </button>
          </div>
       )}
    </div>
  );
};

export default Upload;
