export interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  contactId: string;
  value: number;
  probability: number;
  stage: string;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
  status?: 'won' | 'lost';
  previousStage?: string;
  isArchived?: boolean;
  archivedAt?: string;
  customFields?: CustomField[];
  assignedTo?: string;
}

export interface Stage {
  id: string;
  name: string;
  deals: string[];
}

export interface Note {
  id: string;
  dealId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LostReason {
  id: string;
  dealId: string;
  reason: string;
  notes?: string;
  timestamp: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface TableColumn {
  id: string;
  label: string;
  accessor: string;
  isVisible: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  lastContact: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  website: string;
  contacts: string[];
  deals: string[];
  customFields?: CustomField[];
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  entityId: string;
  entityType: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  permissions?: UserPermissions;
  teamId?: string;
}

export interface UserPermissions {
  deals: {
    view: 'own' | 'team' | 'all';
    create: boolean;
    edit: 'own' | 'team' | 'all';
    delete: 'own' | 'team' | 'all';
  };
  contacts: {
    view: 'own' | 'team' | 'all';
    create: boolean;
    edit: 'own' | 'team' | 'all';
    delete: 'own' | 'team' | 'all';
  };
  companies: {
    view: 'own' | 'team' | 'all';
    create: boolean;
    edit: 'own' | 'team' | 'all';
    delete: 'own' | 'team' | 'all';
  };
  analytics: {
    view: 'own' | 'team' | 'all';
  };
  team: {
    manage: boolean;
  };
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  votes: number;
  category: 'feature' | 'enhancement' | 'bug';
  createdAt: string;
  updatedAt: string;
}

export interface Forecast {
  id: string;
  period: string;
  predictedValue: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilter {
  status?: string[];
  source?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface LeadSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Settings {
  dealRotting: {
    enabled: boolean;
    thresholds: {
      warning: number;
      danger: number;
    };
  };
  fireflies: {
    apiKey: string;
    enabled: boolean;
  };
  instantly: {
    apiKey: string;
    enabled: boolean;
  };
  display: {
    showCreatedDate: boolean;
    showCompany: boolean;
    showValue: boolean;
    showProbability: boolean;
    showExpectedCloseDate: boolean;
    showCustomFields: boolean;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface InstantlyResponse {
  id: string;
  subject: string;
  from: string;
  content: string;
  campaign_id: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface FirefliesTranscript {
  id: string;
  title: string;
  organizer_email: string;
  transcript_url: string;
  participants: string[];
  duration: number;
  date: string;
  meeting_attendees: {
    displayName: string;
    email: string;
    name: string;
  }[];
  summary: {
    topics_discussed: string[];
    action_items: string[];
    overview: string;
  };
}