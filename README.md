# 🧠 FLEX AI Life Coach Web App

<div align="center">
  <img src="https://github.com/Welloz03/chameleon-flexibility-09/blob/ae54deeda9405419c2dcfc94108bf2bdefa3ed01/assets/Flex_Header.png" alt="FLEX AI Life Coach Header" width="800"/>
</div>

## 📝 Overview

FLEX AI Life Coach is an innovative web application that leverages artificial intelligence to provide personalized life coaching and guidance. This project represents our first graduation project, combining cutting-edge technologies to create an intelligent and user-friendly life coaching platform.

## 🎯 Project Goals

- Provide personalized life coaching through AI-powered interactions
- Create an intuitive and engaging user interface
- Implement secure and efficient data handling
- Deliver actionable insights and recommendations
- Support continuous learning and improvement

## 🛠️ Technologies Used

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-FF6B6B?style=for-the-badge&logo=langchain&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

</div>

## ✨ Features

### Rich Text Support
- Full Markdown rendering in chat messages
- Syntax highlighting for code blocks
- Support for tables, lists, and blockquotes
- Inline code formatting
- Secure HTML sanitization
- Responsive design for all screen sizes

### Chat Interface
- Real-time message updates
- Typing indicators
- Message animations
- Code block syntax highlighting
- Markdown formatting
- Link previews
- File attachments

### AI Integration
- Natural language processing
- Context-aware responses
- Personalized recommendations
- Goal tracking and progress monitoring
- Adaptive learning

## 📈 Data Analysis

As part of developing the **FLEX AI Life Coach**, we conducted a detailed **data analysis process** to deeply understand the target users, their productivity patterns, and the factors that truly impact their daily performance.

> **This analysis was not just an extra step—it was a core part of the project.**  
> Every feature we added was based on real, measurable data—not assumptions.

The goal was to ensure that the FLEX AI system provides truly **impactful, personalized coaching based on actual user behaviors and trends.**

---

### 🔄 Workflow Overview

We followed a structured data analysis process that included:

1. **Data Collection:** Gathering data from user interactions and activities.
2. **Data Understanding:** Cleaning and preparing the data to ensure accuracy.
3. **Define Key Questions:** Identifying the critical questions about productivity and user behavior.
4. **Data Analysis:** Using statistical methods to uncover trends and influencing factors.
5. **Dashboard Creation:** Building interactive Power BI dashboards to visualize the findings.
6. **Insights Extraction:** Drawing actionable insights that guided our design decisions and feature development.

<div align="center">
  <img src="https://github.com/amramgad8/FLEX_AI_Life_Coach_App/blob/0e61f5f803628640f6e5f8c23b174a74116442ef/Analysis_Work_flow.png" alt="Data Analysis Workflow" width="800"/>
</div>

---

### 📊 Dashboard Insights

We created interactive dashboards using **Power BI** to visualize the key findings.

#### 📌 Dashboard Example 1:
<div align="center">
  <img src="https://github.com/amramgad8/FLEX_AI_Life_Coach_App/blob/b156b53d1c1b71b6ff703b8405b64063d66b19fe/dashboardFlex.png" alt="Dashboard Example 1" width="800"/>
</div>

#### 📌 Dashboard Example 2:
<div align="center">
  <img src="https://github.com/amramgad8/FLEX_AI_Life_Coach_App/blob/b156b53d1c1b71b6ff703b8405b64063d66b19fe/dashboardFlex2.png" alt="Dashboard Example 2" width="800"/>
</div>

---

### 🚀 Key Takeaways

- The majority of users are students who struggle with consistency in habits.
- **Focus level** and **daily planning** significantly impact productivity.
- **Sleep duration** has a direct correlation with performance.
- Users who consistently track their progress achieve higher task completion rates.
- Time management tools are widely used by high-performing users.

---
  
## 📊 Architecture

```mermaid
graph TD
    A[Client Browser] --> B[React Frontend]
    B --> C[FastAPI Backend]
    C --> D[LangChain]
    D --> E[Google AI]
    C --> F[Vector Database]
    C --> G[User Data Storage]
    
    subgraph Frontend
    B
    end
    
    subgraph Backend
    C
    D
    E
    F
    G
    end
```

## 🔄 Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant AI
    participant Database
    
    User->>Frontend: Input Query/Request
    Frontend->>Backend: API Request
    Backend->>Database: Fetch User Context
    Backend->>AI: Process Request
    AI->>Backend: Generate Response
    Backend->>Frontend: Return Response
    Frontend->>User: Display Results
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd flex-ai-life-coach
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   GOOGLE_API_KEY=your_api_key
   DATABASE_URL=your_database_url
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

## 📦 Dependencies

### Frontend Dependencies
- React 18
- TypeScript
- TailwindCSS
- Radix UI Components
- React Router DOM
- React Query
- Framer Motion
- React Markdown
- React Syntax Highlighter
- Rehype Raw & Sanitize
- And more (see package.json)

### Backend Dependencies
- FastAPI
- LangChain
- Google Generative AI
- FAISS
- scikit-learn
- numpy
- And more (see requirements.txt)

## 🏗️ Project Structure

```
flex-ai-life-coach/
├── assets/              # Static assets and images
├── src/                 # Frontend source code
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── utils/         # Utility functions
├── backend/            # Backend source code
│   ├── api/           # API endpoints
│   ├── models/        # Data models
│   └── services/      # Business logic
├── vector_db/         # Vector database storage
└── public/            # Public assets
```

## 👥 Team

- Mohamed Wael
- Mohamed Amr
- Kareem Nagah
- Amr Amgad
- Youssef Alsebaey
- Loay Ayman
- Abdallah Elhosseny
- Salma Gamal
- Tasneem Osama

## 🙏 Acknowledgments

- Our mentors and professors
- The open-source community
- All contributors who have helped shape this project


---

<div align="center">
  <img src="https://github.com/Welloz03/chameleon-flexibility-09/blob/fd70a6f187b552616b4675a1ba98af3edf921e1d/assets/Flex_Logo_H.png" alt="FLEX AI Logo" width="200"/>
  <br/>
  <em>Empowering lives through AI-driven coaching</em>
</div>
