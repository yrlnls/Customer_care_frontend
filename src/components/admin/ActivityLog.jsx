import React, { useEffect, useState } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { analyticsAPI } from '../../services/api';

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getActivityLog().then(res => {
      setActivities(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getActionBadge = (action) => {
    if (action.includes('Created')) return <Badge bg="success">Create</Badge>;
    if (action.includes('Updated')) return <Badge bg="primary">Update</Badge>;
    if (action.includes('Resolved')) return <Badge bg="warning">Resolve</Badge>;
    return <Badge bg="secondary">Action</Badge>;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Recent Activity</Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.user}</td>
                <td>
                  {getActionBadge(activity.action)} {activity.action}
                </td>
                <td>{activity.target}</td>
                <td>{activity.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default ActivityLog;