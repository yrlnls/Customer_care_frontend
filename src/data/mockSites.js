// Mock sites data for demonstration
export const mockSites = [
  {
    id: 1,
    name: 'Main Office',
    lat: -1.312,
    lng: 36.822,
    description: 'Primary headquarters building with full network infrastructure',
    type: 'office',
    status: 'active',
    address: '123 Main Street, Nairobi',
    contact: '+254-700-123-456'
  },
  {
    id: 2,
    name: 'Branch A',
    lat: -1.315,
    lng: 36.825,
    description: 'Regional branch office with satellite connectivity',
    type: 'branch',
    status: 'active',
    address: '456 Business Avenue, Nairobi',
    contact: '+254-700-123-457'
  },
  {
    id: 3,
    name: 'Data Center',
    lat: -1.308,
    lng: 36.818,
    description: 'Primary data center with redundant power and cooling',
    type: 'datacenter',
    status: 'active',
    address: '789 Tech Park, Nairobi',
    contact: '+254-700-123-458'
  },
  {
    id: 4,
    name: 'Warehouse',
    lat: -1.320,
    lng: 36.830,
    description: 'Storage facility with basic network coverage',
    type: 'warehouse',
    status: 'active',
    address: '321 Industrial Road, Nairobi',
    contact: '+254-700-123-459'
  },
  {
    id: 5,
    name: 'Remote Site',
    lat: -1.325,
    lng: 36.815,
    description: 'Remote monitoring station with limited connectivity',
    type: 'remote',
    status: 'maintenance',
    address: '555 Remote Location, Nairobi',
    contact: '+254-700-123-460'
  }
];

// Mock API functions
export const getSites = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSites), 500);
  });
};

export const addSite = (siteData) => {
  return new Promise((resolve) => {
    const newSite = {
      ...siteData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    mockSites.push(newSite);
    setTimeout(() => resolve(newSite), 500);
  });
};

export const updateSite = (siteId, siteData) => {
  return new Promise((resolve) => {
    const index = mockSites.findIndex(site => site.id === siteId);
    if (index !== -1) {
      mockSites[index] = { ...mockSites[index], ...siteData };
      setTimeout(() => resolve(mockSites[index]), 500);
    }
  });
};

export const deleteSite = (siteId) => {
  return new Promise((resolve) => {
    const index = mockSites.findIndex(site => site.id === siteId);
    if (index !== -1) {
      const deletedSite = mockSites.splice(index, 1)[0];
      setTimeout(() => resolve(deletedSite), 500);
    }
  });
};

// Connection management functions
export const getConnections = () => {
  return new Promise((resolve) => {
    const connections = JSON.parse(localStorage.getItem('siteConnections') || '[]');
    setTimeout(() => resolve(connections), 100);
  });
};

export const addConnection = (fromId, toId) => {
  return new Promise((resolve) => {
    const connections = JSON.parse(localStorage.getItem('siteConnections') || '[]');
    const newConnection = { from: fromId, to: toId };
    
    // Check if connection already exists
    const exists = connections.some(conn => 
      (conn.from === fromId && conn.to === toId) || 
      (conn.from === toId && conn.to === fromId)
    );
    
    if (!exists) {
      connections.push(newConnection);
      localStorage.setItem('siteConnections', JSON.stringify(connections));
    }
    
    setTimeout(() => resolve(newConnection), 100);
  });
};

export const removeConnection = (fromId, toId) => {
  return new Promise((resolve) => {
    const connections = JSON.parse(localStorage.getItem('siteConnections') || '[]');
    const updatedConnections = connections.filter(conn => 
      !(conn.from === fromId && conn.to === toId)
    );
    
    localStorage.setItem('siteConnections', JSON.stringify(updatedConnections));
    setTimeout(() => resolve({ from: fromId, to: toId }), 100);
  });
};
