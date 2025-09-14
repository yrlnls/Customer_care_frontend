import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function SystemSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    enableNotifications: true,
    autoSaveInterval: 15
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // TODO: Add API integration
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">System Configuration</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check 
              type="switch"
              label="Maintenance Mode"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
            />
            <Form.Text className="text-muted">
              Enable to restrict access to admin users only
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Auto-Save Interval (minutes)</Form.Label>
            <Form.Select 
              value={settings.autoSaveInterval}
              onChange={(e) => setSettings({...settings, autoSaveInterval: e.target.value})}
            >
              <option>5</option>
              <option>15</option>
              <option>30</option>
              <option>60</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default SystemSettings;
