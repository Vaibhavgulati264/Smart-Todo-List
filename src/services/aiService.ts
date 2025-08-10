import { Task, ContextEntry, AIInsight } from '../types';

class AIService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = 'mock-api-key';
  }

  async analyzeContext(entries: ContextEntry[]): Promise<AIInsight[]> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const insights: AIInsight[] = [];
    
    for (const entry of entries) {
      const content = entry.content.toLowerCase();
      
      // Mock context analysis
      if (content.includes('meeting') || content.includes('appointment')) {
        insights.push({
          type: 'priority',
          confidence: 0.85,
          suggestion: 'High priority due to meeting context',
          reasoning: 'Meeting-related tasks typically require immediate attention'
        });
      }
      
      if (content.includes('urgent') || content.includes('asap') || content.includes('immediately')) {
        insights.push({
          type: 'priority',
          confidence: 0.92,
          suggestion: 'Critical priority detected',
          reasoning: 'Urgent language indicates immediate action required'
        });
      }
      
      if (content.includes('deadline') || content.includes('due')) {
        insights.push({
          type: 'deadline',
          confidence: 0.78,
          suggestion: 'Consider shorter deadline',
          reasoning: 'Explicit deadline mentioned in context'
        });
      }
    }
    
    return insights;
  }

  async prioritizeTasks(tasks: Task[], context: ContextEntry[]): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock AI prioritization logic
    return tasks.map(task => {
      let priorityScore = Math.random() * 100;
      
      // Adjust based on keywords
      const content = (task.title + ' ' + task.description).toLowerCase();
      if (content.includes('urgent') || content.includes('critical')) {
        priorityScore += 20;
      }
      if (content.includes('meeting') || content.includes('presentation')) {
        priorityScore += 15;
      }
      if (content.includes('email') || content.includes('respond')) {
        priorityScore += 10;
      }
      
      // Adjust based on deadline proximity
      const deadline = new Date(task.deadline);
      const now = new Date();
      const daysUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 3600 * 24);
      
      if (daysUntilDeadline < 1) priorityScore += 30;
      else if (daysUntilDeadline < 3) priorityScore += 20;
      else if (daysUntilDeadline < 7) priorityScore += 10;
      
      priorityScore = Math.min(100, Math.max(0, priorityScore));
      
      let priority: Task['priority'] = 'low';
      if (priorityScore > 80) priority = 'critical';
      else if (priorityScore > 60) priority = 'high';
      else if (priorityScore > 40) priority = 'medium';
      
      return {
        ...task,
        priorityScore: Math.round(priorityScore),
        priority
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  async suggestDeadline(task: Partial<Task>, context: ContextEntry[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock deadline suggestion logic
    const baseDate = new Date();
    let daysToAdd = 7; // Default 1 week
    
    const content = (task.title + ' ' + task.description || '').toLowerCase();
    
    // Adjust based on complexity indicators
    if (content.includes('research') || content.includes('analysis')) {
      daysToAdd = 14; // 2 weeks for research tasks
    } else if (content.includes('email') || content.includes('call')) {
      daysToAdd = 2; // 2 days for communication tasks
    } else if (content.includes('meeting') || content.includes('presentation')) {
      daysToAdd = 5; // 5 days for preparation tasks
    } else if (content.includes('report') || content.includes('document')) {
      daysToAdd = 10; // 10 days for documentation tasks
    }
    
    // Check context for urgency
    const urgentContext = context.some(entry => 
      entry.content.toLowerCase().includes('urgent') || 
      entry.content.toLowerCase().includes('asap')
    );
    
    if (urgentContext) {
      daysToAdd = Math.ceil(daysToAdd * 0.5); // Halve the time for urgent tasks
    }
    
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    return baseDate.toISOString().split('T')[0];
  }

  async enhanceTaskDescription(task: Partial<Task>, context: ContextEntry[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const originalDescription = task.description || '';
    const relatedContext = context.filter(entry => 
      entry.content.toLowerCase().includes(task.title?.toLowerCase() || '')
    );
    
    let enhancement = originalDescription;
    
    if (relatedContext.length > 0) {
      const contextualInfo = relatedContext.map(entry => entry.content).join(' ');
      
      // Mock enhancement logic
      if (contextualInfo.includes('meeting')) {
        enhancement += '\n\n📅 Related to upcoming meeting - ensure preparation is complete.';
      }
      if (contextualInfo.includes('client') || contextualInfo.includes('customer')) {
        enhancement += '\n\n👥 Client-facing task - maintain professional standards.';
      }
      if (contextualInfo.includes('deadline') || contextualInfo.includes('due')) {
        enhancement += '\n\n⚠️ Time-sensitive - monitor deadline closely.';
      }
    }
    
    return enhancement;
  }

  async suggestCategory(task: Partial<Task>, existingCategories: string[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const content = (task.title + ' ' + task.description || '').toLowerCase();
    
    // Mock categorization logic
    if (content.includes('meeting') || content.includes('call') || content.includes('discussion')) {
      return 'Meetings';
    } else if (content.includes('email') || content.includes('message') || content.includes('respond')) {
      return 'Communication';
    } else if (content.includes('code') || content.includes('develop') || content.includes('bug')) {
      return 'Development';
    } else if (content.includes('research') || content.includes('study') || content.includes('learn')) {
      return 'Research';
    } else if (content.includes('report') || content.includes('document') || content.includes('write')) {
      return 'Documentation';
    } else if (content.includes('review') || content.includes('test') || content.includes('check')) {
      return 'Review';
    } else {
      return existingCategories[0] || 'General';
    }
  }

  async generateTaskSuggestions(context: ContextEntry[]): Promise<Partial<Task>[]> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const suggestions: Partial<Task>[] = [];
    
    for (const entry of context) {
      const content = entry.content.toLowerCase();
      
      // Mock task extraction from context
      if (content.includes('meeting') && !content.includes('scheduled')) {
        suggestions.push({
          title: 'Schedule meeting mentioned in context',
          description: `Follow up on meeting discussion from ${entry.source}`,
          category: 'Meetings',
          priority: 'medium'
        });
      }
      
      if (content.includes('email') && content.includes('respond')) {
        suggestions.push({
          title: 'Respond to important email',
          description: `Reply to email mentioned in ${entry.source} context`,
          category: 'Communication',
          priority: 'high'
        });
      }
      
      if (content.includes('deadline') || content.includes('due')) {
        suggestions.push({
          title: 'Review upcoming deadline',
          description: `Check and prepare for deadline mentioned in context`,
          category: 'Review',
          priority: 'high'
        });
      }
    }
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }
}

export const aiService = new AIService();