import Sidebar from '../components/layout/Sidebar';

export default function ResumeBuilderPage() {
  return (
    <div className="flex min-h-screen bg-white mt-16">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 px-8 py-6">
        <h1 className="text-xl font-semibold text-gray-800">Resume Builder</h1>
        <p className="text-sm text-gray-500 mt-1">Build Your Resume</p>

        <div className="mt-6 w-full">
          <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white rounded-md h-7 w-7 flex items-center justify-center text-sm font-semibold">N</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Import from LinkedIn</p>
                <p className="text-xs text-gray-500">Save time by importing your professional information directly from LinkedIn</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md">Import from LinkedIn</button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[1,2,3,4,5].map((num,index)=> (
              <div key={index} className={`h-8 w-8 flex items-center justify-center rounded-full border ${num===1 ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-500'}`}>{num}</div>
            ))}
            <span className="text-xs text-gray-400 ml-auto">Step 1 of 5: Template</span>
          </div>

          <p className="mt-8 text-sm font-medium text-gray-700">Choose a Resume Template</p>

          <div className="grid grid-cols-3 gap-6 mt-4">
            {/* Template 1 */}
            <div className="border rounded-lg p-3 hover:shadow cursor-pointer">
              <img src="/template1.png" className="w-full rounded" />
              <p className="mt-3 text-sm font-semibold text-gray-700">Professional</p>
              <p className="text-xs text-gray-500">Clean and traditional design perfect for corporate roles</p>
            </div>

            {/* Template 2 */}
            <div className="border rounded-lg p-3 hover:shadow cursor-pointer">
              <img src="/template2.png" className="w-full rounded" />
              <p className="mt-3 text-sm font-semibold text-gray-700">Modern</p>
              <p className="text-xs text-gray-500">Contemporary design with bold colors and clean lines</p>
            </div>

            {/* Template 3 */}
            <div className="border rounded-lg p-3 hover:shadow cursor-pointer">
              <img src="/template3.png" className="w-full rounded" />
              <p className="mt-3 text-sm font-semibold text-gray-700">Creative</p>
              <p className="text-xs text-gray-500">Vibrant and dynamic design for creative professionals</p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button className="text-xs px-4 py-2 border border-gray-300 rounded-md">Save Draft</button>
            <button className="text-xs px-4 py-2 bg-gray-900 text-white rounded-md flex items-center gap-2">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
