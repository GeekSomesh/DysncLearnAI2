import React, { useState } from "react";
import Scorecard from "./Scorecard";

type Response = 0 | 1 | 2 | 3 | 4;

interface Q {
  id: number;
  text: string;
  category: string;
}

const QUESTIONS: Q[] = [
  {
    id: 1,
    text: "Do you re-read a sentence in order to understand it?",
    category: "Reading",
  },
  { id: 2, text: "Do you lose your place when reading?", category: "Visual" },
  {
    id: 3,
    text: "Do letters seem to move or 'swim' on the page?",
    category: "Visual",
  },
  {
    id: 4,
    text: "Do you have trouble remembering what you just read?",
    category: "Memory",
  },
  {
    id: 5,
    text: "Do you find it hard to spell even simple words?",
    category: "Phonological",
  },
  {
    id: 6,
    text: "Do you mix up similar letters (b/d/p/q)?",
    category: "Visual",
  },
  {
    id: 7,
    text: "Do you find it hard to learn sequences (like phone numbers)?",
    category: "Memory",
  },
  {
    id: 8,
    text: "Do you avoid reading aloud because it's difficult?",
    category: "Reading",
  },
  {
    id: 9,
    text: "Do you have trouble sounding out unfamiliar words?",
    category: "Phonological",
  },
  {
    id: 10,
    text: "Do you find it hard to follow text with a finger or guide?",
    category: "Visual",
  },
  {
    id: 11,
    text: "Do you lose concentration while reading?",
    category: "Attention",
  },
  {
    id: 12,
    text: "Do you need more time than peers to read the same text?",
    category: "Reading",
  },
];

export const DyslexiaQuestionnaire: React.FC<{
  onComplete: (result: any) => void;
}> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<Response | null>>(
    Array(QUESTIONS.length).fill(null)
  );

  function setAnswer(idx: number, val: Response) {
    const copy = [...answers];
    copy[idx] = val;
    setAnswers(copy);
  }

  function next() {
    if (index < QUESTIONS.length - 1) setIndex(index + 1);
    else finish();
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  function finish() {
    // compute scoring
    const answered = answers.map((a) => (a === null ? 0 : a));
    const total = answered.reduce((s, v) => s + (v || 0), 0);
    const max = QUESTIONS.length * 4;
    const percent = (total / max) * 100;
    let band = "Low";
    if (percent > 66) band = "High";
    else if (percent > 33) band = "Moderate";

    // category breakdown
    const categories: { [k: string]: { score: number; max: number } } = {};
    QUESTIONS.forEach((q, i) => {
      const ans = answered[i] || 0;
      if (!categories[q.category])
        categories[q.category] = { score: 0, max: 0 };
      categories[q.category].score += ans;
      categories[q.category].max += 4;
    });

    const catArr = Object.keys(categories).map((k) => ({
      name: k,
      score: categories[k].score,
      max: categories[k].max,
    }));

    const result = { total, max, percent, band, categories: catArr };

    // call parent
    onComplete(result);
  }

  const q = QUESTIONS[index];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-100 to-yellow-50"></div>
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-10">
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              Step {index + 1} of {QUESTIONS.length}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-800">
              {q.text}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Never", value: 0 },
              { label: "Rarely", value: 1 },
              { label: "Sometimes", value: 2 },
              { label: "Often", value: 3 },
              { label: "Very Often", value: 4 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAnswer(index, opt.value as Response)}
                className={`p-8 rounded-lg text-center text-lg font-medium shadow-sm border ${
                  answers[index] === opt.value
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={prev}
                disabled={index === 0}
                className="px-4 py-2 bg-gray-200 rounded mr-2"
              >
                Back
              </button>
              <button
                onClick={next}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                {index < QUESTIONS.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DyslexiaQuestionnaire;
