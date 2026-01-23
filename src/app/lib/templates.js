import ProfessionalTemplate from '../components/templates/ProfessionalTemplate'
import ModernTemplate from '../components/templates/ModernTemplate'
import CreativeTemplate from '../components/templates/CreativeTemplate'
import ProfessionalPDF from '@/app/resumebuilder/pdf/ProfessionalPDF'

export const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and traditional design perfect for corporate roles',
    component: ProfessionalTemplate,
    pdfComponent: ProfessionalPDF,
    thumbnail: '/template1.png',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold colors and clean lines',
    component: ModernTemplate,
    thumbnail: '/template2.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant and dynamic design for creative professionals',
    component: CreativeTemplate,
    thumbnail: '/template3.png',
  },
]
