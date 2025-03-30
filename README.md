# 🎮 Karntarad

![Karntarad](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2.26-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)

## 📱 Overview

Karntarad is a gamified platform where users create, manage, and challenge themselves with social marketing scenarios. This interactive application allows marketers and aspiring social media managers to test their skills in a risk-free environment through dynamic, real-world simulations.

![Karntarad Banner](public/banner/character-banner-temp.png)

## ✨ Features

### 🚀 Dynamic Scenarios
- Experience ever-changing marketing challenges that simulate real-world social media trends
- Practice your marketing skills in a risk-free environment
- Learn from detailed performance analytics and feedback

### 🏢 Multi-Company Play
- Manage multiple companies simultaneously
- Test diverse strategies in parallel game sessions
- Compare results across different industry verticals

### 🔄 Community Challenges
- Create and share your own marketing scenarios
- Take on challenges crafted by fellow players
- Contribute to a growing library of marketing simulations

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Analytics**: Google Analytics, Microsoft Clarity
- **AI Integration**: Together AI for dynamic scenario generation
- **Charts**: Recharts for data visualization

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Firebase account for authentication and database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/karntarad.git
cd karntarad
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
   - Copy `.env.example` to `.env.local`
   - Add your Firebase configuration and other API keys

```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## 📂 Project Structure

```
karntarad/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── contexts/       # React contexts (e.g., AuthContext)
│   ├── interfaces/     # TypeScript interfaces
│   ├── lib/            # Utility functions and libraries
│   ├── middleware/     # Next.js middleware
│   ├── prompts/        # AI prompts templates
│   ├── services/       # Service layer for API interactions
│   └── types/          # TypeScript type definitions
├── .env.example        # Example environment variables
├── .env.local          # Local environment variables (not in repo)
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🔒 Authentication

Karntarad uses Firebase Authentication for user management. Currently, we support:

- Google Sign-In
- Email/Password authentication (coming soon)

## 🌐 Deployment

The application is designed to be deployed on Vercel or any other Next.js-compatible hosting provider:

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start
```

## 🤝 Contributing

We welcome contributions to Karntarad! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please reach out to the maintainers:

- Project Link: [https://github.com/yourusername/karntarad](https://github.com/yourusername/karntarad)

---

Built with ❤️ by the Karntarad Team
