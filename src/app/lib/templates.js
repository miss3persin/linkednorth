'use client';

// Utility function to normalize arrays
export const normalizeArray = (arr, key) => {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr.map(item => (typeof item === 'string' ? item : key ? item[key] : JSON.stringify(item)));
  if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const createTemplateMeta = ({ id, name, description, thumbnail, pdfImporter }) => ({
  id,
  name,
  description,
  thumbnail,
  async loadPdfComponent() {
    const mod = await pdfImporter()
    return mod.default || mod
  },
})

export const templates = [
  createTemplateMeta({
    id: 'professional',
    name: 'Professional',
    description: 'Clean and traditional design perfect for corporate roles',
    thumbnail: '/template1.png',
    pdfImporter: () => import('../resumebuilder/pdf/ProfessionalPDF'),
  }),
  createTemplateMeta({
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold colors and clean lines',
    thumbnail: '/template2.png',
    pdfImporter: () => import('../components/templates/ModernTemplate'),
  }),
  createTemplateMeta({
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant and artistic design for creative professionals',
    thumbnail: '/template3.png',
    pdfImporter: () => import('../components/templates/CreativeTemplate'),
  }),
]
