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
      <div className="bg-[#FFFFF0] border-2 border-green-200 rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 font-['Comic_Sans_MS']">Screener Result</h2>
        <div className="bg-[#F7FDEB] p-4 rounded mb-4 border border-green-200">
          <div className="text-lg font-semibold">
            Total score: {total} / {max}
          </div>
          <div className="text-sm text-gray-600">
            Percentage: {percent.toFixed(1)}%
          </div>
          <div className="mt-2 font-semibold text-gray-800">
            Risk band: <span className="text-green-700">{band}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {categories.map((c) => (
            <div key={c.name} className="bg-white p-4 rounded shadow-sm border-2 border-green-100">
              <div className="font-medium text-gray-800 font-['Comic_Sans_MS']">{c.name}</div>
              <div className="text-sm text-gray-600">
                {c.score} / {c.max}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-green-400 hover:bg-green-500 text-gray-900 rounded-full shadow"
          >
            Proceed to site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
