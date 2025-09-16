import React, { useState } from 'react';
import './SystemSettingsPage.css';

function SystemSettingsPage() {
  const [enableTech, setEnableTech] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would send the settings to the backend
      console.log('Saving settings:', { 
        enable_tech_site_add: enableTech,
        enable_notifications: enableNotifications,
        maintenance_mode: maintenanceMode,
        auto_backup: autoBackup
      });
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        alert('Settings saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsLoading(false);
      alert('Error saving settings. Please try again.');
    }
  };

  return (
    <div className="system-settings-container">
      <div className="card">
        <h3>System Settings</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="maintenance_mode"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
              Enable Maintenance Mode
            </label>
            <small style={{ display: 'block', color: '#666', marginTop: '4px' }}>
              Restricts access to admin users only
            </small>
          </div>
          
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="enable_tech_site_add"
              checked={enableTech}
              onChange={(e) => setEnableTech(e.target.checked)}
            />
            Allow TECH to add a Site on the map
          </label>
          
          <div style={{ marginBottom: '16px' }}>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="enable_notifications"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
              />
              Enable Email Notifications
            </label>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_backup"
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
              />
              Enable Automatic Daily Backups
            </label>
          </div>
          
          <div style={{ marginTop: '8px' }}>
            <button 
              type="submit" 
              className="btn primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SystemSettingsPage;
