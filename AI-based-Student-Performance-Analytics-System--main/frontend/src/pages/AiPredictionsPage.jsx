import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import {
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Code,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const AiPredictionsPage = () => {
const {
    predictionData,
    runInference,
    setActiveModal,
    mlApiConfig
} = useApp();
  const { addToast } = useToast();

  const [filterRisk, setFilterRisk] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredStudents =
    predictionData
        ? predictionData.studentPredictions.filter(s => {
              if (filterRisk === "All") return true;
              return s.riskLevel === filterRisk;
          })
        : [];

  const handleRunInference = async () => {

    setIsRefreshing(true);

    addToast(
        "Flask ML",
        "Running prediction model...",
        "info"
    );

    const success = await runInference();

    if (success) {

        addToast(
            "Success",
            "Predictions updated successfully.",
            "success"
        );

    } else {

        addToast(
            "Error",
            "Unable to connect to Flask API.",
            "error"
        );

    }

    setIsRefreshing(false);
};

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="saas-card p-6 bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 text-white border-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
            <BrainCircuit className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">AI Early Warning & Performance Prediction Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
                Random Forest + Linear Regression
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Fed by student biometric attendance records, mid-term evaluation scores, and historical GPA trajectories.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* <button
            onClick={() => setActiveModal('mlConfig')}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Server className="w-4 h-4" /> API Endpoint Config
          </button> */}
          <button
            onClick={handleRunInference}
            disabled={isRefreshing}
            className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Running ML Model...' : 'Re-Run ML Inference'}
          </button>
        </div>
      </div>

      {/* Flask API Integration Status Bar */}
      <div className="saas-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/50 dark:bg-slate-800/60 border-emerald-200 dark:border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Flask Backend Status:</span>
          <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">{mlApiConfig.endpointUrl}</span>
          <span className="text-[11px] text-slate-400">({mlApiConfig.status})</span>
        </div>
        <button
          onClick={() => setActiveModal('mlConfig')}
          className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
        >
          <Code className="w-3.5 h-3.5" /> View Python Integration Contract
        </button>
      </div>

      {/* Top 4 Prediction Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Prediction Accuracy</span>
            <span className="text-2xl font-black text-emerald-600">
              {predictionData ? `${predictionData.modelAccuracy}%` : "..."}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Cross-Validated R² Score</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Model Confidence</span>
            <span className="text-2xl font-black text-primary-600">
              {predictionData ? `${predictionData.modelConfidence}%` : "..."}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">High Certainty Probability</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-primary-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Predicted At Risk</span>
            <span className="text-2xl font-black text-red-600">
              {predictionData
                ? `${predictionData.studentsAtRiskCount} Students`
                : "..."}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Requires Remedial Action</span>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between border-l-4 border-l-indigo-500">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">Likely Top Performers</span>
            <span className="text-2xl font-black text-indigo-600">
              {/* {predictionData
                ? `${predictionData.likelyTopPerformersCount} Candidates`
                : "..."} */}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Predicted GPA &gt; 3.80</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Prediction Table & Recommendation Cards */}
      <div className="space-y-4">
        {/* Table Filter Tabs */}
        <div className="saas-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter ML Risk Flag:</span>
            <div className="flex gap-1">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                    filterRisk === r
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-slate-400">Displaying {filteredStudents.length} Predicted Vectors</span>
        </div>

        {/* Prediction Results Table */}
        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5 pl-5">Student</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Current GPA</th>
                  <th className="p-3.5">Predicted GPA</th>
                  <th className="p-3.5">Predicted Grade</th>
                  <th className="p-3.5">ML Risk Level</th>
                  <th className="p-3.5">Confidence</th>
                  <th className="p-3.5 pr-5">AI Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.studentId} className="table-hover-row">
                    <td className="p-3.5 pl-5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <img
                        src={s.avatarUrl}
                        alt={s.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div>{s.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.rollNumber}</div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold">{s.currentAttendance}%</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">{s.currentGpa}</td>
                    <td className="p-3.5 font-extrabold text-primary-600 text-sm">
                      {s.predictedGpa}
                    </td>
                    <td className="p-3.5 font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-black">
                        {s.predictedGrade}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={s.riskLevel}>{s.riskLevel}</Badge>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600">{s.confidence}%</td>
                    <td className="p-3.5 pr-5 max-w-xs">
                      <p className="text-slate-600 dark:text-slate-300 truncate" title={s.recommendation}>
                        {s.recommendation}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categorized AI Interventions Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">Needs Extra Classes</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Shows students flagged for low scores in Machine Learning theory. Scheduled for Saturday remedial workshops.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h4 className="text-xs font-bold text-red-800 dark:text-red-300 uppercase">Improve Attendance</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Shows students below 75% attendance. Automatic guardian SMS notifications dispatched.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Likely to Improve</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Shows students demonstrating positive GPA gradient over the past 3 semesters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Excellent Progress</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Shows top candidates nominated for research assistantships & honors projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
