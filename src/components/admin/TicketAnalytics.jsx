import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Row, Col, Card } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function TicketAnalytics() {
  // Mock data for demonstration
  const statusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tickets by Status',
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tickets by Priority',
        data: [5, 7, 10, 12],
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const resolutionData = {
    labels: ['< 1 day', '1-3 days', '3-7 days', '> 7 days'],
    datasets: [
      {
        label: 'Resolution Times',
        data: [15, 10, 5, 4],
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ticket Analytics',
      },
    },
  };

  const metrics = [
    { title: 'Avg Resolution Time', value: '24h 38m' },
    { title: 'First Response Time', value: '2h 15m' },
    { title: 'Satisfaction Rate', value: '92%' },
  ];

  return (
    <div>
      <Row className="mb-4">
        {metrics.map((metric, index) => (
          <Col md={4} key={index}>
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title>{metric.title}</Card.Title>
                <Card.Text className="h4">{metric.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Status Distribution</Card.Title>
              <Pie data={statusData} options={options} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Priority Distribution</Card.Title>
              <Bar data={priorityData} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Resolution Times</Card.Title>
              <Bar data={resolutionData} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TicketAnalytics;