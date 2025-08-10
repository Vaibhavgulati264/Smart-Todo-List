import React, { useState, useEffect } from 'react';
import { X, Brain, Calendar, Tag, Loader2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Task } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTask?: Task;
}

export default function CreateTaskModal({ isOpen, onClose, existingTask }: CreateTaskModalProps) {
  const { addTask, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as Task['priority'],
    deadline: '',
    tags: [] as string[],
    status: 'pending' as Task['status']
  });
  const [newTag, setNewTag] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>({});

  const categories = storageService.getCategories();

  useEffect(() => {
    if (existingTask) {
      setFormData({
        title: existingTask.title,
        description: existingTask.description,
        category: existingTask.category,
        priority: existingTask.priority,
        deadline: existingTask.deadline,
        tags: existingTask.tags,
        status: existingTask.status
      });
    }
  }, [existingTask]);

  useEffect(() => {
    if (formData.title || formData.description) {
      const timer = setTimeout(() => {
        generateAISuggestions();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.title, formData.description]);

  const generateAISuggestions = async () => {
    if (!formData.title && !formData.description) return;
    
    setIsAIProcessing(true);
    try {
      const context = storageService.getContextEntries();
      const existingCategories = categories.map(c => c.name);
      
      const [suggestedCategory, suggestedDeadline, enhancedDescription] = await Promise.all([
        aiService.suggestCategory(formData, existingCategories),
        aiService.suggestDeadline(formData, context),
        aiService.enhanceTaskDescription(formData, context)
      ]);

      setAiSuggestions({
        category: suggestedCategory,
        deadline: suggestedDeadline,
        enhancedDescription: enhancedDescription !== formData.description ? enhancedDescription : null
      });
    } catch (error) {
      console.error('AI suggestions failed:', error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...formData,
        aiSuggestions: Object.keys(aiSuggestions).length > 0 ? {
          suggestedCategory: aiSuggestions.category,
          suggestedDeadline: aiSuggestions.deadline,
          enhancedDescription: aiSuggestions.enhancedDescription,
          contextualNotes: aiSuggestions.enhancedDescription ? ['AI-enhanced description available'] : []
        } : undefined
      };

      if (existingTask) {
        updateTask(existingTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      deadline: '',
      tags: [],
      status: 'pending'
    });
    setAiSuggestions({});
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const applySuggestion = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {existingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your task..."
            />
            
            {/* AI Enhanced Description Suggestion */}
            {aiSuggestions.enhancedDescription && (
              <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Brain className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-800">AI Enhanced Description</span>
                    </div>
                    <p className="text-sm text-purple-700 whitespace-pre-wrap">
                      {aiSuggestions.enhancedDescription}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => applySuggestion('description', aiSuggestions.enhancedDescription)}
                    className="ml-3 px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              
              {/* AI Category Suggestion */}
              {aiSuggestions.category && aiSuggestions.category !== formData.category && (
                <div className="mt-2 flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">Suggested: {aiSuggestions.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => applySuggestion('category', aiSuggestions.category)}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* AI Deadline Suggestion */}
            {aiSuggestions.deadline && aiSuggestions.deadline !== formData.deadline && (
              <div className="mt-2 flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center">
                  <Brain className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    Suggested: {new Date(aiSuggestions.deadline).toLocaleDateString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => applySuggestion('deadline', aiSuggestions.deadline)}
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Status (only for existing tasks) */}
          {existingTask && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          {/* AI Processing Indicator */}
          {isAIProcessing && (
            <div className="flex items-center justify-center p-4 bg-purple-50 rounded-lg">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin mr-2" />
              <span className="text-sm text-purple-700">AI is analyzing your task...</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {existingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}