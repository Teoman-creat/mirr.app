const fs = require('fs');
// Create a 1x1 pixel white jpeg image in base64
const dummyImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHB8fHx8fHx8fHx//wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAXEQEBAQEAAAAAAAAAAAAAAAAAAQMC/8QAFAEQAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBD/9k=';

async function testAI() {
  console.log('Sending request to local API...');
  try {
    const res = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dummyImage, type: 'grooming' })
    });
    
    if (!res.ok) {
      console.error('API Error:', res.status, await res.text());
      return;
    }
    
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testAI();
