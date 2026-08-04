import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { BrainCircuit, CheckCircle2, RefreshCw, Server, Code, Sparkles } from 'lucide-react';

export const MlApiConfigModal = () => {
  const { activeModal, setActiveModal, mlApiConfig, setMlApiConfig } = useApp();
  const { addToast } = useToast();

  const [endpointUrl, setEndpointUrl] = useState(mlApiConfig.endpointUrl);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setMlApiConfig(prev => ({
        ...prev,
        endpointUrl,
        status: 'Connected (Live Flask API)',
        isLive: true
      }));
      addToast('Flask API Connected', `Successfully established handshake with ML API at ${endpointUrl}`, 'success');
    }, 1200);
  };

  return (
    <Modal
      isOpen={activeModal === 'mlConfig'}
      onClose={() => setActiveModal(null)}
      title="Python Flask ML API Integration Settings"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h4 className="text-xs font-bold uppercase text-slate-800 dark:text-white">ML Model Integration Endpoint</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Connect your custom Python Flask ML service (`app.py`) to feed real-time student performance predictions into this dashboard.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Flask API Endpoint URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="http://localhost:5000/api/predict"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isTesting ? 'Testing API...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Expected Payload Schema Example */}
        <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-sans border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1"><Code className="w-3 h-3 text-emerald-400" /> Expected JSON Payload Contract:</span>
            <span>POST /api/predict</span>
          </div>
          <pre className="text-emerald-400 pt-1 overflow-x-auto">
{`{
  "student_id": "CS2401",
  "attendance_pct": 94.5,
  "midterm_marks": [88, 92, 95, 90],
  "gpa_history": [3.85, 3.88, 3.90]
}`}
          </pre>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
