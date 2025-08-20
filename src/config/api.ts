export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  UPLOAD: '/api/documents/upload',
  QUERY: '/api/query',
  DOCUMENTS: '/api/documents',
  DELETE_DOCUMENT: (id: string) => `/api/documents/${id}`,
  HEALTH: '/health',
} as const;