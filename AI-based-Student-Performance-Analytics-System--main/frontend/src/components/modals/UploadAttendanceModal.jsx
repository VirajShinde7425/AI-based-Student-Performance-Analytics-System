import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { UploadCloud, FileCheck, AlertCircle } from 'lucide-react';

export const UploadAttendanceModal = () => {
  const { activeModal, setActiveModal } = useApp();
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      addToast('No file selected', 'Please choose a CSV or XLSX attendance register file.', 'warning');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      addToast('Upload Successful', `Attendance data from "${file.name}" imported for 84 students.`, 'success');
      setActiveModal(null);
      setFile(null);
    }, 1200);
  };

  return (
    <Modal
      isOpen={activeModal === 'uploadAttendance'}
      onClose={() => setActiveModal(null)}
      title="Upload Attendance Register (CSV / Excel)"
    >
      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-primary-500 transition-colors">
          <UploadCloud className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Drag & Drop Attendance File</p>
          <p className="text-xs text-slate-400 mt-1">Supports .csv, .xlsx, .xls formats (Max 10MB)</p>

          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
            id="attendance-file-input"
          />
          <label
            htmlFor="attendance-file-input"
            className="mt-4 inline-block px-4 py-2 text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-950/40 rounded-xl hover:bg-primary-100 cursor-pointer transition-colors"
          >
            Browse Local File
          </label>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button onClick={() => setFile(null)} className="text-red-500 hover:underline">Remove</button>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/20 transition-all disabled:opacity-50"
          >
            {isUploading ? 'Processing Import...' : 'Import Attendance'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
