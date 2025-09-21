import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  Plus, 
  Search, 
  Trash2, 
  ArrowRight, 
  Star, 
  Clock, 
  Users, 
  Settings, 
  MoreVertical, 
  Grid, 
  List, 
  ChevronDown,
  Calendar,
  Tag,
  Eye,
  Share2,
  Download,
  Archive,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  BookOpen,
  Award,
  DollarSign,
  TrendingUp,
  FileText,
  Microscope,
  Brain,
  Database,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  GraduationCap,
  UserCheck,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Flag,
  Zap,
  Lightbulb,
  Beaker,
  TestTube,
  Atom,
  Dna,
  Cpu,
  Code,
  Layers,
  GitBranch,
  GitCommit,
  GitPullRequest,
  ExternalLink,
  Copy,
  Edit3,
  Save,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  StopCircle,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Move,
  GripVertical,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  AlertOctagon,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Building,
  University,
  GraduationCap as UniversityIcon,
  Book,
  FileSearch,
  Search as SearchIcon,
  Filter as FilterIcon,
  Sliders,
  ToggleLeft,
  ToggleRight,
  ToggleLeft as ToggleOff,
  ToggleRight as ToggleOn,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  BatteryFull,
  Signal,
  SignalZero,
  SignalLow,
  SignalHigh,
  SignalMax,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Battery as BatteryIcon,
  BatteryLow as BatteryLowIcon,
  BatteryFull as BatteryFullIcon,
  Signal as SignalIcon,
  SignalZero as SignalZeroIcon,
  SignalLow as SignalLowIcon,
  SignalHigh as SignalHighIcon,
  SignalMax as SignalMaxIcon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShareModal from '../ShareModal';

