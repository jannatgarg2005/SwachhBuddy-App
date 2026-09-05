# 🌱 SwachhBuddy - Smart Waste Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**SwachhBuddy** is India's comprehensive digital waste management platform designed to promote sustainable practices through community engagement, gamification, and real-time tracking. Built for SIH 2025 and serving as a Minor Project for real-life waste management solutions.

---

## 🎯 Project Overview

SwachhBuddy transforms waste management by making it interactive, transparent, and rewarding. The platform caters to multiple user types including citizens, students, community leaders, waste collectors, rag pickers, and corporate employees.

### 🌟 Key Features

#### 🎮 **Play & Learn**
- **6 Interactive Games**: Waste Sorting Game, Eco Escape Room, Eco Word Search, Eco Sorter Training, Eco Runner, and Eco Mario
- Gamified learning experiences that make waste education fun and engaging
- Progressive difficulty levels to build expertise

#### 🏆 **Earn Rewards**
- Points-based reward system for sustainable actions
- Digital certifications and badges
- Referral program with bonus rewards
- Leaderboard and achievement tracking

#### 🚨 **Resolve Issues**
- Real-time waste reporting system
- AI-powered waste classification using computer vision
- Live map dashboard showing waste collection points
- Schedule pickup services
- Track waste management progress

#### 📚 **Comprehensive Learning Modules**
Four user type-specific learning paths:
- **Waste Management Professionals**: Basics → Advanced Segregation → Waste Processing
- **Students**: Environmental awareness and youth engagement
- **Community Leaders**: Organizing and leading cleanup drives
- **Rag Pickers**: Digital identity, safety, and income tracking

#### 🗺️ **Live Tracking & Transparency**
- Real-time waste collection truck routes
- Facility locations (Kabadiwala, Dhalao, Dump Yards, E-waste centers, etc.)
- Carbon footprint tracker
- Impact counter showing community-wide statistics

#### 🪪 **Rag Picker Digital Identity**
- Digital ID cards for informal waste workers
- Collection history and income certificates
- Stories and testimonials to raise awareness
- Registration and verification system

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.3.1
- **UI Library**: Radix UI + Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context API + Zustand

### Backend & Services
- **Authentication**: Firebase Auth + Supabase
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **File Storage**: Firebase Storage
- **Email**: EmailJS

### Maps & Visualization
- **Maps**: React Leaflet, Google Maps API
- **Charts**: Recharts
- **Data Visualization**: Custom SVG + Canvas

### Game Development
- **Physics Engine**: Phaser 3
- **QR Scanning**: ZXing Browser

### Additional Libraries
- `react-hook-form` + `zod` for form validation
- `@tanstack/react-query` for data fetching
- `lucide-react` for icons
- `date-fns` for date manipulation
- `react-confetti` for celebrations

---

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/jannatgarg2005/SwachhBuddy-App.git
cd SwachhBuddy-App
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Environment Variables**

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

4. **Run the development server**
```bash
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:8080`

---

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

---

## 📂 Project Structure

```
SwachhBuddy/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, videos
│   ├── components/      # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── learning/    # Learning module components
│   │   └── ragpicker/   # Rag picker specific components
│   ├── contexts/        # React contexts
│   ├── data/            # Static data (locations, routes)
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Third-party integrations
│   ├── lib/             # Utility functions & configurations
│   ├── pages/           # Page components
│   │   ├── Dashboard/   # User dashboards
│   │   └── landing-details/  # Feature detail pages
│   ├── services/        # API services
│   ├── stores/          # State management
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Key Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with feature overview |
| `/get-started` | User type selection |
| `/login` / `/signup` | Authentication |
| `/play` | Interactive games hub |
| `/earn` | Rewards and referral system |
| `/resolve` | Waste reporting and tracking |
| `/learning` | Educational modules hub |
| `/live-map` | Real-time waste facility map |
| `/dashboard/corporate` | Corporate user dashboard |
| `/dashboard/enduser` | End-user dashboard |
| `/ragpicker-identity` | Rag picker digital ID system |
| `/ragpicker-stories` | Community stories & testimonials |

---

## 🎮 Games Overview

1. **Waste Sorting Game**: Drag-and-drop waste items into correct bins
2. **Eco Escape Room**: Puzzle-based learning experience
3. **Eco Word Search**: Find waste-related terms
4. **Eco Sorter Training**: Advanced segregation training
5. **Eco Runner**: Endless runner collecting recyclables
6. **Eco Mario**: Platform game with environmental challenges

---

## 🔐 Authentication Flow

- Firebase Authentication for user management
- Supabase for user profiles and data
- Protected routes for authenticated users
- Role-based access (Corporate, End User, Admin)

---

## 🌍 Environmental Impact

SwachhBuddy tracks and displays:
- Total waste collected (kg)
- Carbon footprint reduced (kg CO₂)
- Trees saved equivalent
- Active user count
- Communities engaged

---

## 📱 Features by User Type

### 👨‍💼 **Corporate Users**
- Employee waste tracking dashboard
- Organization-wide statistics
- Team leaderboards
- Bulk pickup scheduling

### 👤 **End Users (Citizens)**
- Personal waste tracking
- Rewards and certifications
- Educational games and modules
- Waste reporting

### 🧹 **Rag Pickers**
- Digital identity cards
- Collection history logging
- Income certificates
- Safety training modules

### 🎓 **Students**
- Age-appropriate learning content
- School competition features
- Certificate generation
- Community projects

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer**: Jannat Garg  
**GitHub**: [@jannatgarg2005](https://github.com/jannatgarg2005)

---

## 🙏 Acknowledgments

- **SIH 2025** - Smart India Hackathon
- **Swachh Bharat Mission** - Inspiration for the project
- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible UI primitives
- **Vercel** - Hosting platform

---


## 🚧 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Offline mode support
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Advanced AI waste classification
- [ ] Blockchain-based reward tokens
- [ ] Integration with municipal waste management systems
- [ ] WhatsApp bot for notifications
- [ ] Voice assistant for accessibility

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you or if you find it interesting!

---

**Made with 💚 for a cleaner India**
