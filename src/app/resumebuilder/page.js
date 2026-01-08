import Sidebar from '../components/layout/Sidebar';

export default function ResumeBuilderPage() {
  return (
    <div className="flex min-h-screen bg-white mt-16 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 px-4 sm:px-6 md:px-8 py-6">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Resume Builder</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Build Your Resume</p>

        <div className="mt-6 w-full">
          {/* Import Section */}
          <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="bg-blue-600 text-white rounded-md h-7 w-7 flex items-center justify-center text-sm font-semibold">N</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Import from LinkedIn</p>
                <p className="text-xs text-gray-500">Save time by importing your professional information directly from LinkedIn</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white text-xs px-3 sm:px-4 py-2 rounded-md w-full sm:w-auto">
              Import from LinkedIn
            </button>
          </div>

          {/* Steps */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-6">
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((num,index)=> (
                <div key={index} className={`h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full border ${num===1 ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-500'}`}>{num}</div>
              ))}
            </div>
            <span className="text-xs text-gray-400 mt-2 sm:mt-0 ml-0 sm:ml-auto">Step 1 of 5: Template</span>
          </div>

          <p className="mt-6 sm:mt-8 text-sm font-medium text-gray-700">Choose a Resume Template</p>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
            {/* Template 1 */}
            <div className="border rounded-lg p-3 hover:shadow cursor-pointer">
              <img src="/template1.png" className="w-full rounded" />
              <p className="mt-2 sm:mt-3 text-sm font-semibold text-gray-700">Professional</p>
              <p className="text-xs text-gray-500">Clean and traditional design perfect for corporate roles</p>
            </div>

            {/* Template 2 */}
            <div className="border rounded-lg p-3 hover:shadow cursor-pointer">
              <img src="/template2.png" className="w-full rounded" />
              <p className="mt-2 sm:mt-3 text-sm font-semibold text-gray-700">Modern</p>
              <p className="text-xs text-gray-500">Contemporary design with bold colors and clean lines</p>
            </div>

            {/* Template 3 */}
            <div className="border rounded-lg p-3 hover:shadow cursor-pointer">
              <img src="/template3.png" className="w-full rounded" />
              <p className="mt-2 sm:mt-3 text-sm font-semibold text-gray-700">Creative</p>
              <p className="text-xs text-gray-500">Vibrant and dynamic design for creative professionals</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2 sm:gap-0">
            <button className="text-xs px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto">Save Draft</button>
            <button className="text-xs px-4 py-2 bg-gray-900 text-white rounded-md flex items-center gap-2 w-full sm:w-auto justify-center">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
