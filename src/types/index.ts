export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  priorityScore: number;
  status: 'pending' | 'in-progress' | 'completed';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  aiSuggestions?: {
    enhancedDescription?: string;
    suggestedCategory?: string;
    suggestedDeadline?: string;
    contextualNotes?: string[];
  };
}

export interface ContextEntry {
  id: string;
  content: string;
  source: 'whatsapp' | 'email' | 'notes' | 'manual';
  timestamp: string;
  processed: boolean;
  insights?: string[];
  relatedTasks?: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  description?: string;
}

export interface AIInsight {
  type: 'priority' | 'deadline' | 'category' | 'enhancement';
  confidence: number;
  suggestion: string;
  reasoning: string;
}

export interface UserPreferences {
  workingHours: {
    start: string;
    end: string;
  };
  preferredCategories: string[];
  notificationSettings: {
    deadlineReminders: boolean;
    priorityAlerts: boolean;
    contextInsights: boolean;
  };
}