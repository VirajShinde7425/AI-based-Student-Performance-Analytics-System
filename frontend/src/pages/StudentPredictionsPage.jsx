import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BrainCircuit,
  TrendingUp,
  ShieldAlert,
  BadgeCheck
} from "lucide-react";

export const StudentPredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const response = await api.get("/my/predictions");
        setPredictions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadPredictions();
  }, []);

  if (predictions.length === 0) {
    return (
      <div className="saas-card p-8 text-center">
        <BrainCircuit className="mx-auto w-12 h-12 text-slate-400 mb-4" />

        <h2 className="text-2xl font-bold">
          No Predictions Available
        </h2>

        <p className="text-slate-500 mt-2">
          AI predictions have not been generated yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          AI Predictions
        </h1>

        <p className="text-slate-500">
          Machine Learning prediction results for your academic performance.
        </p>
      </div>

      {predictions.map((prediction, index) => (

        <div
          key={index}
          className="saas-card p-6 space-y-5"
        >

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <div>
              <TrendingUp className="w-7 h-7 text-blue-600 mb-2" />

              <p className="text-xs uppercase text-slate-500">
                Predicted GPA
              </p>

              <h2 className="text-2xl font-bold">
                {prediction.predictedGpa}
              </h2>
            </div>

            <div>
              <BadgeCheck className="w-7 h-7 text-green-600 mb-2" />

              <p className="text-xs uppercase text-slate-500">
                Predicted Grade
              </p>

              <h2 className="text-2xl font-bold">
                {prediction.predictedGrade}
              </h2>
            </div>

            <div>
              <ShieldAlert className="w-7 h-7 text-red-500 mb-2" />

              <p className="text-xs uppercase text-slate-500">
                Risk Level
              </p>

              <h2 className="text-2xl font-bold">
                {prediction.riskLevel}
              </h2>
            </div>

            <div>
              <BrainCircuit className="w-7 h-7 text-purple-600 mb-2" />

              <p className="text-xs uppercase text-slate-500">
                Confidence
              </p>

              <h2 className="text-2xl font-bold">
                {prediction.modelConfidence}%
              </h2>
            </div>

          </div>

          <div className="border-t pt-4">

            <h3 className="font-semibold mb-2">
              AI Recommendation
            </h3>

            <p className="text-slate-600 dark:text-slate-300">
              {prediction.recommendation}
            </p>

          </div>

        </div>

      ))}

    </div>
  );
};