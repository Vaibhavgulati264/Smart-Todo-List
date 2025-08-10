
# Smart Todo List with AI Integration

A modern, AI-powered task management application built with React, TypeScript, and Tailwind CSS. This application demonstrates intelligent task prioritization, context-aware recommendations, and smart deadline suggestions.

## 🚀 Features

### Core Functionality
- *Task Management*: Create, edit, delete, and organize tasks with priority levels
- *AI-Powered Prioritization*: Intelligent task ranking based on context and urgency
- *Smart Categorization*: Automatic category suggestions for new tasks
- *Context Analysis*: Process daily context from messages, emails, and notes
- *Deadline Suggestions*: AI-recommended deadlines based on task complexity
- *Task Enhancement*: Context-aware task description improvements

### AI Integration
- *Context Processing*: Analyzes daily inputs to understand user priorities
- *Priority Scoring*: Dynamic priority calculation based on keywords and deadlines
- *Smart Recommendations*: Task suggestions derived from context analysis
- *Category Intelligence*: Automatic categorization based on task content
- *Deadline Optimization*: Realistic deadline suggestions considering workload

### User Interface
- *Modern Design*: Clean, professional interface with subtle animations
- *Responsive Layout*: Optimized for desktop, tablet, and mobile devices
- *Dark/Light Theme*: Adaptive color scheme for better user experience
- *Interactive Components*: Hover states, transitions, and micro-interactions
- *Accessibility*: WCAG compliant with proper contrast ratios and keyboard navigation

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
Main dashboard showing task overview with priority indicators and filtering options

### Task Creation
![Task Creation](./screenshots/task-creation.png)
AI-assisted task creation with smart suggestions for categories, deadlines, and descriptions

### Context Input
![Context Input](./screenshots/context-input.png)
Daily context input interface for processing messages, emails, and notes

### Analytics
![Analytics](./screenshots/analytics.png)
Comprehensive analytics dashboard showing productivity insights and AI processing statistics

## 🛠 Tech Stack

- *Frontend*: React 18, TypeScript, Vite
- *Styling*: Tailwind CSS
- *Icons*: Lucide React
- *State Management*: React Hooks (useState, useEffect)
- *Data Persistence*: Local Storage (simulating backend)
- *AI Integration*: Mock AI service (ready for OpenAI/Claude/Gemini integration)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

1. *Clone the repository*
   bash
   git clone https://github.com/yourusername/smart-todo-ai.git
   cd smart-todo-ai
   

2. *Install dependencies*
   bash
   npm install
   

3. *Set up environment variables*
  
   
   Edit the .env file with your configuration:
   env
   VITE_APP_NAME=Smart Todo List
   VITE_AI_PROVIDER=mock
   VITE_OPENAI_API_KEY=your_openai_key_here
   VITE_CLAUDE_API_KEY=your_claude_key_here
   VITE_GEMINI_API_KEY=your_gemini_key_here
   

4. *Start the development server*
   bash
   npm run dev
   

5. *Open your browser*
   Navigate to http://localhost:5173

## 🔧 Configuration

### AI Provider Setup

The application supports multiple AI providers:

#### Option 1: OpenAI API
env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-openai-key


#### Option 2: Anthropic Claude
env
VITE_AI_PROVIDER=claude
VITE_CLAUDE_API_KEY=your-claude-key


#### Option 3: Google Gemini
env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=your-gemini-key


#### Option 4: LM Studio (Local)
env
VITE_AI_PROVIDER=lmstudio
VITE_LM_STUDIO_URL=http://localhost:1234


### Mock Mode (Default)
For demonstration purposes, the app runs in mock mode by default, simulating AI responses without requiring API keys.

## 📚 API Documentation

### Task Management Endpoints

#### GET /api/tasks
Retrieve all tasks with optional filtering
typescript
interface TaskResponse {
  tasks: Task[];
  total: number;
  filters: {
    category?: string;
    priority?: string;
    status?: string;
  };
}


#### POST /api/tasks
Create a new task
typescript
interface CreateTaskRequest {
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  tags?: string[];
}


#### PUT /api/tasks/:id
Update an existing task
typescript
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'in-progress' | 'completed';
  deadline?: string;
  tags?: string[];
}


### Context Management Endpoints

#### GET /api/context
Retrieve context entries
typescript
interface ContextResponse {
  entries: ContextEntry[];
  processed: number;
  total: number;
}


#### POST /api/context
Add new context entry
typescript
interface CreateContextRequest {
  content: string;
  source: 'whatsapp' | 'email' | 'notes' | 'manual';
}


### AI Integration Endpoints

#### POST /api/ai/prioritize
Get AI-powered task prioritization
typescript
interface PrioritizeRequest {
  tasks: Task[];
  context: ContextEntry[];
}

