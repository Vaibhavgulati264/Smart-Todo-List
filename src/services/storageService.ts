import { Task, ContextEntry, Category } from '../types';

class StorageService {
  private TASKS_KEY = 'smart-todo-tasks';
  private CONTEXT_KEY = 'smart-todo-context';
  private CATEGORIES_KEY = 'smart-todo-categories';

  // Tasks
  getTasks(): Task[] {
    const stored = localStorage.getItem(this.TASKS_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultTasks();
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveTasks(tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  }

  // Context Entries
  getContextEntries(): ContextEntry[] {
    const stored = localStorage.getItem(this.CONTEXT_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultContext();
  }

  saveContextEntries(entries: ContextEntry[]): void {
    localStorage.setItem(this.CONTEXT_KEY, JSON.stringify(entries));
  }

  addContextEntry(entry: ContextEntry): void {
    const entries = this.getContextEntries();
    entries.push(entry);
    this.saveContextEntries(entries);
  }

  // Categories
  getCategories(): Category[] {
    const stored = localStorage.getItem(this.CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultCategories();
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  private getDefaultTasks(): Task[] {
    return [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Draft and finalize the Q4 project proposal for the new mobile app initiative',
        category: 'Work',
        priority: 'high',
        priorityScore: 85,
        status: 'in-progress',
        deadline: '2025-01-20',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
        tags: ['proposal', 'mobile', 'Q4']
      },
      {
        id: '2',
        title: 'Review team performance metrics',
        description: 'Analyze the monthly performance data and prepare feedback for team members',
        category: 'Management',
        priority: 'medium',
        priorityScore: 65,
        status: 'pending',
        deadline: '2025-01-18',
        createdAt: '2025-01-14T09:00:00Z',
        updatedAt: '2025-01-14T09:00:00Z',
        tags: ['review', 'team', 'metrics']
      },
      {
        id: '3',
        title: 'Update documentation',
        description: 'Update the API documentation to reflect recent changes in the authentication system',
        category: 'Development',
        priority: 'low',
        priorityScore: 35,
        status: 'pending',
        deadline: '2025-01-25',
        createdAt: '2025-01-13T14:00:00Z',
        updatedAt: '2025-01-13T14:00:00Z',
        tags: ['documentation', 'API', 'auth']
      }
    ];
  }

  private getDefaultContext(): ContextEntry[] {
    return [
      {
        id: '1',
        content: 'Meeting with client tomorrow at 2 PM to discuss project requirements. Need to prepare presentation slides.',
        source: 'email',
        timestamp: '2025-01-15T08:30:00Z',
        processed: true,
        insights: ['High priority meeting requiring preparation', 'Presentation task identified'],
        relatedTasks: ['1']
      },
      {
        id: '2',
        content: 'Urgent: The API documentation needs to be updated before the next release. Sarah mentioned this in the standup.',
        source: 'notes',
        timestamp: '2025-01-15T09:15:00Z',
        processed: true,
        insights: ['Urgent documentation task', 'Team dependency identified'],
        relatedTasks: ['3']
      },
      {
        id: '3',
        content: 'John says the performance review deadline is this Friday. Make sure to complete the analysis by Thursday.',
        source: 'whatsapp',
        timestamp: '2025-01-15T11:20:00Z',
        processed: false,
        relatedTasks: ['2']
      }
    ];
  }

  private getDefaultCategories(): Category[] {
    return [
      { id: '1', name: 'Work', color: '#3B82F6', usageCount: 5, description: 'Professional tasks and projects' },
      { id: '2', name: 'Personal', color: '#10B981', usageCount: 3, description: 'Personal activities and goals' },
      { id: '3', name: 'Development', color: '#8B5CF6', usageCount: 4, description: 'Coding and technical tasks' },
      { id: '4', name: 'Management', color: '#F59E0B', usageCount: 2, description: 'Leadership and team management' },
      { id: '5', name: 'Learning', color: '#EF4444', usageCount: 1, description: 'Education and skill development' },
      { id: '6', name: 'Health', color: '#06B6D4', usageCount: 2, description: 'Health and wellness activities' }
    ];
  }
}

export const storageService = new StorageService();