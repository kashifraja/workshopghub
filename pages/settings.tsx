import React, { useState } from 'react';
import Layout from '../components/layout';

const Settings: React.FC = () => {
  const [setting1, setSetting1] = useState('');
  const [setting2, setSetting2] = useState(false);

  const handleSave = () => {
    // Logic to save settings
    console.log('Settings saved:', { setting1, setting2 });
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>Configure your settings here.</p>
      <div>
        <label>
          Setting 1:
          <input 
            type="text" 
            value={setting1} 
            onChange={(e) => setSetting1(e.target.value)} 
            className="border p-2"
          />
        </label>
      </div>
      <div>
        <label>
          Setting 2:
          <input 
            type="checkbox" 
            checked={setting2} 
            onChange={(e) => setSetting2(e.target.checked)} 
          />
        </label>
      </div>
      <button onClick={handleSave} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Save Settings
      </button>
    </Layout>
  );
};

export default Settings;
