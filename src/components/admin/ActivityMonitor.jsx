import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import { FaUser, FaTicketAlt, FaTools, FaClock } from 'react-icons/fa';

function ActivityMonitor() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filters, setFilters] = useState({
    userType: 'all',
    activityType: 'all',
    dateRange: 'today'
  });

  useEffect(() => {
    // Generate mock activity data
    const mockActivities = [
      {
        id: 1,
        user: 'Agent Sarah Johnson',
        userType: 'agent',
        activity: 'Created ticket',
        target: 'TKT-001 - Network Issue',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
        type: 'ticket_create'
      },
      {
        id: 2,
        user: 'Tech Mike Wilson',
        userType: 'technician',
        activity: 'Updated ticket status',
        target: 'TKT-005 - Router Configuration',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleString(),
        type: 'ticket_update'
      },
      {
        id: 3,
        user: 'Agent Lisa Chen',
        userType: 'agent',
        activity: 'Added new client',
        target: 'Client: John Smith',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toLocaleString(),
        type: 'client_create'
      },
      {
        id: 4,
        user: 'Tech David Kim',
        userType: 'technician',
        activity: 'Completed ticket',
        target: 'TKT-003 - Speed Optimization',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toLocaleString(),
        type: 'ticket_complete'
      },
      {
        id: 5,
        user: 'Agent Robert Davis',
        userType: 'agent',
        activity: 'Updated router information',
        target: 'Router: TP-Link Archer C7',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toLocaleString(),
        type: 'router_update'
      },
      {
        id: 6,
        user: 'Tech Emily Brown',
        userType: 'technician',
        activity: 'Added comment to ticket',
        target: 'TKT-007 - Hardware Failure',
        timestamp: new Date(Date.now() - 150 * 60 * 1000).toLocaleString(),
        type: 'ticket_comment'
      },
      {
        id: 7,
        user: 'Agent Mark Thompson',
        userType: 'agent',
        activity: 'Assigned ticket to technician',
        target: 'TKT-009 - Installation Request',
        timestamp: new Date(Date.now() - 180 * 60 * 1000).toLocaleString(),
        type: 'ticket_assign'
      },
      {
        id: 8,
        user: 'Tech Alice Johnson',
        userType: 'technician',
        activity: 'Recorded time spent',
        target: 'TKT-002 - Connectivity Issue',
        timestamp: new Date(Date.now() - 210 * 60 * 1000).toLocaleString(),
        type: 'time_record'
      }
    ];
    
    setActivities(mockActivities);
    setFilteredActivities(mockActivities);
  }, []);

  useEffect(() => {
    let filtered = activities;

    // Filter by user type
    if (filters.userType !== 'all') {
      filtered = filtered.filter(activity => activity.userType === filters.userType);
    }

    // Filter by activity type
    if (filters.activityType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filters.activityType);
    }

    // Filter by date range
    const now = new Date();
    if (filters.dateRange === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(activity => new Date(activity.timestamp) >= today);
    } else if (filters.dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(activity => new Date(activity.timestamp) >= weekAgo);
    }

    setFilteredActivities(filtered);
  }, [activities, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const getUserTypeBadge = (userType) => {
    switch(userType) {
      case 'agent': return <Badge bg="primary"><FaUser className="me-1" />Agent</Badge>;
      case 'technician': return <Badge bg="success"><FaTools className="me-1" />Technician</Badge>;
      case 'admin': return <Badge bg="danger"><FaUser className="me-1" />Admin</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getActivityBadge = (type) => {
    switch(type) {
      case 'ticket_create': return <Badge bg="info">Create</Badge>;
      case 'ticket_update': return <Badge bg="warning">Update</Badge>;
      case 'ticket_complete': return <Badge bg="success">Complete</Badge>;
      case 'ticket_assign': return <Badge bg="primary">Assign</Badge>;
      case 'ticket_comment': return <Badge bg="secondary">Comment</Badge>;
      case 'client_create': return <Badge bg="info">Client Add</Badge>;
      case 'router_update': return <Badge bg="warning">Router Update</Badge>;
      case 'time_record': return <Badge bg="dark"><FaClock className="me-1" />Time</Badge>;
      default: return <Badge bg="secondary">Action</Badge>;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Activity Monitor</h5>
          <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>User Type</Form.Label>
              <Form.Select
                value={filters.userType}
                onChange={(e) => handleFilterChange('userType', e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="agent">Agents</option>
                <option value="technician">Technicians</option>
                <option value="admin">Admins</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Activity Type</Form.Label>
              <Form.Select
                value={filters.activityType}
                onChange={(e) => handleFilterChange('activityType', e.target.value)}
              >
                <option value="all">All Activities</option>
                <option value="ticket_create">Ticket Creation</option>
                <option value="ticket_update">Ticket Updates</option>
                <option value="ticket_complete">Ticket Completion</option>
                <option value="ticket_assign">Ticket Assignment</option>
                <option value="client_create">Client Management</option>
                <option value="router_update">Router Updates</option>
                <option value="time_record">Time Recording</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Time Range</Form.Label>
              <Form.Select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="all">All Time</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>Activity</th>
              <th>Target</th>
              <th>Time</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map(activity => (
              <tr key={activity.id}>
                <td>
                  <div className="d-flex align-items-center">
                    {getUserTypeBadge(activity.userType)}
                    <span className="ms-2">{activity.user}</span>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {getActivityBadge(activity.type)}
                    <span className="ms-2">{activity.activity}</span>
                  </div>
                </td>
                <td>{activity.target}</td>
                <td>
                  <Badge bg="light" text="dark">{getTimeAgo(activity.timestamp)}</Badge>
                </td>
                <td>{activity.timestamp}</td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No activities found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default ActivityMonitor;
