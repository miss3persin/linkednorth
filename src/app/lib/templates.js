import ProfessionalTemplate from '../components/templates/ProfessionalTemplate'
import ModernTemplate from '../components/templates/ModernTemplate'
import CreativeTemplate from '../components/templates/CreativeTemplate'

// Utility function to normalize arrays
export const normalizeArray = (arr, key) => {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr.map(item => (typeof item === 'string' ? item : key ? item[key] : JSON.stringify(item)));
  if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

export const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and traditional design perfect for corporate roles',
    component: ProfessionalTemplate,
    pdfComponent: ProfessionalTemplate,
    thumbnail: '/template1.png',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold colors and clean lines',
    component: ModernTemplate,
    pdfComponent: ModernTemplate,
    thumbnail: '/template2.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant and artistic design for creative professionals',
    component: CreativeTemplate,
    pdfComponent: CreativeTemplate,
    thumbnail: '/template3.png',
  },
]
