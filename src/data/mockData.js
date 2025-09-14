// Centralized mock data for consistent usage across the application
export const mockTickets = [
  {
    id: 1,
    title: "Internet Connection Issue",
    description: "Client reports intermittent internet disconnections",
    clientName: "John Smith",
    priority: "high",
    assignedTech: "Michael Johnson",
    status: "in-progress",
    createdAt: "2025-08-01"
  },
  {
    id: 2,
    title: "Router Configuration",
    description: "Need help setting up new router",
    clientName: "Sarah Williams",
    priority: "medium",
    assignedTech: "Emily Chen",
    status: "pending",
    createdAt: "2025-08-03"
  },
  {
    id: 3,
    title: "Slow Internet Speed",
    description: "Client experiencing slower than advertised speeds",
    clientName: "Robert Davis",
    priority: "critical",
    assignedTech: "David Kim",
    status: "completed",
    createdAt: "2025-08-05"
  }
];

export const mockClients = [
  {
    id: 1,
    name: "John Smith",
    contact: "john.smith@example.com",
    address: "123 Main St, Nairobi",
    routerDetails: "TP-Link Archer C7"
  },
  {
    id: 2,
    name: "Sarah Williams",
    contact: "sarahw@example.com",
    address: "456 Park Ave, Mombasa",
    routerDetails: "Netgear Nighthawk R7000"
  },
  {
    id: 3,
    name: "Robert Davis",
    contact: "rob.davis@example.com",
    address: "789 Oak Rd, Kisumu",
    routerDetails: "Asus RT-AC88U"
  }
];

export const mockTechs = [
  { id: 1, name: "Michael Johnson" },
  { id: 2, name: "Emily Chen" },
  { id: 3, name: "David Kim" }
];

export const mockAnalytics = {
  ticketStatus: {
    pending: 5,
    "in-progress": 8,
    completed: 12
  },
  ticketPriority: {
    low: 3,
    medium: 10,
    high: 7,
    critical: 5
  }
};