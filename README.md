# Customer Care App - Vite React Project

This is a customer care application built with React and Vite, featuring ticket management, client management, and support operations.

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will open at [http://localhost:3000].

### Build for Production

```bash
npm run build
```

The build files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
customer-care-app/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React context providers
│   ├── data/            # Mock data and generators
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component
│   ├── index.jsx        # Entry point
│   └── index.css        # Global styles
├── index.html           # Vite entry HTML
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Features

- **Multi-role Dashboard**: Agent, Admin, and Technician dashboards
- **Ticket Management**: Create, update, and track support tickets
- **Client Management**: Manage client information and interactions
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React 19** with hooks and context API
- **Vite** for fast development and building
- **React Router DOM** for client-side routing
- **Bootstrap 5** for responsive styling
- **React Bootstrap** for UI components
- **Chart.js** for data visualization
- **React Icons** for iconography

## Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify.

3. Set environment variables in Netlify dashboard:
   - `VITE_API_BASE_URL`: Set to your backend API URL (e.g., `https://customer-care-backend-v2n0.onrender.com/api`)

### CORS Configuration

Since the frontend is hosted on Netlify and the backend on Render, ensure the Flask backend has CORS enabled to allow requests from your Netlify domain.

In your Flask backend (separate repo), install `flask-cors` and configure it:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://your-netlify-site.netlify.app"])  # Replace with your actual Netlify URL
```

Or for more flexibility:

```python
CORS(app, origins=["*"])  # Allow all origins (use with caution in production)
```

Test backend connectivity using the provided `test_backend_routes.py` script.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
