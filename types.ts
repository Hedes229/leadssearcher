export interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  source: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface SearchParams {
  query: string;
  platform: 'all' | 'linkedin' | 'google' | 'facebook';
  region: string;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  leads: Lead[];
  progressMessage: string;
}

export enum Platform {
  ALL = 'all',
  LINKEDIN = 'linkedin',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}