# Contract Management Platform (Frontend)

LIVE LINK : https://contract-sys.vercel.app/

## Overview
This project is a **frontend-only Contract Management Platform** built as part of an assignment to demonstrate **product thinking, UI design, state management, and clean code architecture**.

The application allows users to:
- Create reusable contract templates (Blueprints)
- Generate contracts from blueprints
- Manage contracts through a **strict lifecycle**
- View and manage contracts from a dashboard

No backend is used. All data is stored locally using browser storage.



---

## Tech Stack & Justification

### Why React?
React was chosen because:
- It enables **component-based architecture**, which fits well for dashboards, forms, and reusable UI blocks
- It handles **state-driven UI** efficiently, which is critical for enforcing contract lifecycle rules
- React Context allows **global state management** without introducing unnecessary complexity
- It is widely adopted in industry, making the codebase familiar and maintainable

### Tools & Libraries
- **React (with JSX)** – UI development
- **Vite** – Fast development server and build tool
- **React Router DOM** – Client-side routing
- **Context API** – State management
- **LocalStorage** – Mock persistence layer

---


src/
 ├── components/
 │   ├── Navbar.jsx
 │   ├── Footer.jsx
 │   └── StatusBadge.jsx
 │
 ├── context/
 │   ├── BlueprintContext.jsx
 │   └── ContractContext.jsx
 │
 ├── pages/
 │   ├── Dashboard.jsx
 │   ├── Blueprints.jsx
 │   ├── BlueprintEditor.jsx
 │   └── CreateContract.jsx
 │
 ├── App.jsx
 ├── main.jsx


## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation Steps

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate into the project
cd contract-management-platform

# Install dependencies
npm install

# Start development server
npm run dev
