"use client";

import React, { useState } from 'react';
import { Upload, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Loader } from '@/app/components/ui/Loader';
import { validateTextField } from '@/app/lib/formValidators';
import Image from 'next/image';
import { useAuthFetch } from '@/app/lib/useAuthFetch';

export default function CompanyProfileSetup() {
    const router = useRouter();
    const authFetch = useAuthFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        location: '',
        industry: '',
        logoUrl: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const fileInputRef = useRef(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const clearFieldError = (field) => {
        setFieldErrors((prev) => {
            if (!prev[field]) return prev;
            const { [field]: _omit, ...rest } = prev;
            return rest;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        clearFieldError(name);
    };

    const triggerLogoUpload = () => {
        fileInputRef.current?.click();
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB');
            return;
        }

        setUploadingLogo(true);
        setError(null);

        try {
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', file);

            const res = await authFetch('/api/recruiter/upload-logo', {
                method: 'POST',
                body: formDataToUpload,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to upload logo');
            }

            setLogoPreview(data.publicUrl);
            setFormData(prev => ({ ...prev, logoUrl: data.publicUrl }));
        } catch (err) {
            console.error('Logo upload error:', err);
            setError(`Upload failed: ${err.message}`);
        } finally {
            setUploadingLogo(false);
        }
    };

    const runValidation = () => {
        const validationErrors = {};
        const companyNameError = validateTextField(formData.companyName, { label: 'Company name', minLength: 2, maxLength: 90 });
        const locationError = validateTextField(formData.location, { label: 'Headquarters location', minLength: 3, maxLength: 80 });

        if (companyNameError) validationErrors.companyName = companyNameError;
        if (locationError) validationErrors.location = locationError;
        if (!formData.industry) validationErrors.industry = 'Please select an industry.';

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = runValidation();
        if (Object.keys(validationErrors).length) {
            setFieldErrors(validationErrors);
            setError(null);
            return;
        }

        setFieldErrors({});
        setLoading(true);
        setError(null);

        try {
            const res = await authFetch('/api/recruiter/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to save company profile');
            }

            // Success - redirect to job post setup
            router.push('/recruiter/post-job');
        } catch (err) {
            console.error('Setup error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F8F9FB] mt-[72px]">
            <main className="flex-1 flex flex-col items-center pt-12 md:pt-20 px-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-[28px] font-bold text-[#0F172A] mb-3">
                        Set Up Your Company Profile
                    </h1>
                    <p className="text-sm md:text-base text-gray-500">
                        This information will be displayed on your job posts.
                    </p>
                </div>
                <div className="w-full max-w-[540px] bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10 mb-20">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="block text-[13px] font-semibold text-gray-700">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                placeholder="e.g. Compawork PLC"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300 text-sm"
                                onChange={handleChange}
                            />
                            {fieldErrors.companyName && (
                                <p className="text-[11px] mt-1 text-rose-500">
                                    {fieldErrors.companyName}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[13px] font-semibold text-gray-700">
                                Company Logo
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-[#F1F5F9] rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0 overflow-hidden">
                                    {logoPreview ? (
                                        <Image
                                            src={logoPreview}
                                            alt="Company logo preview"
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">No Logo</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={triggerLogoUpload}
                                    disabled={uploadingLogo}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {uploadingLogo ? (
                                        <>
                                            <Loader size="xs" showMessage={false} inline className="text-gray-500" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={14} />
                                            Upload Square Logo
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[13px] font-semibold text-gray-700">
                                Headquarters Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Lagos, Nigeria"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300 text-sm"
                                onChange={handleChange}
                            />
                            {fieldErrors.location && (
                                <p className="text-[11px] mt-1 text-rose-500">
                                    {fieldErrors.location}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[13px] font-semibold text-gray-700">
                                Industry
                            </label>
                            <div className="relative">
                                <select
                                    name="industry"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm text-gray-500"
                                    onChange={handleChange}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select an industry</option>
                                    <option value="tech">Technology</option>
                                    <option value="design">Design</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="finance">Finance</option>
                                    <option value="healthcare">Healthcare</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <ChevronDown size={16} className="text-gray-400" />
                                </div>
                            </div>
                            {fieldErrors.industry && (
                                <p className="text-[11px] mt-1 text-rose-500">
                                    {fieldErrors.industry}
                                </p>
                            )}
                        </div>

                        {error && <p className="text-red-500 text-xs italic">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white text-sm font-bold py-3.5 rounded-lg hover:bg-[#1e293b] transition-colors mt-4 flex items-center justify-center gap-2"
                        >
                        {loading ? (
                            <>
                                <Loader
                                    size="sm"
                                    showMessage={false}
                                    inline
                                    spinnerColor="rgba(255,255,255,0.35)"
                                    accentColor="#ffffff"
                                />
                                Saving...
                            </>
                        ) : (
                            'Save & Continue to Job Post'
                        )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
