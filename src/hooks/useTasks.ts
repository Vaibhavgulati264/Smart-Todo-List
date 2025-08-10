import { useState, useEffect } from 'react';
import { Task } from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    try {
      const storedTasks = storageService.getTasks();
      setTasks(storedTasks);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tasks');
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'priorityScore'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        priorityScore: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      storageService.addTask(newTask);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      throw err;
    }
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    try {
      storageService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = (taskId: string) => {
    try {
      storageService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const reprioritizeTasks = async () => {
    try {
      setLoading(true);
      const context = storageService.getContextEntries();
      const reprioritizedTasks = await aiService.prioritizeTasks(tasks, context);
      setTasks(reprioritizedTasks);
      storageService.saveTasks(reprioritizedTasks);
    } catch (err) {
      setError('Failed to reprioritize tasks');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reprioritizeTasks,
    refreshTasks: loadTasks
  };
}