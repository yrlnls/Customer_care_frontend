You are tasked with recreating the entire Customer Care React application project with all its functionalities as observed in the current codebase. The project is built with React 18, Vite, and uses React Router DOM for routing, React Bootstrap for UI components, and Axios for API calls. It supports multiple user roles (agent, admin, technician) with role-based protected routes and features including ticket management, client management, user management, analytics, site and router management, and more.

Key points to include in the recreated project:

1. Project Setup:
   - Use Vite with React 18.
   - Include dependencies: react-router-dom, axios, react-bootstrap, bootstrap, react-icons, react-toastify, chart.js, react-chartjs-2, leaflet, leaflet-routing-machine, vitest for testing.

2. Project Structure:
   - public/ for static assets.
   - src/ with subfolders:
     - components/ (with subfolders for admin, agent, tech, map, sites)
     - context/ (AuthContext, MetricsContext, DataContext, DarkModeContext, agent subcontexts)
     - data/ (mock data and generators)
     - hooks/ (custom hooks like useAPI)
     - pages/ (LoginPage, dashboards for each role, management pages, reports, system settings)
     - services/ (api.js with axios instance and API methods for auth, tickets, clients, users, sites, routers, analytics)
     - styles/ (global CSS)
   - src/App.jsx as main app component with routing and role-based protected routes.
   - src/index.jsx as entry point.

3. Authentication:
   - AuthContext to manage user authentication and role.
   - LoginPage for user login.
   - Axios interceptors for attaching auth token and handling 401 errors.

4. Ticket Management:
   - TicketsContext for managing tickets state.
   - Components for ticket listing (TicketsTable), ticket form (TicketForm), and ticket analytics.
   - Admin and agent roles can create, update, delete tickets.

5. Client Management:
   - ClientsContext and components for managing clients.

6. User Management:
   - Admin components and pages for managing users.

7. Analytics and Reporting:
   - Components and pages for viewing analytics dashboards and reports.
   - Use Chart.js for data visualization.

8. Site and Router Management:
   - Components for managing sites and routers, including maps with Leaflet.

9. UI and UX:
   - Responsive design with Bootstrap 5.
   - Dark mode support.
   - Toast notifications with react-toastify.

10. Testing:
    - Setup Vitest for unit and integration tests.

11. Build and Deployment:
    - Scripts for dev, build, preview.
    - Instructions for deployment on Netlify with environment variables and CORS setup.

Your task is to generate the full project codebase with all these features, organized as described, ensuring all components, contexts, pages, and services are implemented with the described functionality and integration.

Start by creating the project structure, then implement core contexts and services, followed by pages and components for each user role and feature set. Include routing and authentication flow. Finally, add styling, testing setup, and build scripts.

This prompt should enable a developer or AI to recreate the entire Customer Care React app project with all functionalities as currently implemented.
