import React from 'react';
import { BarChart3, TrendingUp, Clock, Target, Brain, Calendar } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { storageService } from '../services/storageService';

export default function Analytics() {
  const { tasks } = useTasks();
  const categories = storageService.getCategories();
  const contextEntries = storageService.getContextEntries();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'completed').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category distribution
  const categoryStats = categories.map(category => {
    const categoryTasks = tasks.filter(t => t.category === category.name);
    const completed = categoryTasks.filter(t => t.status === 'completed').length;
    return {
      ...category,
      totalTasks: categoryTasks.length,
      completedTasks: completed,
      completionRate: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0
    };
  }).sort((a, b) => b.totalTasks - a.totalTasks);

  // Priority distribution
  const priorityStats = [
    { name: 'Critical', count: tasks.filter(t => t.priority === 'critical').length, color: 'bg-red-500' },
    { name: 'High', count: tasks.filter(t => t.priority === 'high').length, color: 'bg-orange-500' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: 'bg-yellow-500' },
    { name: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: 'bg-green-500' }
  ];

  // Context insights
  const processedEntries = contextEntries.filter(e => e.processed).length;
  const contextProcessingRate = contextEntries.length > 0 ? Math.round((processedEntries / contextEntries.length) * 100) : 0;

  // Recent activity (last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentTasks = tasks.filter(t => new Date(t.createdAt) > lastWeek);
  const recentContextEntries = contextEntries.filter(e => new Date(e.timestamp) > lastWeek);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="mt-1 text-gray-600">Insights into your task management and AI utilization</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">AI-Powered Analytics</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
                <p className="text-xs text-gray-500">{completedTasks}/{totalTasks} tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
                <p className="text-xs text-gray-500">Need attention</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{highPriorityTasks}</p>
                <p className="text-xs text-gray-500">Critical/High tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">AI Processing</p>
                <p className="text-2xl font-bold text-gray-900">{contextProcessingRate}%</p>
                <p className="text-xs text-gray-500">Context analyzed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
            <div className="space-y-4">
              {categoryStats.slice(0, 6).map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        <span className="text-sm text-gray-600">{category.completionRate}%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.completionRate}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {category.completedTasks}/{category.totalTasks} completed
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <div className="space-y-3">
              {priorityStats.map((priority) => (
                <div key={priority.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${priority.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{priority.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{priority.count} tasks</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${priority.color}`}
                        style={{ width: `${totalTasks > 0 ? (priority.count / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity (Last 7 Days)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">New Tasks Created</p>
                  <p className="text-xs text-blue-700">Tasks added this week</p>
                </div>
                <span className="text-xl font-bold text-blue-900">{recentTasks.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Context Entries</p>
                  <p className="text-xs text-purple-700">New context added</p>
                </div>
                <span className="text-xl font-bold text-purple-900">{recentContextEntries.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Tasks Completed</p>
                  <p className="text-xs text-green-700">Finished this week</p>
                </div>
                <span className="text-xl font-bold text-green-900">
                  {recentTasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-900 mb-2">Smart Prioritization</h4>
                <p className="text-sm text-gray-600">
                  AI has analyzed your tasks and context to provide intelligent priority scoring
                  based on deadlines, keywords, and context patterns.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2">Context Analysis</h4>
                <p className="text-sm text-gray-600">
                  {processedEntries} out of {contextEntries.length} context entries have been 
                  processed for task insights and recommendations.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-gray-900 mb-2">Productivity Trends</h4>
                <p className="text-sm text-gray-600">
                  Your completion rate is {completionRate}%, with most productive work happening 
                  in {categoryStats[0]?.name || 'various'} categories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}