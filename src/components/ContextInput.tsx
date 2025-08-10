import React, { useState } from 'react';
import { Plus, MessageSquare, Mail, FileText, Trash2, Brain, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { ContextEntry } from '../types';

export default function ContextInput() {
  const [entries, setEntries] = useState<ContextEntry[]>(storageService.getContextEntries());
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    content: '',
    source: 'manual' as ContextEntry['source']
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [taskSuggestions, setTaskSuggestions] = useState<any[]>([]);

  const sourceIcons = {
    whatsapp: MessageSquare,
    email: Mail,
    notes: FileText,
    manual: FileText
  };

  const sourceColors = {
    whatsapp: 'bg-green-100 text-green-700',
    email: 'bg-blue-100 text-blue-700',
    notes: 'bg-purple-100 text-purple-700',
    manual: 'bg-gray-100 text-gray-700'
  };

  const handleAddEntry = () => {
    if (!newEntry.content.trim()) return;

    const entry: ContextEntry = {
      id: Date.now().toString(),
      content: newEntry.content,
      source: newEntry.source,
      timestamp: new Date().toISOString(),
      processed: false
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    storageService.saveContextEntries(updatedEntries);
    
    setNewEntry({ content: '', source: 'manual' });
    setIsAdding(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    storageService.saveContextEntries(updatedEntries);
  };

  const handleAnalyzeContext = async () => {
    setIsAnalyzing(true);
    try {
      const [insights, suggestions] = await Promise.all([
        aiService.analyzeContext(entries),
        aiService.generateTaskSuggestions(entries)
      ]);
      
      // Update entries with insights
      const updatedEntries = entries.map(entry => ({
        ...entry,
        processed: true,
        insights: insights
          .filter(insight => insight.reasoning.toLowerCase().includes(entry.content.toLowerCase().split(' ')[0]))
          .map(insight => insight.suggestion)
      }));
      
      setEntries(updatedEntries);
      storageService.saveContextEntries(updatedEntries);
      setTaskSuggestions(suggestions);
    } catch (error) {
      console.error('Context analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Context Input</h1>
              <p className="mt-1 text-gray-600">Add daily context for AI-powered task insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAnalyzeContext}
                disabled={isAnalyzing || entries.length === 0}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Context
                  </>
                )}
              </button>
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Add Entry Form */}
        {isAdding && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Context Entry</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Type
                </label>
                <select
                  value={newEntry.source}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, source: e.target.value as ContextEntry['source'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="email">Email</option>
                  <option value="notes">Notes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your context content here..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntry.content.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Suggestions */}
        {taskSuggestions.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 text-purple-600 mr-2" />
              AI Task Suggestions
            </h3>
            <div className="space-y-3">
              {taskSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-gray-900 mb-2">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">
                        {suggestion.category}
                      </span>
                      <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs">
                        {suggestion.priority}
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                      Create Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Entries */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No context entries yet</h3>
              <p className="text-gray-600 mb-4">
                Start adding context from your daily communications to get AI-powered insights
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Entry
              </button>
            </div>
          ) : (
            entries.map((entry) => {
              const SourceIcon = sourceIcons[entry.source];
              return (
                <div key={entry.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${sourceColors[entry.source]}`}>
                        <SourceIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 capitalize">
                          {entry.source.replace('-', ' ')}
                        </span>
                        <p className="text-sm text-gray-500">
                          {formatTimestamp(entry.timestamp)}
                        </p>
                      </div>
                      {entry.processed && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Processed
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
                  </div>

                  {/* AI Insights */}
                  {entry.insights && entry.insights.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-1" />
                        AI Insights
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {entry.insights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}