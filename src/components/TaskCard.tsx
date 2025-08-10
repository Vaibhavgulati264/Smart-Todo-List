import React from 'react';
import { Calendar, Clock, Tag, MoreVertical, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask } = useTasks();

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleStatusChange = () => {
    let newStatus: Task['status'];
    switch (task.status) {
      case 'pending':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'in-progress';
    }
    updateTask(task.id, { status: newStatus });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border ${
      task.status === 'completed' ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <button onClick={handleStatusChange} className="mt-1">
            {getStatusIcon(task.status)}
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 mb-2 ${
              task.status === 'completed' ? 'line-through' : ''
            }`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* AI Suggestions */}
      {task.aiSuggestions?.contextualNotes && task.aiSuggestions.contextualNotes.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <h4 className="text-xs font-medium text-purple-800 mb-2">AI Insights</h4>
          <ul className="text-xs text-purple-700 space-y-1">
            {task.aiSuggestions.contextualNotes.map((note, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          {task.priorityScore > 0 && (
            <span className="ml-1 opacity-75">({task.priorityScore})</span>
          )}
        </span>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          task.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : task.status === 'in-progress'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {task.status.replace('-', ' ')}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.deadline)}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
          {task.category && (
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>{task.category}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}