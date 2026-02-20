import Sidebar from '../components/layout/Sidebar';
import ResumeBuilderClient from './ResumeBuilderClient';

export default function ResumeBuilderPage() {
  return (
    <div className="resume-builder-page flex min-h-screen bg-white mt-[72px]">
      <Sidebar />

      <div className="flex-1 px-4 sm:px-6 md:px-8 py-6">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Resume Builder</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Build Your Resume</p>
        <ResumeBuilderClient />
      </div>
    </div>
  );
}
