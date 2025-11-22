import React from "react";

interface Props {
  onYes: () => void;
  onSkip: () => void;
}

export const StartupScreener: React.FC<Props> = ({ onYes, onSkip }) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* Cream paper background with soft green tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFF0] via-[#F7FDEB] to-[#FFFDF2]"></div>
      <div className="relative min-h-screen flex items-center justify-center p-6">
        {/* Paper card */}
        <div className="w-full max-w-4xl bg-white rounded-2xl border-2 border-green-200 shadow-md p-10 md:p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-300 mb-6 shadow-sm border border-green-400">
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

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 font-['Comic_Sans_MS']">Welcome to LexiLearn</h1>
            <div className="h-1 w-24 bg-green-300 rounded mx-auto mb-6"></div>

            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 font-['Comic_Sans_MS']">
              We’ll run a short 2–3 minute screen to recommend reading settings
              (font, spacing and line-focus) tailored to you. This helps make
              the site easier to read and more comfortable.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onYes}
                className="px-8 py-3 bg-green-400 hover:bg-green-500 text-gray-900 rounded-full text-lg font-semibold shadow"
              >
                Yes, take the quick test
              </button>

              <button
                onClick={onSkip}
                className="px-6 py-3 bg-[#FFFDF2] border-2 border-green-200 rounded-full text-lg font-medium text-gray-800 shadow-sm hover:bg-[#F9FFE8]"
              >
                No, skip for now
              </button>
            </div>

            <div className="mt-8 text-sm text-gray-600 font-['Comic_Sans_MS']">
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
