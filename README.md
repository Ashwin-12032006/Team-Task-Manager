# Team Task Manager

Team Task Manager – README.md
🚀 Team Task Manager

A modern full-stack Team Task Manager web application that helps organizations and teams efficiently manage projects, assign tasks, track progress, monitor deadlines, and collaborate in real time.

Built with a responsive UI, authentication system, dashboards, analytics, and role-based task management features.

📌 Features
🔐 Authentication & Authorization
User Sign Up & Login
JWT Authentication
Secure Password Hashing
Role-Based Access Control
Admin
Manager
Team Member
📋 Task Management
Create Tasks
Assign Tasks to Team Members
Update Task Status
Set Priority Levels
Add Deadlines
Edit/Delete Tasks
Task Progress Tracking
👥 Team Collaboration
Multiple Team Members
Project-wise Task Allocation
Real-time Task Updates
Activity Timeline
Comments & Notes
📊 Dashboard & Analytics
Project Overview
Completed vs Pending Tasks
Team Productivity Charts
Deadline Monitoring
Recent Activities
Interactive Graphs & Statistics
🎨 Modern UI/UX
Responsive Design
Mobile Friendly
Beautiful Dashboard
Sidebar Navigation
Cards & Graph Components
Smooth Animations
🛠️ Tech Stack
Frontend
React.js
Tailwind CSS
Axios
React Router
Chart.js / Recharts
Backend
Node.js
Express.js
Database
MongoDB
Authentication
JWT (JSON Web Token)
bcrypt.js
📂 Project Structure
team-task-manager/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── charts/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── .env
├── package.json
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/team-task-manager.git
2️⃣ Navigate to Project Folder
cd team-task-manager
🔧 Backend Setup
Install Backend Dependencies
cd server
npm install
Create .env File
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
Run Backend Server
npm start

Backend runs on:

http://localhost:5000
💻 Frontend Setup
Install Frontend Dependencies
cd client
npm install
Run Frontend
npm start

Frontend runs on:

http://localhost:3000
📈 Dashboard Features
📌 Total Tasks
✅ Completed Tasks
⏳ Pending Tasks
🚨 High Priority Tasks
📅 Upcoming Deadlines
📊 Productivity Charts
🔑 User Roles
Role	Permissions
Admin	Full Access
Manager	Manage Projects & Tasks
Team Member	Update Assigned Tasks
📡 API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
Tasks
GET    /api/tasks
POST   /api/tasks/create
PUT    /api/tasks/:id
DELETE /api/tasks/:id
Projects
GET    /api/projects
POST   /api/projects/create
📷 Screens Included
Login Page
Dashboard
Project Management
Task Assignment
Analytics Section
Team Members Page
🔒 Security Features
JWT Authentication
Password Encryption
Protected Routes
Role-Based Authorization
Input Validation
🌟 Future Enhancements
Real-time Chat
Email Notifications
Calendar Integration
Drag & Drop Kanban Board
File Upload Support
Dark Mode
AI-based Task Suggestions
🧪 Testing
npm test
🚀 Deployment
Frontend Deployment
Vercel
Netlify
Backend Deployment
Render
Railway
Heroku
Database
MongoDB Atlas
🤝 Contributing

Contributions are welcome!

Fork the repository
Create your feature branch
git checkout -b feature-name
Commit your changes
git commit -m "Added new feature"
Push to branch
git push origin feature-name
Open a Pull Request
👨‍💻 Author

Ashwin

Full Stack Developer
React.js | Node.js | MongoDB
Passionate about scalable web applications and UI/UX design
📄 License

This project is licensed under the MIT License.

⭐ Acknowledgements
React Documentation
MongoDB Atlas
Express.js
Tailwind CSS
Chart.js
