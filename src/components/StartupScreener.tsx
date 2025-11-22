import React from "react";

interface Props {
  onYes: () => void;
  onSkip: () => void;
}

export const StartupScreener: React.FC<Props> = ({ onYes, onSkip }) => {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-100 to-yellow-50"></div>
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 2C10 2 8 3 7 5C5 6 4 8 4 10C4 12 5 14 7 15C8 17 10 18 12 18C14 18 16 17 17 15C19 14 20 12 20 10C20 8 19 6 17 5C16 3 14 2 12 2Z"
                  fill="white"
                />
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 mb-4">
              Welcome to LexiLearn
            </h1>

            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              We’ll run a short 2–3 minute screen to recommend reading settings
              (font, spacing and line-focus) tailored to you. This helps make
              the site easier to read and more comfortable.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onYes}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-semibold shadow-md"
              >
                Yes, take the quick test
              </button>

              <button
                onClick={onSkip}
                className="px-6 py-3 bg-white border border-gray-200 rounded-full text-lg font-medium shadow-sm"
              >
                No, skip for now
              </button>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              You can run this test anytime from the sidebar under "Check for
              Dyslexia".
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupScreener;
