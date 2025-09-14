import React, { useState } from 'react';
import './SystemSettingsPage.css';

function SystemSettingsPage() {
  const [enableTech, setEnableTech] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would send the settings to the backend
      console.log('Saving settings:', { enable_tech_site_add: enableTech });
      
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
        <h3>Settings</h3>
        <form onSubmit={handleSubmit}>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="enable_tech_site_add"
              checked={enableTech}
              onChange={(e) => setEnableTech(e.target.checked)}
            />
            Allow TECH to add a Site on the map
          </label>
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
