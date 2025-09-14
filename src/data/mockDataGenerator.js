// Utility function to generate random numbers
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random dates within the last year
const randomDate = () => {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const end = new Date();
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toLocaleString();
};

// Generate mock tickets
export const generateTickets = (count) => {
  const statuses = ['pending', 'in-progress', 'completed'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const techNames = ['Tech A', 'Tech B', 'Tech C', 'Tech D', 'Tech E'];
  const assignedByNames = ['Admin User', 'Agent Smith', 'Agent Johnson', 'Manager Davis'];
  
  // Assign some tickets to a fixed technician id to simulate "Current Tech"
  const currentTechId = 1; // Assuming technician with id 1 is the current tech
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Ticket ${i + 1}: ${['Network Issue', 'Hardware Failure', 'Software Problem', 'Configuration'][i % 4]}`,
    description: `Description for ticket #${i + 1}. This ticket involves resolving ${['connectivity', 'performance', 'security', 'update'][i % 4]} issues.`,
    clientId: getRandomInt(1, 150),
    clientName: `Client ${getRandomInt(1, 150)}`,
    assignedTech: i % 5 === 0 ? currentTechId : getRandomInt(2, 30), // Assign every 5th ticket to current tech
    assignedTo: techNames[i % techNames.length],
    assignedBy: assignedByNames[i % assignedByNames.length],
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    createdAt: randomDate(),
    dateAssigned: new Date(Date.now() - getRandomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    timeAssigned: `${getRandomInt(8, 17)}:${getRandomInt(0, 59).toString().padStart(2, '0')}`,
    timeCompleted: Math.random() > 0.6 ? `${getRandomInt(8, 17)}:${getRandomInt(0, 59).toString().padStart(2, '0')}` : null,
    timeSpent: getRandomInt(15, 240)
  }));
};

// Generate mock clients
export const generateClients = (count) => {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'company.com', 'business.io'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `client${i + 1}@${domains[i % domains.length]}`,
    phone: `+1-555-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
    address: `${getRandomInt(100, 999)} ${['Main', 'Oak', 'Pine', 'Maple', 'Cedar'][i % 5]} St, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5]}`
  }));
};

// Generate mock technicians
export const generateTechnicians = (count) => {
  const firstNames = ['David', 'Sarah', 'Thomas', 'Emily', 'Charles', 'Jessica', 'Daniel', 'Karen', 'Matthew', 'Lisa'];
  const lastNames = ['Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `tech${i + 1}@company.com`,
    phone: `+1-555-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
    expertise: ['Networking', 'Hardware', 'Security', 'Cloud', 'Database'][i % 5]
  }));
};

// Generate mock routers
export const generateRouters = (count) => {
  const models = [
    'TP-Link Archer C7', 
    'Netgear Nighthawk R7000', 
    'Asus RT-AC86U', 
    'Linksys EA7500',
    'Google Nest Wifi',
    'Ubiquiti AmpliFi HD',
    'D-Link DIR-879',
    'Synology RT2600ac'
  ];
  
  const statuses = ['Active', 'Offline', 'Recovery Needed', 'Maintenance'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    model: models[i % models.length],
    serial: `SN-${getRandomInt(100000, 999999)}`,
    status: statuses[i % statuses.length],
    location: `Location ${i + 1}`,
    lastSeen: randomDate()
  }));
};

// Generate mock activities
export const generateActivities = (count) => {
  const actions = [
    'Created ticket', 
    'Updated client info', 
    'Resolved ticket', 
    'Created new user',
    'Updated router info',
    'Assigned technician',
    'Closed ticket',
    'Initiated recovery'
  ];
  
  const users = ['Admin', 'Agent', 'Tech Support', 'System'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    user: `${users[i % users.length]} ${getRandomInt(1, 20)}`,
    action: actions[i % actions.length],
    target: `TKT-${getRandomInt(1000, 9999)}`,
    timestamp: randomDate()
  }));
};

// Generate mock analytics
export const generateAnalytics = () => {
  return {
    ticketStatus: [
      { status: 'pending', count: getRandomInt(15, 40) },
      { status: 'in-progress', count: getRandomInt(10, 30) },
      { status: 'completed', count: getRandomInt(20, 50) }
    ],
    ticketPriority: [
      { priority: 'critical', count: getRandomInt(5, 15) },
      { priority: 'high', count: getRandomInt(10, 25) },
      { priority: 'medium', count: getRandomInt(20, 40) },
      { priority: 'low', count: getRandomInt(15, 30) }
    ],
    resolutionTimes: [
      { range: '< 1 day', count: getRandomInt(20, 50) },
      { range: '1-3 days', count: getRandomInt(15, 40) },
      { range: '3-7 days', count: getRandomInt(5, 20) },
      { range: '> 7 days', count: getRandomInt(1, 10) }
    ],
    metrics: {
      avgResolutionTime: `${getRandomInt(1, 48)}h ${getRandomInt(0, 59)}m`,
      firstResponseTime: `${getRandomInt(1, 6)}h ${getRandomInt(0, 59)}m`,
      satisfactionRate: `${getRandomInt(85, 99)}%`
    }
  };
};