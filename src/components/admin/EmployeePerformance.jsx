import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col, Form } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function EmployeePerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const generateMonthlyTechData = () => [
      {
        id: 2,
        name: 'Mike Wilson',
        role: 'Technician',
        ticketsCreated: 0,
        ticketsResolved: 72, // 18*4 weeks
        avgResponseTime: '1.1h',
        clientSatisfaction: 4.9,
        efficiency: 96,
        totalHours: 152
      },
      {
        id: 4,
        name: 'David Kim',
        role: 'Technician', 
        ticketsCreated: 0,
        ticketsResolved: 60, // 15*4
        avgResponseTime: '1.6h',
        clientSatisfaction: 4.8,
        efficiency: 93,
        totalHours: 140
      },
      {
        id: 5,
        name: 'Emily Brown',
        role: 'Technician',
        ticketsCreated: 0,
        ticketsResolved: 80, // 20*4
        avgResponseTime: '1.3h', 
        clientSatisfaction: 5.0,
        efficiency: 94,
        totalHours: 160
      },
      {
        id: 7,
        name: 'James Smith',
        role: 'Technician',
        ticketsCreated: 0,
        ticketsResolved: 65,
        avgResponseTime: '1.4h',
        clientSatisfaction: 4.7,
        efficiency: 91,
        totalHours: 150
      }
    ];

    const data = selectedPeriod === 'month' 
      ? generateMonthlyTechData()
      : [
          {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Agent',
            ticketsCreated: 25,
            ticketsResolved: 22,
            avgResponseTime: '2.5h',
            clientSatisfaction: 4.8,
            efficiency: 88,
            totalHours: 40
          },
          {
            id: 2,
            name: 'Mike Wilson',
            role: 'Technician',
            ticketsCreated: 0,
            ticketsResolved: 18,
            avgResponseTime: '1.2h',
            clientSatisfaction: 4.9,
            efficiency: 95,
            totalHours: 38
          },
          {
            id: 3,
            name: 'Lisa Chen',
            role: 'Agent',
            ticketsCreated: 30,
            ticketsResolved: 28,
            avgResponseTime: '3.1h',
            clientSatisfaction: 4.6,
            efficiency: 85,
            totalHours: 42
          },
          {
            id: 4,
            name: 'David Kim',
            role: 'Technician',
            ticketsCreated: 0,
            ticketsResolved: 15,
            avgResponseTime: '1.8h',
            clientSatisfaction: 4.7,
            efficiency: 90,
            totalHours: 35
          },
          {
            id: 5,
            name: 'Emily Brown',
            role: 'Technician',
            ticketsCreated: 0,
            ticketsResolved: 20,
            avgResponseTime: '1.5h',
            clientSatisfaction: 4.9,
            efficiency: 92,
            totalHours: 40
          },
          // {
          //   id: 6,
          //   name: 'Robert Davis',
          //   role: 'Agent',
          //   ticketsCreated: 22,
          //   ticketsResolved: 20,
          //   avgResponseTime: '2.8h',
          //   clientSatisfaction: 4.5,
          //   efficiency: 82,
          //   totalHours: 39
          // }
        ];

    setPerformanceData(data);
  }, [selectedPeriod]);

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Agent': return <Badge bg="primary">Agent</Badge>;
      case 'Technician': return <Badge bg="success">Technician</Badge>;
      case 'Admin': return <Badge bg="danger">Admin</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getEfficiencyBadge = (efficiency) => {
    if (efficiency >= 90) return <Badge bg="success">{efficiency}%</Badge>;
    if (efficiency >= 80) return <Badge bg="warning">{efficiency}%</Badge>;
    return <Badge bg="danger">{efficiency}%</Badge>;
  };

  const getSatisfactionBadge = (rating) => {
    if (rating >= 4.5) return <Badge bg="success">{rating}/5</Badge>;
    if (rating >= 4.0) return <Badge bg="warning">{rating}/5</Badge>;
    return <Badge bg="danger">{rating}/5</Badge>;
  };

  // Chart data for tickets resolved
  const ticketsChartData = {
    labels: performanceData.map(emp => emp.name.split(' ')[0]),
    datasets: [
      {
        label: 'Tickets Resolved',
        data: performanceData.map(emp => emp.ticketsResolved),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tickets Created',
        data: performanceData.map(emp => emp.ticketsCreated),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const efficiencyChartData = {
    labels: performanceData.map(emp => emp.name.split(' ')[0]),
    datasets: [
      {
        label: 'Efficiency %',
        data: performanceData.map(emp => emp.efficiency),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employee Performance Metrics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Calculate summary statistics
  const totalTicketsResolved = performanceData.reduce((sum, emp) => sum + emp.ticketsResolved, 0);
  const avgEfficiency = performanceData.length > 0 
    ? (performanceData.reduce((sum, emp) => sum + emp.efficiency, 0) / performanceData.length).toFixed(1)
    : 0;
  const avgSatisfaction = performanceData.length > 0
    ? (performanceData.reduce((sum, emp) => sum + emp.clientSatisfaction, 0) / performanceData.length).toFixed(1)
    : 0;

  return (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Resolved</Card.Title>
              <Card.Text className="h4">{totalTicketsResolved}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Avg Efficiency</Card.Title>
              <Card.Text className="h4">{avgEfficiency}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Avg Satisfaction</Card.Title>
              <Card.Text className="h4">{avgSatisfaction}/5</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Active Employees</Card.Title>
              <Card.Text className="h4">{performanceData.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Tickets Performance</Card.Title>
              <Bar data={ticketsChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{selectedPeriod === 'month' ? 'Monthly ' : ''}Efficiency Trends</Card.Title>
              <Line data={efficiencyChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Employee Performance Details</h5>
            <Form.Select
              style={{ width: '200px' }}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Tickets Created</th>
                <th>Tickets Resolved</th>
                <th>Avg Response Time</th>
                <th>Client Satisfaction</th>
                <th>Efficiency</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{getRoleBadge(employee.role)}</td>
                  <td>{employee.ticketsCreated}</td>
                  <td>{employee.ticketsResolved}</td>
                  <td>{employee.avgResponseTime}</td>
                  <td>{getSatisfactionBadge(employee.clientSatisfaction)}</td>
                  <td>{getEfficiencyBadge(employee.efficiency)}</td>
                  <td>{employee.totalHours}h</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default EmployeePerformance;
