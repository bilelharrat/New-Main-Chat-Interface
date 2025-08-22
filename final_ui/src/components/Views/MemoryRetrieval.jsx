import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  MemoryStick, 
  TrendingUp, 
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity as ActivityIcon,
  Database
} from 'lucide-react';

const MemoryRetrieval = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedChart, setSelectedChart] = useState('memory-usage');
  
  const pastPrompts = [ 
    { id: 1, text: "Create a responsive navbar component...", model: "GPT-4o", date: "2024-06-10", match: 92, output: "const ResponsiveNavbar = () => ..."}, 
    { id: 2, text: "Generate a Python script for web scraping.", model: "Claude 3", date: "2024-06-09", match: 65, output: "import requests\nfrom bs4 import BeautifulSoup..."}, 
    { id: 3, text: "Explain the concept of recursion.", model: "Gemini 1.5", date: "2024-06-08", match: 42, output: "Recursion is a method of solving a computational problem..."}, 
  ];

  // Sample data for charts
  const memoryUsageData = [
    { name: 'Mon', usage: 65, retrieval: 45, accuracy: 92 },
    { name: 'Tue', usage: 78, retrieval: 52, accuracy: 89 },
    { name: 'Wed', usage: 82, retrieval: 61, accuracy: 94 },
    { name: 'Thu', usage: 71, retrieval: 48, accuracy: 91 },
    { name: 'Fri', usage: 88, retrieval: 67, accuracy: 96 },
    { name: 'Sat', usage: 75, retrieval: 55, accuracy: 93 },
    { name: 'Sun', usage: 69, retrieval: 42, accuracy: 90 }
  ];

  const retrievalAccuracyData = [
    { name: 'Semantic Search', accuracy: 94, count: 1250 },
    { name: 'Vector Search', accuracy: 87, count: 890 },
    { name: 'Hybrid Search', accuracy: 96, count: 2100 },
    { name: 'Context Search', accuracy: 91, count: 1560 },
    { name: 'Memory Recall', accuracy: 89, count: 980 }
  ];

  const memoryDistributionData = [
    { name: 'Documents', value: 45, color: '#3B82F6' },
    { name: 'Conversations', value: 25, color: '#10B981' },
    { name: 'Code Snippets', value: 15, color: '#8B5CF6' },
    { name: 'Research Notes', value: 10, color: '#F59E0B' },
    { name: 'Other', value: 5, color: '#EF4444' }
  ];

  const chartOptions = [
    { id: 'memory-usage', label: 'Memory Usage', icon: LineChartIcon, description: 'Memory utilization over time' },
    { id: 'retrieval-accuracy', label: 'Retrieval Accuracy', icon: BarChart3, description: 'Accuracy by search method' },
    { id: 'memory-distribution', label: 'Memory Distribution', icon: PieChartIcon, description: 'Content type distribution' },
    { id: 'performance-metrics', label: 'Performance Metrics', icon: ActivityIcon, description: 'System performance overview' }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'memory-usage':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Memory Usage & Retrieval Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memoryUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Memory Usage (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="retrieval" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Retrieval Success (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'retrieval-accuracy':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Retrieval Accuracy by Method</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retrievalAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="accuracy" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'memory-distribution':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Memory Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={memoryDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {memoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'performance-metrics':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">System Performance Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">87.3%</div>
                <div className="text-sm text-blue-700">Memory Hit Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">92.1%</div>
                <div className="text-sm text-green-700">Retrieval Accuracy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">245ms</div>
                <div className="text-sm text-purple-700">Avg Response Time</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">2.4GB</div>
                <div className="text-sm text-orange-700">Memory Usage</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-8 overflow-hidden bg-gray-50 dark:bg-black">
      {/* Left Panel - Chart Selection */}
      <div className="w-full md:w-1/3 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-black border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input 
              type="text" 
              placeholder="Search past prompts..." 
              className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:outline-none"
            />
          </div>
          
          {/* Chart Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Chart Types</h3>
            {chartOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedChart(option.id)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedChart === option.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedChart === option.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <option.icon size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Past Prompts */}
        <div className="bg-white dark:bg-black border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-sm flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Queries</h3>
          </div>
          <div className="flex-grow overflow-y-auto">
            {pastPrompts.map(p => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPrompt(p)} 
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${selectedPrompt?.id === p.id ? 'bg-accent/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <p className="text-gray-800 dark:text-gray-200 font-medium truncate">{p.text}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{p.model}</span>
                  <span>{p.date}</span>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">{p.match}% match</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Panel - Chart Display */}
      <div className="w-full md:w-2/3 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-black border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-sm flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {chartOptions.find(opt => opt.id === selectedChart)?.label || 'Chart View'}
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Memory & Retrieval Analytics
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryRetrieval;
