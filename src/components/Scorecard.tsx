import React from "react";

interface CategoryScore {
  name: string;
  score: number;
  max: number;
}

interface Props {
  total: number;
  max: number;
  percent: number;
  band: string;
  categories: CategoryScore[];
  onContinue: () => void;
}

export const Scorecard: React.FC<Props> = ({
  total,
  max,
  percent,
  band,
  categories,
  onContinue,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Screener Result</h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <div className="text-lg font-semibold">
            Total score: {total} / {max}
          </div>
          <div className="text-sm text-gray-600">
            Percentage: {percent.toFixed(1)}%
          </div>
          <div className="mt-2 font-semibold">
            Risk band: <span className="text-indigo-600">{band}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {categories.map((c) => (
            <div key={c.name} className="bg-white p-4 rounded shadow-sm border">
              <div className="font-medium text-gray-800">{c.name}</div>
              <div className="text-sm text-gray-500">
                {c.score} / {c.max}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow"
          >
            Proceed to site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
