# Task Manager - Task Dashboard SPA

A modern, feature-rich task management dashboard built as a Single Page Application with **React**, **TypeScript**, and **Tailwind CSS**. Create, organize, filter, and visualize your tasks through an intuitive and responsive interface with real-time analytics.

[![GitHub Repository](https://img.shields.io/badge/GitHub-SAMCOM--07%2Ftask--manager-blue?logo=github)](https://github.com/SAMCOM-07/task-manager.git)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-vercel-blueviolet)](https://taskmanager-spa.vercel.app)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?logo=typescript)](https://www.typescriptlang.org)

---

## 🚀 Features

### Task Management
- ✅ **Full CRUD Operations** — Create, read, update, and delete tasks with real-time feedback
- ✅ **Persistent Storage** — All tasks synced with backend database
- ✅ **Rich Task Model** — Title, description, due date, priority level, status, and category

### Filtering & Search
- 🔍 **Status Filters** — View tasks by All, Completed, In Progress, or To Do
- 🎯 **Priority Filters** — Filter by Low, Medium, or High priority
- ⚠️ **Overdue Detection** — Automatically identifies and highlights overdue tasks
- ⚡ **Real-time Search** — Instantly search tasks by title or description

### Dashboard Analytics
- 📊 **Summary Cards** — At-a-glance metrics for Total, Completed, In Progress, and To Do tasks
- 📈 **Interactive Charts** — Donut chart showing task completion breakdown (Recharts)
- 📌 **Recent Tasks** — Quick preview of latest tasks with status indicators
- 📄 **PDF Export** — Generate task reports as PDF documents

### User Management
- 👤 **User Profiles** — Manage profile information and preferences
- 🔐 **Authentication** — Secure login/register with JWT tokens
- 🔑 **Password Management** — Change password and account security
- 🗑️ **Account Controls** — Delete account and clear all tasks

### UI / UX
- 🌓 **Dark / Light Theme** — Toggle between themes with persistent preferences
- 📱 **Fully Responsive** — Adaptive layout for mobile, tablet, and desktop
- 🎨 **Modern Design** — Clean interface with Tailwind CSS styling
- 🔔 **Toast Notifications** — Success/error alerts with auto-dismiss
- 🏷️ **Visual Indicators** — Color-coded badges for status and priority

### AI Features
- 🤖 **AI Task Assistant** — Get intelligent suggestions and step-by-step guidance for task completion
- 💡 **Smart Insights** — Analyze task title and description to provide actionable advice
- 📝 **Markdown Formatted Responses** — Rich, readable AI-generated guidance with structured formatting
- ⚡ **Quick Access** — One-click AI help directly from task details modal
- 🔐 **Secure & Private** — Authenticated requests with JWT token verification

---

## 🛠️ Tech Stack

### Frontend
| Component | Technology |
|-----------|------------|
| **Framework** | React 19.2 · TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 · clsx · tailwind-merge |
| **Routing** | React Router DOM 7 |
| **State Management** | React Context API + custom hooks |
| **Visualization** | Recharts 3 |
| **Icons** | Lucide React |
| **PDF Generation** | jsPDF 4 |
| **Markdown Rendering** | React Markdown |
| **Validation** | Zod 4 |
| **Linting** | ESLint 9 · typescript-eslint |
| **Deployment** | vercel |

### Backend
| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express 5 |
| **Language** | TypeScript 6 |
| **Database** | PostgreSQL |
| **Authentication** | JWT + bcrypt |
| **AI Integration** | OpenAI (GPT-4o-mini via OpenRouter) |
| **Validation** | Zod |
| **Security** | CORS · Cookie Parser · Sanitize HTML |

---

## 📁 Project Structure

```
task-manager/
├── client/                          # Frontend React SPA
│   ├── src/
│   │   ├── App.tsx                  # Root layout
│   │   ├── main.tsx                 # Entry point
│   │   ├── index.css                # Global styles
│   │   │
│   │   ├── pages/
│   │   │   ├── dashboard.tsx        # Analytics dashboard
│   │   │   ├── tasks.tsx            # Task management
│   │   │   ├── login.tsx            # Authentication
│   │   │   ├── register.tsx         # User registration
│   │   │   ├── profile.tsx          # User profile
│   │   │   ├── settings.tsx         # Settings & preferences
│   │   │   └── loading.tsx          # Loading state
│   │   │
│   │   ├── components/
│   │   │   ├── TasksTable.tsx       # Task list & filters
│   │   │   ├── FormOverlay.tsx      # Task creation/edit modal
│   │   │   ├── Navbar.tsx           # Top navigation
│   │   │   ├── Sidebar.tsx          # Desktop navigation
│   │   │   ├── ProfileDropdown.tsx  # User menu
│   │   │   ├── PieChart.tsx         # Status chart
│   │   │   ├── Alert.tsx            # Toast notifications
│   │   │   ├── ThemeToggle.tsx      # Theme switcher
│   │   │   └── ...
│   │   │
│   │   ├── context/
│   │   │   ├── AppContext.tsx       # Global task state
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   └── CreateContext.tsx    # Context factory
│   │   │
│   │   ├── hooks/
│   │   │   ├── useTask.tsx          # Task context hook
│   │   │   ├── useAuth.tsx          # Auth context hook
│   │   │   ├── useUser.tsx          # User data hook
│   │   │   └── useTaskFetch.tsx     # Task fetching hook
│   │   │
│   │   ├── config/
│   │   │   └── api.ts               # API configuration
│   │   │
│   │   ├── utils/
│   │   │   ├── getData.ts           # Task fetch utilities
│   │   │   └── handleAuth.ts        # Auth utilities
│   │   │
│   │   ├── types/
│   │   │   └── types.ts             # TypeScript definitions
│   │   │
│   │   └── lib/
│   │       └── utils.ts             # Helper utilities
│   │
│   ├── public/                      # Static assets
│   ├── .env.example                 # Environment template
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript config
│   └── package.json                # Dependencies
│
└── server/                          # Express backend
    ├── src/
    │   ├── app.ts                   # Express app setup
    │   ├── server.ts                # Server entry point
    │   │
    │   ├── controllers/
    │   │   ├── auth.controller.ts   # Authentication logic
    │   │   ├── task.controller.ts   # Task CRUD operations
    │   │   └── user.controller.ts   # User management
    │   │
    │   ├── routes/
    │   │   ├── auth.route.ts        # Auth endpoints
    │   │   ├── task.route.ts        # Task endpoints
    │   │   └── user.route.ts        # User endpoints
    │   │
    │   ├── middlewares/
    │   │   └── auth.middleware.ts   # JWT verification
    │   │
    │   ├── schemas/
    │   │   ├── task.schema.ts       # Task validation
    │   │   └── user.schema.ts       # User validation
    │   │
    │   ├── db/
    │   │   └── pool.ts              # PostgreSQL connection
    │   │
    │   ├── utils/
    │   │   └── sanitizer.ts         # Input sanitization
    │   │
    │   ├── config/                  # Configuration files
    │   ├── types/
    │   │   └── types.ts             # Type definitions
    │   └── .env.example             # Environment template
    │
    ├── dist/                        # Compiled JavaScript
    ├── tsconfig.json               # TypeScript config
    └── package.json                # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **pnpm** 10.18+ (recommended) or npm / yarn
- **PostgreSQL** 12+ (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SAMCOM-07/task-manager.git
   ```

2. **Setup Frontend**
   ```bash
   cd client
   pnpm install
   cp .env.example .env
   # Update .env with your API_URL
   ```

3. **Setup Backend**
   ```bash
   cd server
   pnpm install
   cp .env.example .env
   # Configure DATABASE_URL, PORT, CORS_ORIGIN in .env
   ```

4. **Configure Environment Variables**

   **Client** (`.env`):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

   **Server** (`.env`):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/task_manager
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

### Running Locally

1. **Start Backend Server**
   ```bash
   cd server
   pnpm dev
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend (in another terminal)**
   ```bash
   cd client
   pnpm dev
   # App runs on http://localhost:5173
   ```

3. **Access the application**
   - Open browser to `http://localhost:5173`
   - Register a new account or login

---

## 📦 Available Scripts

### Client
```bash
pnpm dev       # Start dev server with hot reload
pnpm build     # Build for production (tsc + vite build)
pnpm lint      # Run ESLint checks
pnpm preview   # Preview production build locally
```

### Server
```bash
pnpm dev       # Start with nodemon (auto-restart on changes)
pnpm build     # Compile TypeScript to JavaScript
pnpm start     # Run compiled server
```

---

## 🔑 Key Features Implementation

### Authentication Flow
- JWT-based authentication with secure cookie storage
- Password hashing using bcrypt
- Protected routes with middleware verification

### State Management
- React Context API for global state (tasks, auth, user)
- Custom hooks for easy component integration
- Automatic persistence with backend sync

### API Configuration
- Centralized API URL configuration via environment variables
- Dynamic base URL for seamless environment switching
- Support for development and production deployments

### Form Validation
- Client-side validation using Zod schemas
- Server-side validation for security
- Real-time error feedback to users

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive navigation (sidebar → hamburger menu)
- Touch-friendly interfaces

### AI Features Implementation
- **Backend AI Controller** (`ai.controller.ts`) — Handles OpenAI API integration with GPT-4o-mini model
- **Structured Prompts** — System prompts guide AI to provide actionable, step-by-step guidance
- **Markdown Rendering** — React Markdown component beautifully formats AI responses with styling
- **Error Handling** — Graceful fallbacks with user-friendly error messages
- **Authentication** — JWT middleware ensures only authenticated users access AI features
- **OpenRouter Integration** — Uses OpenRouter API for reliable, cost-effective AI model access

**How to Enable AI Features:**
1. Get your OpenRouter API key from [openrouter.ai](https://openrouter.ai)
2. Add `OPENROUTER_API_KEY` to your server `.env` file
3. Click "Ask AI for Help" button in any task details modal
4. AI analyzes task title and description to provide smart insights

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `cd client && pnpm install && pnpm build`
3. Set environment variable: `VITE_API_URL=<your-backend-url>`
4. Deploy automatically on push to main
5. Live: [https://taskmanager-spa.vercel.app](https://taskmanager-spa.vercel.app)

### Backend (Render)
- Deploy to Render for production hosting
- Set environment variables: `DATABASE_URL`, `PORT`, `CORS_ORIGIN`
- Ensure PostgreSQL database is provisioned
- Recommended platform: Render free tier or paid plans

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💼 Author

**Samuel**
- GitHub: [@SAMCOM-07](https://github.com/SAMCOM-07)
- Portfolio: [https://samuelshonde.vercel.app](https://samuelshonde.vercel.app)
- Repository: [task-manager](https://github.com/SAMCOM-07/task-manager.git)

---

## 📞 Support

For issues, questions, or suggestions, please:
- Open an [Issue](https://github.com/SAMCOM-07/task-manager/issues) on GitHub
- Check existing documentation
- Review the codebase comments

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vercel/vercel/Render for hosting and deployment
- Open-source community for libraries and tools
