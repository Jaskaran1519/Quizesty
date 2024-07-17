import Image from "next/image";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/wuJOPaMNbUv
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-auto p-4">
      <div className="relative w-full md:w-1/2 flex justify-center">
        <Image
          src="/middle finger.png"
          width={500}
          height={500}
          alt="Enhanced Image"
          className=""
        />
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <FilterIcon className="w-4 h-4" />
            <span>Reducing blur</span>
            <CheckIcon className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <ZoomInIcon className="w-4 h-4" />
            <span>Improving resolution</span>
            <CheckIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-8">
        <h1 className="text-2xl font-bold mb-4">
          How to enhance image quality
        </h1>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-lg group overflow-hidden">
            <h2 className="text-xl font-bold">1. Upload your pdf</h2>
            <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 text-sm text-gray-500 mt-2">
              Select pdf from your library that you'd like to summarize.
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-lg group overflow-hidden">
            <h2 className="text-xl font-bold">2. Select the pages</h2>
            <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 text-sm text-gray-500 mt-2">
              Choose the page you want to start the process from and the number
              of pages
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-lg group overflow-hidden">
            <h2 className="text-xl font-bold">3. Summarisation</h2>
            <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 text-sm text-gray-500 mt-2">
              Click on the summarize button to summarize the pdf
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-lg group overflow-hidden">
            <h2 className="text-xl font-bold">4. Generate quiz</h2>
            <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 text-sm text-gray-500 mt-2">
              Once the pdf is summarized, click on the generate quiz button to
              get the quiz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function FilterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ZoomInIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
      <line x1="11" x2="11" y1="8" y2="14" />
      <line x1="8" x2="14" y1="11" y2="11" />
    </svg>
  );
}