const mockResearchProjects = [
  { 
    id: 1, 
    name: 'Quantum Machine Learning for Drug Discovery', 
    description: 'Investigating quantum algorithms for molecular property prediction and drug-target interaction modeling using variational quantum eigensolvers', 
    date: '2024-07-10',
    status: 'active',
    progress: 68,
    team: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez', 'Dr. Aisha Patel', 'Dr. James Wilson'],
    tags: ['Quantum Computing', 'Machine Learning', 'Drug Discovery', 'Molecular Biology'],
    favorite: true,
    views: 142,
    lastModified: '2024-07-15',
    priority: 'high',
    category: 'quantum',
    field: 'Computer Science',
    subfield: 'Quantum Machine Learning',
    funding: {
      source: 'NSF Grant',
      amount: 2500000,
      currency: 'USD',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: 'active'
    },
    publications: [
      { title: 'Quantum-Enhanced Molecular Property Prediction', journal: 'Nature Quantum Information', year: 2024, status: 'published', citations: 23 },
      { title: 'Variational Quantum Eigensolvers for Drug Discovery', journal: 'Physical Review A', year: 2024, status: 'under_review', citations: 0 }
    ],
    collaborators: [
      { name: 'MIT Quantum Lab', type: 'institution', role: 'collaborator' },
      { name: 'Pfizer Research', type: 'industry', role: 'partner' }
    ],
    milestones: [
      { title: 'Quantum Algorithm Development', dueDate: '2024-09-15', status: 'completed' },
      { title: 'Molecular Dataset Preparation', dueDate: '2024-10-30', status: 'in_progress' },
      { title: 'Benchmarking Study', dueDate: '2025-03-15', status: 'pending' }
    ],
    ethicsApproval: { status: 'approved', number: 'IRB-2024-001', expiryDate: '2025-12-31' },
    dataManagement: { plan: 'approved', repository: 'Zenodo', access: 'controlled' },
    impact: { hIndex: 15, totalCitations: 234, altmetricScore: 45 }
  },
  { 
    id: 2, 
    name: 'Neural Architecture Search for Edge Computing', 
    description: 'Developing automated neural architecture search methods optimized for resource-constrained edge devices using evolutionary algorithms', 
    date: '2024-07-08',
    status: 'active',
    progress: 42,
    team: ['Dr. Elena Volkov', 'Dr. David Kim', 'Dr. Maria Santos'],
    tags: ['Neural Architecture Search', 'Edge Computing', 'Evolutionary Algorithms', 'Optimization'],
    favorite: false,
    views: 89,
    lastModified: '2024-07-12',
    priority: 'high',
    category: 'ai',
    field: 'Computer Science',
    subfield: 'Machine Learning',
    funding: {
      source: 'DARPA Grant',
      amount: 1800000,
      currency: 'USD',
      startDate: '2024-03-01',
      endDate: '2027-02-28',
      status: 'active'
    },
    publications: [
      { title: 'Efficient NAS for Edge Devices', journal: 'ICML 2024', year: 2024, status: 'accepted', citations: 12 }
    ],
    collaborators: [
      { name: 'Stanford AI Lab', type: 'institution', role: 'collaborator' },
      { name: 'Intel Labs', type: 'industry', role: 'partner' }
    ],
    milestones: [
      { title: 'Literature Review', dueDate: '2024-08-15', status: 'completed' },
      { title: 'Baseline Implementation', dueDate: '2024-11-30', status: 'in_progress' },
      { title: 'Edge Optimization', dueDate: '2025-06-15', status: 'pending' }
    ],
    ethicsApproval: { status: 'not_required', number: null, expiryDate: null },
    dataManagement: { plan: 'approved', repository: 'GitHub', access: 'open' },
    impact: { hIndex: 8, totalCitations: 156, altmetricScore: 23 }
  },
  { 
    id: 3, 
    name: 'Climate Change Impact on Marine Ecosystems', 
    description: 'Longitudinal study examining the effects of ocean acidification and temperature rise on coral reef biodiversity using advanced monitoring systems', 
    date: '2024-07-05',
    status: 'active',
    progress: 78,
    team: ['Dr. Rachel Green', 'Dr. Carlos Mendez', 'Dr. Yuki Tanaka', 'Dr. Ahmed Hassan'],
    tags: ['Climate Science', 'Marine Biology', 'Biodiversity', 'Environmental Monitoring'],
    favorite: true,
    views: 203,
    lastModified: '2024-07-10',
    priority: 'critical',
    category: 'environmental',
    field: 'Environmental Science',
    subfield: 'Marine Biology',
    funding: {
      source: 'NOAA Grant',
      amount: 3200000,
      currency: 'USD',
      startDate: '2023-09-01',
      endDate: '2026-08-31',
      status: 'active'
    },
    publications: [
      { title: 'Coral Reef Resilience Under Climate Stress', journal: 'Science', year: 2024, status: 'published', citations: 67 },
      { title: 'Ocean Acidification Monitoring Network', journal: 'Nature Climate Change', year: 2024, status: 'under_review', citations: 0 }
    ],
    collaborators: [
      { name: 'Woods Hole Oceanographic Institution', type: 'institution', role: 'collaborator' },
      { name: 'Great Barrier Reef Foundation', type: 'institution', role: 'partner' }
    ],
    milestones: [
      { title: 'Sensor Network Deployment', dueDate: '2024-06-30', status: 'completed' },
      { title: 'Baseline Data Collection', dueDate: '2024-12-31', status: 'in_progress' },
      { title: 'Impact Assessment Report', dueDate: '2025-08-31', status: 'pending' }
    ],
    ethicsApproval: { status: 'approved', number: 'IACUC-2023-045', expiryDate: '2025-12-31' },
    dataManagement: { plan: 'approved', repository: 'BCO-DMO', access: 'public' },
    impact: { hIndex: 22, totalCitations: 456, altmetricScore: 89 }
  },
  { 
    id: 4, 
    name: 'CRISPR-Based Gene Therapy for Rare Diseases', 
    description: 'Developing precision gene editing therapies for inherited metabolic disorders using novel CRISPR-Cas9 variants with enhanced specificity', 
    date: '2024-07-01',
    status: 'active',
    progress: 55,
    team: ['Dr. Jennifer Liu', 'Dr. Robert Taylor', 'Dr. Priya Sharma', 'Dr. Marcus Johnson'],
    tags: ['Gene Therapy', 'CRISPR', 'Rare Diseases', 'Precision Medicine'],
    favorite: false,
    views: 178,
    lastModified: '2024-07-14',
    priority: 'high',
    category: 'biomedical',
    field: 'Biomedical Engineering',
    subfield: 'Gene Therapy',
    funding: {
      source: 'NIH R01 Grant',
      amount: 2800000,
      currency: 'USD',
      startDate: '2024-01-01',
      endDate: '2028-12-31',
      status: 'active'
    },
    publications: [
      { title: 'Enhanced CRISPR-Cas9 for Metabolic Disorders', journal: 'Cell', year: 2024, status: 'published', citations: 34 },
      { title: 'Safety Profile of Novel Gene Editing Tools', journal: 'Nature Biotechnology', year: 2024, status: 'under_review', citations: 0 }
    ],
    collaborators: [
      { name: 'Broad Institute', type: 'institution', role: 'collaborator' },
      { name: 'Boston Children\'s Hospital', type: 'institution', role: 'clinical_partner' }
    ],
    milestones: [
      { title: 'CRISPR Variant Design', dueDate: '2024-08-31', status: 'completed' },
      { title: 'In Vitro Testing', dueDate: '2025-02-28', status: 'in_progress' },
      { title: 'Preclinical Studies', dueDate: '2026-06-30', status: 'pending' }
    ],
    ethicsApproval: { status: 'approved', number: 'IRB-2024-012', expiryDate: '2026-12-31' },
    dataManagement: { plan: 'approved', repository: 'dbGaP', access: 'controlled' },
    impact: { hIndex: 18, totalCitations: 312, altmetricScore: 67 }
  },
  { 
    id: 5, 
    name: 'Sustainable Energy Storage Systems', 
    description: 'Developing next-generation battery technologies using novel electrode materials and solid-state electrolytes for grid-scale energy storage', 
    date: '2024-06-28',
    status: 'active',
    progress: 38,
    team: ['Dr. Lisa Wang', 'Dr. Thomas Brown', 'Dr. Sofia Garcia'],
    tags: ['Energy Storage', 'Battery Technology', 'Materials Science', 'Sustainability'],
    favorite: false,
    views: 95,
    lastModified: '2024-07-13',
    priority: 'medium',
    category: 'energy',
    field: 'Materials Science',
    subfield: 'Energy Materials',
    funding: {
      source: 'DOE Grant',
      amount: 2200000,
      currency: 'USD',
      startDate: '2024-02-01',
      endDate: '2027-01-31',
      status: 'active'
    },
    publications: [
      { title: 'Solid-State Electrolytes for Next-Gen Batteries', journal: 'Advanced Materials', year: 2024, status: 'published', citations: 19 }
    ],
    collaborators: [
      { name: 'Argonne National Laboratory', type: 'institution', role: 'collaborator' },
      { name: 'Tesla Energy', type: 'industry', role: 'partner' }
    ],
    milestones: [
      { title: 'Material Synthesis', dueDate: '2024-10-31', status: 'in_progress' },
      { title: 'Prototype Development', dueDate: '2025-08-31', status: 'pending' },
      { title: 'Performance Testing', dueDate: '2026-06-30', status: 'pending' }
    ],
    ethicsApproval: { status: 'not_required', number: null, expiryDate: null },
    dataManagement: { plan: 'approved', repository: 'Materials Data Facility', access: 'public' },
    impact: { hIndex: 12, totalCitations: 189, altmetricScore: 34 }
  },
  { 
    id: 6, 
    name: 'AI-Driven Drug Repurposing for COVID-19', 
    description: 'Using machine learning and network biology approaches to identify existing drugs that could be repurposed for COVID-19 treatment', 
    date: '2024-06-25',
    status: 'completed',
    progress: 100,
    team: ['Dr. Alex Chen', 'Dr. Maria Rodriguez', 'Dr. Kevin Park'],
    tags: ['Drug Repurposing', 'COVID-19', 'Machine Learning', 'Network Biology'],
    favorite: true,
    views: 267,
    lastModified: '2024-07-11',
    priority: 'high',
    category: 'biomedical',
    field: 'Bioinformatics',
    subfield: 'Drug Discovery',
    funding: {
      source: 'NIH Emergency Grant',
      amount: 1500000,
      currency: 'USD',
      startDate: '2020-04-01',
      endDate: '2024-03-31',
      status: 'completed'
    },
    publications: [
      { title: 'AI-Identified Drug Candidates for COVID-19', journal: 'Nature Medicine', year: 2024, status: 'published', citations: 156 },
      { title: 'Network-Based Drug Repurposing Framework', journal: 'Bioinformatics', year: 2024, status: 'published', citations: 78 }
    ],
    collaborators: [
      { name: 'Johns Hopkins University', type: 'institution', role: 'collaborator' },
      { name: 'FDA', type: 'government', role: 'regulatory_partner' }
    ],
    milestones: [
      { title: 'Data Collection', dueDate: '2020-06-30', status: 'completed' },
      { title: 'Model Development', dueDate: '2021-03-31', status: 'completed' },
      { title: 'Clinical Validation', dueDate: '2023-12-31', status: 'completed' }
    ],
    ethicsApproval: { status: 'approved', number: 'IRB-2020-089', expiryDate: '2024-03-31' },
    dataManagement: { plan: 'approved', repository: 'GISAID', access: 'controlled' },
    impact: { hIndex: 25, totalCitations: 567, altmetricScore: 134 }
  }
];

