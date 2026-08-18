import React, { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('online');
  const [schedule, setSchedule] = useState({ time: '08:00', amount: '2' });

  useEffect(() => {
    const saved = localStorage.getItem('petmind_schedule');
    if (saved) setSchedule(JSON.parse(saved));

    fetch('/api/checkStatus')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('outage'));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('petmind_schedule', JSON.stringify(schedule));
    alert('تم حفظ جدول الإطعام محلياً على هاتفك!');
  };

  const isOnline = status === 'online';

  return (
    
      
        PetMind Monitor 🐾
        
        
          مُطعم Petlibro الذكي
          
            {isOnline ? '🟢 الخدمة تعمل بشكل طبيعي' : '🔴 انقطاع في خوادم الخدمة!'}
          
        

        
          جدول الإطعام الاحتياطي (Offline Mode)
          
            
              الوقت:
               setSchedule({...schedule, time: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none' }} />
            
            
              الكمية (حصص):
               setSchedule({...schedule, amount: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none' }} />
            
            
              حفظ الجدول محلياً
            
          
        
      
    
  );
}
