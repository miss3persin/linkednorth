"use client";
import React, { useState } from 'react';
import Sidebar from '@/app/components/layout/Sidebar';
import { X, ChevronDown, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Loader } from '@/app/components/ui/Loader';
import {
    validateTextField,
    validateSalaryValue,
    validateSalaryRange,
    validateDescription,
    validateUrlOrEmail,
} from '@/app/lib/formValidators';

export default function PostJobPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        jobType: 'Remote',
        contractType: 'Full-time',
        salaryMin: '',
        salaryMax: '',
        description: '',
        skills: [],
        requirements: '',
        applicationLink: '', // Required field
    });
    const [stepErrors, setStepErrors] = useState({});

    const clearStepError = (...fields) => {
        setStepErrors((prev) => {
            const next = { ...prev };
            fields.forEach((field) => {
                if (field in next) {
                    delete next[field];
                }
            });
            return next;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const fieldsToClear = [name];
        if (name === 'salaryMin' || name === 'salaryMax') {
            fieldsToClear.push('salaryRange');
        }
        clearStepError(...fieldsToClear);
    };

    const validateStepOne = () => {
        const errors = {};
        const titleError = validateTextField(formData.title, { label: 'Job title', minLength: 3, maxLength: 120 });
        const salaryMinError = validateSalaryValue('Min salary', formData.salaryMin);
        const salaryMaxError = validateSalaryValue('Max salary', formData.salaryMax);
        const salaryRangeError = validateSalaryRange(formData.salaryMin, formData.salaryMax);

        if (titleError) errors.title = titleError;
        if (salaryMinError) errors.salaryMin = salaryMinError;
        if (salaryMaxError) errors.salaryMax = salaryMaxError;
        if (salaryRangeError) errors.salaryRange = salaryRangeError;

        return errors;
    };

    const validateStepTwo = () => {
        const errors = {};
        const descriptionError = validateDescription(formData.description);
        const linkError = validateUrlOrEmail(formData.applicationLink);

        if (descriptionError) errors.description = descriptionError;
        if (linkError) errors.applicationLink = linkError;

        return errors;
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, skillInput.trim()]
                }));
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleNext = () => {
        const errors = step === 1 ? validateStepOne() : step === 2 ? validateStepTwo() : {};
        if (Object.keys(errors).length) {
            setStepErrors(errors);
            return;
        }

        setStepErrors({});
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStepErrors({});
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const stepOneErrors = validateStepOne();
        const stepTwoErrors = validateStepTwo();
        const combinedErrors = { ...stepOneErrors, ...stepTwoErrors };

        if (Object.keys(combinedErrors).length) {
            setStepErrors(combinedErrors);
            if (Object.keys(stepOneErrors).length) {
                setStep(1);
            } else {
                setStep(2);
            }
            return;
        }

        setStepErrors({});
        setLoading(true);

        try {
            const res = await fetch('/api/jobs/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to post job');

            setStep(4);
        } catch (err) {
            console.error('Job post error:', err);
            alert('Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Job Details
                return (
                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Product Manager"
                                className={`w-full border rounded-md px-4 py-3 text-sm outline-none transition-all focus:outline-none ${stepErrors.title ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-1 focus:ring-black'}`}
                            />
                            {stepErrors.title && (
                                <p className="text-xs mt-1 text-rose-500">{stepErrors.title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Workplace Type</label>
                            <div className="relative">
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full appearance-none border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none bg-white"
                                >
                                    <option>Remote</option>
                                    <option>On-site</option>
                                    <option>Hybrid</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-4">Contract Type</label>
                            <div className="flex flex-wrap gap-4">
                                {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${formData.contractType === type ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                            <div className={`w-2.5 h-2.5 rounded-full ${formData.contractType === type ? 'bg-black' : 'bg-transparent'}`}></div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="contractType"
                                            value={type}
                                            checked={formData.contractType === type}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-slate-600">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Min Salary</label>
                                <input
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    placeholder="e.g. 50000"
                                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none transition-all focus:outline-none ${stepErrors.salaryMin ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-1 focus:ring-black'}`}
                                />
                                {stepErrors.salaryMin && (
                                    <p className="text-[11px] mt-1 text-rose-500">{stepErrors.salaryMin}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Max Salary</label>
                                <input
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    placeholder="e.g. 80000"
                                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none transition-all focus:outline-none ${stepErrors.salaryMax ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-1 focus:ring-black'}`}
                                />
                                {stepErrors.salaryMax && (
                                    <p className="text-[11px] mt-1 text-rose-500">{stepErrors.salaryMax}</p>
                                )}
                            </div>
                        </div>
                        {stepErrors.salaryRange && (
                            <p className="text-[11px] mt-2 text-rose-500">{stepErrors.salaryRange}</p>
                        )}

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button
                                onClick={handleNext}
                                disabled={!formData.title}
                                className="flex items-center gap-2 bg-black text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                Continue
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                );
            case 2: // Job Description & Skills
                return (
                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Write a brief overview of the role..."
                                className={`w-full border rounded-md px-4 py-3 text-sm outline-none transition-all resize-none focus:outline-none ${stepErrors.description ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-1 focus:ring-black'}`}
                            />
                            {stepErrors.description && (
                                <p className="text-[11px] mt-1 text-rose-500">{stepErrors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Skills (Press Enter to add)</label>
                            <div className="space-y-3">
                                <div className="relative flex items-center">
                                    <input
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                        type="text"
                                        placeholder="e.g. React, Figma, Node.js"
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none transition-all pr-12"
                                    />
                                    <button
                                        onClick={addSkill}
                                        type="button"
                                        className="absolute right-2 p-1.5 bg-gray-50 border border-gray-200 rounded text-gray-400 hover:text-black transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                {formData.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map(skill => (
                                            <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} type="button" className="p-0.5 hover:bg-gray-200 rounded-full">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Job Application Link / Email <span className="text-red-500">*</span></label>
                                <input
                                    name="applicationLink"
                                    value={formData.applicationLink || ''}
                                    onChange={handleChange}
                                    placeholder="Application link or email (e.g. example.com/apply or hr@company.com)"
                                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none transition-all focus:outline-none ${stepErrors.applicationLink ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-gray-300 focus:ring-1 focus:ring-black'}`}
                                />
                                {stepErrors.applicationLink ? (
                                    <p className="text-xs mt-1 text-rose-500">{stepErrors.applicationLink}</p>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-1">Enter a URL or email address. Candidates will be directed here when they click "Apply Now".</p>
                                )}
                            </div>

                        <div className="flex justify-between pt-6 border-t border-gray-100">
                            <button
                                onClick={handleBack}
                                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!formData.description || !formData.applicationLink}
                                className="flex items-center gap-2 bg-black text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                Continue
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                );
            case 3: // Review Step
                return (
                    <div className="space-y-8 text-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Review Details</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Job Title</label>
                                    <p className="font-semibold text-slate-800">{formData.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Workplace</label>
                                        <p className="font-medium">{formData.jobType}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Contract</label>
                                        <p className="font-medium">{formData.contractType}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Salary Range</label>
                                    <p className="font-medium">{formData.salaryMin && formData.salaryMax ? `${formData.salaryMin} - ${formData.salaryMax}` : 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Skills</label>
                                    <p className="font-medium">{formData.skills.join(', ') || 'None listed'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Description</label>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{formData.description}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block mb-1">Application Link</label>
                                    <p className="text-blue-600 underline font-medium break-all">{formData.applicationLink}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 flex flex-col items-center">
                                <p className="text-[10px] self-start font-bold text-gray-400 uppercase tracking-widest mb-4">Preview of Job Card</p>
                                <div className="w-full bg-white rounded-xl p-5 shadow-md border border-gray-100 relative max-w-[340px]">
                                    <h3 className="font-bold text-slate-900 text-[15px] mb-2">{formData.title}</h3>
                                    <p className="text-[12px] text-gray-500 mb-4 line-clamp-3">{formData.description}</p>
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">{formData.contractType}</span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">{formData.jobType}</span>
                                    </div>
                                    <button className="w-full bg-black text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#1e293b] transition-colors">Apply Now</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-gray-100">
                            <button
                                onClick={handleBack}
                                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 bg-black text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
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
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        Publish Job
                                        <CheckCircle2 size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                );
            case 4: // Success Step
                return (
                    <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Job Posted Successfully!</h2>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm">
                            Your job listing is now live and being shown to thousands of potential candidates.
                        </p>
                        <div className="pt-8 flex flex-col gap-3 max-w-[280px] mx-auto">
                            <Button text="Go to Recruiter Hub" variant="black" link="/recruiter/hub" className="w-full py-3" />
                            <button onClick={() => { setFormData({ ...formData, title: '', description: '', skills: [] }); setStep(1); }} className="text-gray-500 text-sm font-medium hover:text-black hover:underline transition-all">
                                Post another job
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F8F9FB] mt-[72px] font-sans">
            <main className="flex-1 max-w-6xl mx-auto px-6 py-10 md:py-16">
                {step < 4 && (
                    <div className="flex flex-col md:flex-row justify-between mb-12 gap-6 md:gap-4 relative max-w-4xl mx-auto">
                        {[1, 2, 3].map(num => (
                            <div key={num} className="flex-1">
                                <div className={`h-1.5 mb-3 rounded-full hidden md:block transition-all duration-500 ${step > num ? 'bg-emerald-500' : step === num ? 'bg-black' : 'bg-gray-200'}`}></div>
                                <div className="flex items-start gap-3">
                                    <div className={`md:hidden w-1.5 self-stretch rounded-full mr-1 ${step > num ? 'bg-emerald-500' : step === num ? 'bg-black' : 'bg-gray-200'}`}></div>
                                    <div>
                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${step >= num ? 'text-slate-800' : 'text-gray-400'}`}>Step {num}</p>
                                        <p className={`text-sm font-bold ${step >= num ? 'text-slate-800' : 'text-gray-400'}`}>
                                            {num === 1 ? 'Job Details' : num === 2 ? 'Description' : 'Review'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className={`w-full max-w-4xl mx-auto bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden p-6 md:p-10 transition-all duration-500 ${step === 4 ? 'bg-white' : ''}`}>
                    {renderStep()}
                </div>
            </main>
        </div>
    );
}