export default function Projects() {
  const { darkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [openMoreMenu, setOpenMoreMenu] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedField, setSelectedField] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const fileInputRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'from-green-400 via-green-500 to-green-600';
      case 'completed': return 'from-blue-400 via-blue-500 to-blue-600';
      case 'planning': return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 'paused': return 'from-orange-400 via-orange-500 to-orange-600';
      case 'critical': return 'from-red-500 via-red-600 to-red-700';
      default: return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'from-red-500 via-red-600 to-red-700';
      case 'high': return 'from-orange-400 via-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 'low': return 'from-green-400 via-green-500 to-green-600';
      default: return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'quantum': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] flex items-center justify-center shadow-md"><Atom className="w-4 h-4 text-white" /></div>;
      case 'ai': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#30D158] to-[#4CAF50] flex items-center justify-center shadow-md"><Brain className="w-4 h-4 text-white" /></div>;
      case 'environmental': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#30D158] to-[#4CAF50] flex items-center justify-center shadow-md"><Globe className="w-4 h-4 text-white" /></div>;
      case 'biomedical': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF3B30] to-[#FF6961] flex items-center justify-center shadow-md"><Dna className="w-4 h-4 text-white" /></div>;
      case 'energy': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9500] to-[#FFB340] flex items-center justify-center shadow-md"><Zap className="w-4 h-4 text-white" /></div>;
      case 'materials': return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] flex items-center justify-center shadow-md"><Layers className="w-4 h-4 text-white" /></div>;
      default: return <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md"><Microscope className="w-4 h-4 text-white" /></div>;
    }
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'Computer Science': return <Cpu className="w-4 h-4" />;
      case 'Environmental Science': return <Globe className="w-4 h-4" />;
      case 'Biomedical Engineering': return <Dna className="w-4 h-4" />;
      case 'Materials Science': return <Layers className="w-4 h-4" />;
      case 'Bioinformatics': return <Database className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPublicationStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'accepted': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'under_review': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'submitted': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getMilestoneStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const toggleFavorite = (projectId) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for project:', projectId);
  };

  const filteredAndSortedProjects = mockResearchProjects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
                           project.description.toLowerCase().includes(search.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
                           project.field.toLowerCase().includes(search.toLowerCase()) ||
                           project.subfield.toLowerCase().includes(search.toLowerCase());
      
      const matchesField = selectedField === 'all' || project.field === selectedField;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || project.priority === selectedPriority;
      
      if (activeFilter === 'all') return matchesSearch && matchesField && matchesStatus && matchesPriority;
      if (activeFilter === 'favorites') return matchesSearch && project.favorite && matchesField && matchesStatus && matchesPriority;
      if (activeFilter === 'recent') return matchesSearch && (Date.now() - new Date(project.lastModified).getTime()) < 7 * 24 * 60 * 60 * 1000 && matchesField && matchesStatus && matchesPriority;
      if (activeFilter === 'active') return matchesSearch && project.status === 'active' && matchesField && matchesPriority;
      if (activeFilter === 'completed') return matchesSearch && project.status === 'completed' && matchesField && matchesPriority;
      if (activeFilter === 'planning') return matchesSearch && project.status === 'planning' && matchesField && matchesPriority;
      if (activeFilter === 'critical') return matchesSearch && project.priority === 'critical' && matchesField && matchesStatus;
      if (activeFilter === 'funding') return matchesSearch && project.funding.status === 'active' && matchesField && matchesStatus && matchesPriority;
      if (activeFilter === 'publications') return matchesSearch && project.publications.length > 0 && matchesField && matchesStatus && matchesPriority;
      return matchesSearch && matchesField && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(b.date) - new Date(a.date);
        case 'name': return a.name.localeCompare(b.name);
        case 'progress': return b.progress - a.progress;
        case 'priority': {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'views': return b.views - a.views;
        case 'funding': return b.funding.amount - a.funding.amount;
        case 'citations': return b.impact.totalCitations - a.impact.totalCitations;
        case 'hIndex': return b.impact.hIndex - a.impact.hIndex;
        case 'publications': return b.publications.length - a.publications.length;
        default: return 0;
      }
    });

  const closeModal = () => {
    setShowAddProjectModal(false);
  };

  const handleFileUpload = (files) => {
    // Handle file upload logic
    console.log('Files uploaded:', files);
    setSuccessMessage('Project files uploaded successfully!');
    setTimeout(() => setSuccessMessage(""), 3000);
    closeModal();
  };

  const deleteProject = (projectId) => {
    // In a real app, this would call the backend
    console.log('Delete project:', projectId);
    setSuccessMessage('Project deleted successfully!');
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleOpenResearchMode = (projectId) => {
    const project = mockResearchProjects.find(p => p.id === projectId);
    if (project) {
      // In a real app, this would navigate to ResearchMode with project context
      console.log('Opening ResearchMode for project:', project.name);
      setSuccessMessage(`Opening ResearchMode for "${project.name}"`);
    setTimeout(() => setSuccessMessage(""), 3000);
      
      // Here you would typically:
      // 1. Set the current project context
      // 2. Navigate to ResearchMode component
      // 3. Pass project data to ResearchMode
    }
  };

  const handleShareProject = (projectId) => {
    const project = mockResearchProjects.find(p => p.id === projectId);
    setSelectedProject(project);
    setShowShareModal(true);
  };

  const handleDownloadProject = (projectId) => {
    console.log('Downloading project:', projectId);
    setSuccessMessage('Project downloaded successfully!');
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMoreMenu !== null) {
        setOpenMoreMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMoreMenu]);

  return (
    <div className={`flex flex-col h-full w-full ${darkMode ? 'bg-gray-950' : 'bg-gray-50/50'}`}>
      {/* Header Section */}
      <div className={`px-10 pt-12 pb-8 ${
        darkMode ? 'bg-gray-900/40' : 'bg-white/60'
      } backdrop-blur-2xl border-b ${
        darkMode ? 'border-gray-700/30' : 'border-gray-200/40'
      }`}>
        <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-5xl font-light mb-3 tracking-tight ${
                darkMode ? 'text-white/95' : 'text-gray-900'
              }`}>
                Research Projects
              </h1>
              <p className={`text-xl font-light leading-relaxed ${
                darkMode ? 'text-gray-300/80' : 'text-gray-600/80'
              }`}>
                Manage research initiatives, track publications, and collaborate with global research teams
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`group relative px-6 py-4 rounded-[16px] font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white backdrop-blur-sm' 
                    : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 backdrop-blur-sm'
                } transform hover:scale-105 active:scale-95`}
              >
                <BarChart3 className="w-5 h-5 mr-3 inline" />
                <span className="text-base">Analytics</span>
              </button>
            
            <button 
              onClick={() => setShowAddProjectModal(true)}
              className={`group relative px-8 py-4 rounded-[16px] font-medium transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25' 
                  : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
              } transform hover:scale-105 active:scale-95`}
            >
              <Plus className="w-5 h-5 mr-3 inline" />
              <span className="text-base">New Research Project</span>
        </button>
      </div>
      </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-6 flex-wrap">
      {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                darkMode ? 'text-gray-400/70' : 'text-gray-500/70'
              }`} size={22} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
                placeholder="Search research projects, fields, publications..."
                className={`w-full pl-12 pr-6 py-4 rounded-[16px] border transition-all duration-300 text-lg font-light ${
                  darkMode 
                    ? 'bg-gray-800/60 border-gray-700/60 text-white placeholder-gray-400/70 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 backdrop-blur-sm' 
                    : 'bg-white/80 border-gray-200/60 text-gray-900 placeholder-gray-500/70 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 backdrop-blur-sm'
                } focus:outline-none`}
        />
      </div>

            {/* Research Field Filter */}
            <div className="relative">
              <select
                value={selectedField}
                onChange={e => setSelectedField(e.target.value)}
                className={`px-6 py-4 rounded-[16px] text-base font-light transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/60 border-gray-700/60 text-gray-300 focus:border-blue-500 backdrop-blur-sm' 
                    : 'bg-white/80 border-gray-200/60 text-gray-600 focus:border-blue-500 backdrop-blur-sm'
                } border focus:outline-none`}
              >
                <option value="all">All Fields</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Biomedical Engineering">Biomedical Engineering</option>
                <option value="Materials Science">Materials Science</option>
                <option value="Bioinformatics">Bioinformatics</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className={`px-6 py-4 rounded-[16px] text-base font-light transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/60 border-gray-700/60 text-gray-300 focus:border-blue-500 backdrop-blur-sm' 
                    : 'bg-white/80 border-gray-200/60 text-gray-600 focus:border-blue-500 backdrop-blur-sm'
                } border focus:outline-none`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="planning">Planning</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-300 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-600 focus:border-blue-500'
                } border focus:outline-none`}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              {['all', 'favorites', 'recent', 'active', 'completed', 'critical', 'funding', 'publications'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-lg'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                darkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-300 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-600 focus:border-blue-500'
                } border focus:outline-none`}
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="priority">Sort by Priority</option>
                <option value="funding">Sort by Funding</option>
                <option value="citations">Sort by Citations</option>
                <option value="hIndex">Sort by H-Index</option>
                <option value="publications">Sort by Publications</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className={`px-8 py-6 border-b ${
          darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50/50 border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-2xl font-semibold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Research Analytics Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Funding */}
              <div className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Total Funding
                    </p>
                    <p className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatCurrency(
                        mockResearchProjects.reduce((sum, project) => sum + project.funding.amount, 0),
                        'USD'
                      )}
                    </p>
            </div>
                  <DollarSign className={`w-8 h-8 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
          </div>
              </div>

              {/* Total Publications */}
              <div className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Total Publications
                    </p>
                    <p className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {mockResearchProjects.reduce((sum, project) => sum + project.publications.length, 0)}
                    </p>
                  </div>
                  <FileText className={`w-8 h-8 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
        </div>
      </div>

              {/* Total Citations */}
              <div className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Total Citations
                    </p>
                    <p className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {mockResearchProjects.reduce((sum, project) => sum + project.impact.totalCitations, 0)}
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
              </div>

              {/* Active Projects */}
              <div className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Active Projects
                    </p>
                    <p className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {mockResearchProjects.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <Target className={`w-8 h-8 ${
                    darkMode ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                </div>
              </div>
            </div>

            {/* Field Distribution */}
            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Research Field Distribution
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['Computer Science', 'Environmental Science', 'Biomedical Engineering', 'Materials Science', 'Bioinformatics'].map(field => {
                  const count = mockResearchProjects.filter(p => p.field === field).length;
                  return (
                    <div key={field} className="text-center">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {getFieldIcon(field)}
                      </div>
                      <p className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {field}
                      </p>
                      <p className={`text-lg font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Funding Overview */}
            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Funding Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Funding by Source */}
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Funding by Source
                  </h4>
                  <div className="space-y-2">
                    {['NSF Grant', 'NIH Grant', 'DARPA Grant', 'DOE Grant', 'NOAA Grant'].map(source => {
                      const projects = mockResearchProjects.filter(p => p.funding.source === source);
                      const totalAmount = projects.reduce((sum, p) => sum + p.funding.amount, 0);
                      const percentage = (totalAmount / mockResearchProjects.reduce((sum, p) => sum + p.funding.amount, 0)) * 100;
                      
                      return (
                        <div key={source} className="flex items-center justify-between">
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {source}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className={`w-20 h-2 rounded-full ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {formatCurrency(totalAmount, 'USD')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Funding Status */}
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Funding Status
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Active Grants
                      </span>
                      <span className={`text-lg font-bold ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {mockResearchProjects.filter(p => p.funding.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Completed Grants
                      </span>
                      <span className={`text-lg font-bold ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {mockResearchProjects.filter(p => p.funding.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Total Active Funding
                      </span>
                      <span className={`text-lg font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatCurrency(
                          mockResearchProjects
                            .filter(p => p.funding.status === 'active')
                            .reduce((sum, p) => sum + p.funding.amount, 0),
                          'USD'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Publication Impact */}
            <div className={`p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Publication Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {mockResearchProjects.reduce((sum, p) => sum + p.publications.length, 0)}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Total Publications
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {Math.round(mockResearchProjects.reduce((sum, p) => sum + p.impact.totalCitations, 0) / mockResearchProjects.reduce((sum, p) => sum + p.publications.length, 0))}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Avg Citations/Paper
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {Math.round(mockResearchProjects.reduce((sum, p) => sum + p.impact.hIndex, 0) / mockResearchProjects.length)}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Avg H-Index
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-8 py-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center rounded-xl p-1 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="List View"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Timeline View"
              >
                <Calendar size={18} />
              </button>
            </div>

            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {filteredAndSortedProjects.length} of {mockResearchProjects.length} research projects
            </div>
          </div>

          {/* Research Projects Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProjects.length === 0 ? (
                <div className={`col-span-full text-center py-16 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Microscope className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No research projects found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredAndSortedProjects.map(project => (
            <div
              key={project.id}
                    className={`group relative ${
                      darkMode ? 'bg-gray-800/40' : 'bg-white/80'
                    } rounded-[20px] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer border backdrop-blur-sm ${
                      selectedProjects.includes(project.id)
                        ? 'ring-2 ring-blue-500/40 shadow-blue-500/20'
                        : darkMode
                          ? 'border-gray-700/40 hover:border-gray-600/60'
                          : 'border-gray-200/60 hover:border-gray-300/80'
                    } overflow-hidden`}
                    onClick={() => {
                      const newSelected = selectedProjects.includes(project.id)
                        ? selectedProjects.filter(id => id !== project.id)
                        : [...selectedProjects, project.id];
                      setSelectedProjects(newSelected);
                    }}
                  >
                    <div className="flex flex-col h-full">
                      {/* Header with funding and priority */}
                      <div className={`p-6 pb-4 ${
                        darkMode ? 'bg-gray-800/20' : 'bg-gray-50/30'
                      }`}>
                      <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                        {getCategoryIcon(project.category)}
                            <div>
                              <div className={`text-sm font-medium ${
                                darkMode ? 'text-gray-300/80' : 'text-gray-600/80'
                              }`}>
                                {project.field}
                              </div>
                              <div className={`text-sm font-light ${
                                darkMode ? 'text-gray-400/70' : 'text-gray-500/70'
                              }`}>
                                {project.subfield}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                              {project.priority}
                            </span>
                            <div className={`w-3 h-3 rounded-full ${
                              project.status === 'active' ? 'bg-green-500' :
                              project.status === 'completed' ? 'bg-blue-500' :
                              project.status === 'planning' ? 'bg-yellow-500' :
                              'bg-gray-500'
                        }`} />
                          </div>
                      </div>

                        <div className={`font-light text-lg mb-3 line-clamp-2 tracking-tight ${
                            darkMode ? 'text-white/95' : 'text-gray-900'
                          }`}>
                            {project.name}
                        </div>

                        <div className={`text-sm mb-4 line-clamp-2 font-light leading-relaxed ${
                          darkMode ? 'text-gray-300/80' : 'text-gray-600/80'
                        }`}>
                          {project.description}
                        </div>
                      </div>

                      {/* Research metrics */}
                      <div className="p-6 pt-2 flex-1">
                        {/* Funding info */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className={`w-4 h-4 ${
                              darkMode ? 'text-green-400/80' : 'text-green-600/80'
                            }`} />
                            <span className={`text-sm font-medium ${
                              darkMode ? 'text-gray-300/90' : 'text-gray-700/90'
                            }`}>
                              {formatCurrency(project.funding.amount, project.funding.currency)}
                            </span>
                          </div>
                          <div className={`text-sm font-light ${
                            darkMode ? 'text-gray-400/70' : 'text-gray-500/70'
                          }`}>
                            {project.funding.source}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-light ${
                              darkMode ? 'text-gray-400/70' : 'text-gray-500/70'
                            }`}>
                              Progress
                            </span>
                            <span className={`text-sm font-medium ${
                              darkMode ? 'text-gray-300/90' : 'text-gray-600/90'
                            }`}>
                              {project.progress}%
                            </span>
                          </div>
                          <div className={`w-full h-2.5 rounded-full ${
                            darkMode ? 'bg-gray-700/60' : 'bg-gray-200/60'
                          }`}>
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(project.status)} transition-all duration-300`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Research metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {project.publications.length}
                            </div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Publications
                            </div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {project.impact.totalCitations}
                            </div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Citations
                            </div>
                          </div>
                        </div>

                        {/* Team and collaborators */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Users className={`w-3 h-3 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {project.team.length} researchers
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className={`w-3 h-3 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {project.collaborators.length} partners
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                              darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 2 && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                              darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              +{project.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer with actions */}
                      <div className={`p-4 pt-2 border-t ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                                handleOpenResearchMode(project.id);
                            }}
                              title="Open in Research Mode"
                          >
                              <Microscope className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareProject(project.id);
                            }}
                            title="Share Project"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMoreMenu(openMoreMenu === project.id ? null : project.id);
                            }}
                            title="More Options"
                          >
                            <MoreVertical className="w-4 h-4" />
                            
                            {/* More Options Dropdown */}
                            {openMoreMenu === project.id && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                <div className="py-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('View publications for project:', project.id);
                                        setOpenMoreMenu(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                      <FileText className="w-4 h-4" />
                                      View Publications
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('View milestones for project:', project.id);
                                        setOpenMoreMenu(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                      <Target className="w-4 h-4" />
                                      View Milestones
                                    </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadProject(project.id);
                                      setOpenMoreMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <Download className="w-4 h-4" />
                                      Download Data
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteProject(project.id);
                                      setOpenMoreMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                      Delete Project
                                  </button>
                                </div>
                              </div>
                            )}
                          </button>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(project.id);
                          }}
                          className={`p-1 rounded-full transition-all duration-300 ${
                            project.favorite
                              ? 'bg-yellow-500 text-white shadow-lg'
                              : 'bg-black/20 text-transparent hover:text-yellow-400 hover:bg-yellow-500/20'
                          }`}
                        >
                          <Star className="w-3 h-3" fill={project.favorite ? 'currentColor' : 'none'} />
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : viewMode === 'timeline' ? (
            <div className="space-y-6">
              {filteredAndSortedProjects.length === 0 ? (
                <div className={`text-center py-16 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No research projects found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                  
                  {filteredAndSortedProjects.map((project, index) => (
                    <div key={project.id} className="relative flex items-start mb-8">
                      {/* Timeline dot */}
                      <div className={`absolute left-6 w-4 h-4 rounded-full border-4 ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      } flex items-center justify-center z-10`}>
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'active' ? 'bg-green-500' :
                          project.status === 'completed' ? 'bg-blue-500' :
                          project.status === 'planning' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                      
                      {/* Project card */}
                      <div className={`ml-12 flex-1 ${
                        darkMode ? 'bg-gray-800/50' : 'bg-white'
                      } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border ${
                        selectedProjects.includes(project.id)
                          ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                          : darkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                      } overflow-hidden`}
                      onClick={() => {
                        const newSelected = selectedProjects.includes(project.id)
                          ? selectedProjects.filter(id => id !== project.id)
                          : [...selectedProjects, project.id];
                        setSelectedProjects(newSelected);
                      }}>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {getCategoryIcon(project.category)}
                              <div>
                                <h3 className={`text-lg font-semibold ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {project.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-sm ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {project.field} • {project.subfield}
                                  </span>
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                                    {project.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`text-right ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                <div className="text-sm font-medium">
                                  {new Date(project.date).toLocaleDateString()}
                                </div>
                                <div className="text-xs">
                                  {project.funding.source}
                                </div>
                              </div>
                              {project.favorite && (
                                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-4 line-clamp-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {project.description}
                          </p>
                          
                          {/* Research metrics */}
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className={`text-lg font-bold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {formatCurrency(project.funding.amount, project.funding.currency)}
                              </div>
                              <div className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Funding
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-bold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.publications.length}
                              </div>
                              <div className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Publications
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-bold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.impact.totalCitations}
                              </div>
                              <div className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Citations
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-bold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.progress}%
                              </div>
                              <div className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Progress
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mb-4">
                            <div className={`w-full h-2 rounded-full ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <div 
                                className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(project.status)} transition-all duration-300`}
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Milestones timeline */}
                          <div className="mb-4">
                            <h4 className={`text-sm font-medium mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Key Milestones
                            </h4>
                            <div className="space-y-2">
                              {project.milestones.slice(0, 3).map((milestone, milestoneIndex) => (
                                <div key={milestoneIndex} className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    milestone.status === 'completed' ? 'bg-green-500' :
                                    milestone.status === 'in_progress' ? 'bg-blue-500' :
                                    'bg-gray-400'
                                  }`}></div>
                                  <span className={`text-xs ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {milestone.title}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    getMilestoneStatusColor(milestone.status)
                                  }`}>
                                    {milestone.status.replace('_', ' ')}
                                  </span>
                                </div>
                              ))}
                              {project.milestones.length > 3 && (
                                <div className={`text-xs ${
                                  darkMode ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  +{project.milestones.length - 3} more milestones
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Team and collaborators */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Users className={`w-4 h-4 ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <span className={`${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {project.team.length} researchers
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Globe className={`w-4 h-4 ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <span className={`${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {project.collaborators.length} partners
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button 
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenResearchMode(project.id);
                                }}
                                title="Open in Research Mode"
                              >
                                <Microscope className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareProject(project.id);
                                }}
                                title="Share Project"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedProjects.length === 0 ? (
                <div className={`text-center py-16 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Microscope className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No research projects found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredAndSortedProjects.map(project => (
            <div
              key={project.id}
                    className={`group relative ${
                      darkMode ? 'bg-gray-800/50' : 'bg-white'
                    } rounded-xl p-6 transition-all duration-300 cursor-pointer border ${
                      selectedProjects.includes(project.id)
                        ? 'ring-2 ring-blue-500 shadow-blue-500/25'
                        : darkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    } hover:shadow-lg`}
                    onClick={() => {
                      const newSelected = selectedProjects.includes(project.id)
                        ? selectedProjects.filter(id => id !== project.id)
                        : [...selectedProjects, project.id];
                      setSelectedProjects(newSelected);
                    }}
                  >
                    <div className="flex items-start">
                      {/* Research project icon */}
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${getStatusColor(project.status)} flex items-center justify-center shadow-lg flex-shrink-0 mr-6`}>
                        {getCategoryIcon(project.category)}
                      </div>

                      {/* Project details */}
                <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                        <div className="flex items-center gap-3 mb-2">
                              <div className={`font-semibold text-xl truncate ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.name}
                          </div>
                          {project.favorite && (
                                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                          )}
                              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                              <span className={`px-3 py-1 text-sm rounded-full font-medium bg-gradient-to-r ${getPriorityColor(project.priority)} text-white`}>
                            {project.priority}
                          </span>
                </div>

                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center gap-1">
                                {getFieldIcon(project.field)}
                                <span className={`text-sm font-medium ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {project.field}
                                </span>
              </div>
                              <div className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {project.subfield}
                              </div>
                            </div>
                            
                            <p className={`text-sm mb-4 line-clamp-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {project.description}
                        </p>
                          </div>
                        </div>

                        {/* Research metrics row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {formatCurrency(project.funding.amount, project.funding.currency)}
                            </div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {project.funding.source}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {project.publications.length}
                            </div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Publications
                            </div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {project.impact.totalCitations}
                            </div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Citations
                            </div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {project.impact.hIndex}
                            </div>
                            <div className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              H-Index
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Project Progress
                          </span>
                            <span className={`text-sm font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {project.progress}%
                            </span>
                          </div>
                          <div className={`w-full h-3 rounded-full ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(project.status)} transition-all duration-300`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Team and collaborators */}
                        <div className="flex items-center gap-6 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Users className={`w-4 h-4 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {project.team.length} researchers
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className={`w-4 h-4 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {project.collaborators.length} partners
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            {project.lastModified}
                          </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, index) => (
                            <span key={index} className={`px-2 py-1 text-xs rounded-full font-medium ${
                              darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tag}
                          </span>
                          ))}
                        </div>
                      </div>

                      {/* Progress and actions */}
                      <div className="flex flex-col items-end gap-4 ml-6">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.progress}%
                          </div>
                          <div className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Complete
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenResearchMode(project.id);
                            }}
                            title="Open in Research Mode"
                          >
                            <Microscope className="w-5 h-5" />
                </button>
                          <button 
                            className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareProject(project.id);
                            }}
                            title="Share Project"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                          <button 
                            className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMoreMenu(openMoreMenu === project.id ? null : project.id);
                            }}
                            title="More Options"
                          >
                            <MoreVertical className="w-5 h-5" />
                          
                          {/* More Options Dropdown */}
                          {openMoreMenu === project.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                              <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('View publications for project:', project.id);
                                      setOpenMoreMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    View Publications
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('View milestones for project:', project.id);
                                      setOpenMoreMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <Target className="w-4 h-4" />
                                    View Milestones
                                  </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadProject(project.id);
                                    setOpenMoreMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                    Download Data
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProject(project.id);
                                    setOpenMoreMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                    Delete Project
                </button>
                              </div>
                            </div>
                          )}
                          </button>
                        </div>
                      </div>
              </div>
            </div>
          ))
        )}
      </div>
          )}
        </div>
      </div>

      {/* Research Selection Menu */}
      {selectedProjects.length > 0 && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          selectedProjects.length > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
        }`}>
          <div className={`${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } rounded-2xl shadow-2xl border ${
            darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          } px-6 py-3.5 flex items-center gap-4 backdrop-blur-xl`}>
            {/* Selection Count */}
            <div className={`text-base font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {selectedProjects.length} research projects selected
            </div>

            {/* Divider */}
            <div className={`w-px h-6 ${
              darkMode ? 'bg-gray-600/50' : 'bg-gray-300/50'
            }`}></div>

            {/* Research Action Buttons */}
            <button 
              onClick={() => {
                setSuccessMessage(`Created research workspace with ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              <Microscope className="w-4 h-4 mr-2 inline" />
              Research Workspace
            </button>
            
            <button 
              onClick={() => {
                setSuccessMessage(`Generated collaboration report for ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:text-gray-900'
              } shadow-md`}
            >
              <FileText className="w-4 h-4 mr-2 inline" />
              Generate Report
            </button>
            
            <button 
              onClick={() => {
                setSuccessMessage(`Exported data for ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:text-gray-900'
              } shadow-md`}
            >
              <Download className="w-4 h-4 mr-2 inline" />
              Export Data
            </button>
            
            <button 
              onClick={() => {
                setSuccessMessage(`Started batch analysis for ${selectedProjects.length} project(s)`);
                setSelectedProjects([]);
              }}
              className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Batch Analysis
            </button>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {(successMessage || errorMessage) && (
        <div className={`fixed bottom-8 right-8 z-50 transform transition-all duration-500 ${
          successMessage || errorMessage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {successMessage && (
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
              darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
            }`}>
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
              darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
            }`}>
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Add Research Project Modal */}
      {showAddProjectModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md"
          onClick={closeModal}
        >
          <div 
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl shadow-2xl border ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            } w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Research Project
              </h2>
              <button 
                onClick={closeModal} 
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Research Project Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter research project title..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Research Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your research objectives, methodology, and expected outcomes..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Research Field and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Research Field
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>Computer Science</option>
                      <option>Environmental Science</option>
                      <option>Biomedical Engineering</option>
                      <option>Materials Science</option>
                      <option>Bioinformatics</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Subfield
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Quantum Machine Learning"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Priority and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Priority Level
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Project Status
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>Planning</option>
                      <option>Active</option>
                      <option>Paused</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>

                {/* Funding Information */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                      Funding Source
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>NSF Grant</option>
                      <option>NIH Grant</option>
                      <option>DARPA Grant</option>
                      <option>DOE Grant</option>
                      <option>NOAA Grant</option>
                      <option>Private Foundation</option>
                      <option>Industry Partnership</option>
                      <option>Internal Funding</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Funding Amount (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter funding amount..."
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Research Team */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Research Team
                  </label>
                  <input
                    type="text"
                    placeholder="Add researchers (comma separated)..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Collaborators */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Collaborating Institutions
                  </label>
                  <input
                    type="text"
                    placeholder="Add collaborating institutions (comma separated)..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Research Keywords */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Research Keywords
                  </label>
                  <input
                    type="text"
                    placeholder="Add research keywords (comma separated)..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}
                  />
                </div>

                {/* Ethics Approval */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Ethics Approval Required
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>Not Required</option>
                      <option>IRB Approval</option>
                      <option>IACUC Approval</option>
                      <option>Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Data Management Plan
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none`}>
                      <option>Open Access</option>
                      <option>Controlled Access</option>
                      <option>Restricted Access</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                {/* Project Files Upload */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Research Documents
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : darkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center gap-4"
                    >
                      <div className={`w-16 h-16 rounded-full ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      } flex items-center justify-center`}>
                        <Upload className={`w-8 h-8 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <p className={`text-lg font-medium mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Drop research documents here or click to browse
                        </p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Supports PDFs, datasets, code repositories, and more
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeModal}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSuccessMessage('Research project created successfully!');
                    setTimeout(() => setSuccessMessage(""), 3000);
                    closeModal();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Microscope className="w-4 h-4 mr-2 inline" />
                  Create Research Project
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          itemName={selectedProject?.name || ''}
          itemType="project"
        />
    </div>
  );
} 
