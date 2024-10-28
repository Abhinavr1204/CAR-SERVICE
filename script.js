const BASE_URL = 'http://localhost:3000/api';

// Signup Logic
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          window.location.href = 'login.html'; // Redirect to login after signup
      });
});

// Login Logic
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Login successful!');
              window.location.href = 'service-list.html'; // Redirect to service registration
          } else {
              alert(data.message);
          }
      });
});

// Register Service Logic
document.getElementById('serviceForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const serviceName = document.getElementById('serviceName').value;
    const serviceDescription = document.getElementById('serviceDescription').value;
    const location = document.getElementById('location').value;
    const phone = document.getElementById('phone').value;
    fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: serviceName, description: serviceDescription, location, phone }),
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          window.location.href = 'index.html';
        //   loadServices(); // Refresh the service list
      });
});

// Load services
function loadServices() {
    fetch(`${BASE_URL}/services`)
        .then(response => response.json())
        .then(data => {
            const serviceList = document.getElementById('serviceList');
            serviceList.innerHTML = '';
            data.forEach(service => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `<strong>${service.name}</strong> - ${service.description} <br> 
                                Location: ${service.location} <br>
                                Phone: ${service.phone}`;
                serviceList.appendChild(li);
            });
        });
}

// Execute loadServices function when the service list page is loaded
if (document.getElementById('serviceList')) {
    loadServices();
}

// Search functionality for the service list
document.getElementById('search')?.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const listItems = document.querySelectorAll('#serviceList .list-group-item');
    listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
    });
});