interface PrioritizeResponse {
  tasks: Task[];
  insights: AIInsight[];
}


#### POST /api/ai/suggest-deadline
Get deadline suggestions
typescript
interface DeadlineSuggestionRequest {
  task: Partial<Task>;
  context: ContextEntry[];
}

interface DeadlineSuggestionResponse {
  suggestedDeadline: string;
  reasoning: string;
  confidence: number;
}


## 🧪 Sample Data

### Sample Tasks
json
[
  {
    "title": "Complete project proposal",
    "description": "Draft and finalize the Q4 project proposal for the new mobile app initiative",
    "category": "Work",
    "priority": "high",
    "deadline": "2025-01-20",
    "tags": ["proposal", "mobile", "Q4"]
  },
  {
    "title": "Review team performance metrics",
    "description": "Analyze monthly performance data and prepare feedback",
    "category": "Management",
    "priority": "medium",
    "deadline": "2025-01-18",
    "tags": ["review", "team", "metrics"]
  }
]


### Sample Context Entries
json
[
  {
    "content": "Meeting with client tomorrow at 2 PM to discuss project requirements. Need to prepare presentation slides.",
    "source": "email",
    "timestamp": "2025-01-15T08:30:00Z"
  },
  {
    "content": "Urgent: The API documentation needs to be updated before the next release.",
    "source": "notes",
    "timestamp": "2025-01-15T09:15:00Z"
  }
]


## 🤖 AI Features Demo

### Context Analysis
The AI system analyzes daily context to identify:
- *Meeting mentions* → High priority tasks
- *Urgent keywords* → Critical priority assignment
- *Deadline references* → Adjusted timeline suggestions
- *Project mentions* → Category recommendations

### Smart Prioritization
Priority scoring algorithm considers:
- Keyword urgency indicators (urgent, critical, asap)
- Deadline proximity (overdue, due today, due this week)
- Context relevance (mentioned in recent communications)
- Task complexity indicators (research, analysis, development)

### Deadline Intelligence
Deadline suggestions based on:
- Task type complexity (email: 2 days, research: 14 days)
- Current workload analysis
- Context urgency indicators
- Historical completion patterns

## 🏗 Architecture

### Component Structure

src/
├── components/           # React components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Dashboard.tsx    # Task dashboard
│   ├── TaskCard.tsx     # Individual task display
│   ├── CreateTaskModal.tsx # Task creation form
│   ├── ContextInput.tsx # Context entry interface
│   └── Analytics.tsx    # Analytics dashboard
├── hooks/               # Custom React hooks
│   └── useTasks.ts     # Task management hook
├── services/            # Business logic services
│   ├── aiService.ts    # AI integration service
│   └── storageService.ts # Data persistence service
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared interfaces
└── App.tsx             # Main application component


### Data Flow
1. *User Input* → Components capture user interactions
2. *Hooks* → Custom hooks manage state and side effects
3. *Services* → Business logic processes data and AI requests
4. *Storage* → Local storage persists data (simulating database)
5. *AI Processing* → Mock AI service provides intelligent suggestions

## 🧪 Testing

### Manual Testing Scenarios

1. *Task Creation*
   - Create tasks with different priorities
   - Verify AI suggestions appear
   - Test category auto-suggestions

2. *Context Processing*
   - Add various context types
   - Trigger AI analysis
   - Verify task suggestions generation

3. *Priority Management*
   - Use AI prioritization feature
   - Check priority score updates
   - Verify task reordering

4. *Filtering & Search*
   - Test category filters
   - Search functionality
   - Priority-based filtering

## 🚀 Deployment

### Build for Production
bash
npm run build


### Preview Production Build
bash
npm run preview


### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: npm run build
3. Set publish directory: dist
4. Add environment variables in Netlify dashboard

### Deploy to Vercel
1. Install Vercel CLI: npm i -g vercel
2. Run: vercel
3. Follow the deployment prompts

## 🔮 Future Enhancements

### Backend Integration
- Django REST Framework API
- PostgreSQL database
- User authentication
- Real-time notifications

### Advanced AI Features
- Natural language task creation
- Smart scheduling optimization
- Productivity pattern analysis
- Collaborative task suggestions

### Mobile Application
- React Native mobile app
- Offline synchronization
- Push notifications
- Voice task creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/amazing-feature
3. Commit your changes: git commit -m 'Add amazing feature'
4. Push to the branch: git push origin feature/amazing-feature
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

*Your Name*
- GitHub: [@yourusername](https://github.com/Vaibhavgulati264/)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/vaibhav-gulati5002642002/)
- Email: vgulati179@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for the beautiful icons
- OpenAI for AI integration inspiration

