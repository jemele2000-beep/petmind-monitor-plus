import React, { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('online');
  const [schedule, setSchedule] = useState({ time: '08:00', amount: '2' });

  useEffect(() => {
    // Load local schedule if available
    const saved = localStorage.getItem('petmind_schedule');
    if (saved) setSchedule(JSON.parse(saved));

    // Check server status
    fetch('/api/checkStatus')
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
        if (data.status === 'outage') {
          triggerNotification();
        }
      })
      .catch(() => setStatus('outage'));
  }, []);

  // Request push notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert("Push notifications enabled successfully!");
        }
      });
    }
  };

  // Trigger push notification on outage
  const triggerNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("Alert: Petlibro Outage Detected!", {
        body: "Petlibro servers are currently offline. Local feeding schedule has been activated.",
        icon: "/favicon.ico"
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('petmind_schedule', JSON.stringify(schedule));
    alert("Feeding schedule saved locally on your device!");
  };

  const isOnline = status === 'online';

  return (
    <div style={{ 
      backgroundColor: '#121218', 
      minHeight: '100vh', 
      padding: '20px', 
      color: '#fff', 
      fontFamily: 'sans-serif',
      direction: 'ltr'
    }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        
        {/* Enable Notifications Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button 
            onClick={requestNotificationPermission}
            style={{ 
              backgroundColor: '#2196F3', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Enable Notifications 🔔
          </button>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>PetMind Monitor 🐾</h2>
        
        {/* Server Status Card */}
        <div style={{ 
          backgroundColor: '#1e1e2d', 
          padding: '16px', 
          borderRadius: '12px', 
          border: `1px solid ${isOnline ? '#28a745' : '#dc3545'}`, 
          marginBottom: '16px' 
        }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Petlibro Smart Feeder</h3>
          <p style={{ margin: 0, color: isOnline ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
            {isOnline ? '🟢 Service Operating Normally' : '🔴 Outage Detected on Servers!'}
          </p>
        </div>

        {/* Local Backup Schedule */}
        <div style={{ backgroundColor: '#1e1e2d', padding: '16px', borderRadius: '12px' }}>
          <h4 style={{ marginTop: 0 }}>Offline Feeding Schedule (Backup)</h4>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Feeding Time:</label>
              <input 
                type="time" 
                value={schedule.time} 
                onChange={e => setSchedule({...schedule, time: e.target.value})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Portion Size (Portions):</label>
              <input 
                type="number" 
                value={schedule.amount} 
                onChange={e => setSchedule({...schedule, amount: e.target.value})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none' }} 
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                padding: '10px', 
                backgroundColor: '#0d6efd', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              Save Schedule Locally
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
