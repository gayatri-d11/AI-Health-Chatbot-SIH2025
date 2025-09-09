// Test backend directly
const http = require('http');

function testAPI(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          console.log(`✅ ${method} ${path}:`, parsed);
          resolve(parsed);
        } catch (e) {
          console.log(`✅ ${method} ${path}:`, body);
          resolve(body);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ ${method} ${path}:`, err.message);
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Testing backend API...\n');
  
  try {
    // Test health endpoint
    await testAPI('/health');
    
    // Test chat with fever
    await testAPI('/api/chat', 'POST', {
      message: 'मुझे बुखार है',
      userId: 'test123',
      language: 'hi'
    });
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
  }
}

runTests();