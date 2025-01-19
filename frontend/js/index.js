document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
  
        // Save the token in localStorage
        localStorage.setItem('jwt_token', token);
  
        // Decode the token to determine the user's role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;
  
        // Redirect based on the user's role
        if (userRole === 'admin') {
          window.location.href = 'admin.html';
        } else if (userRole === 'user') {
          window.location.href = 'user.html';
        } else {
          alert('Unknown role! Please contact support.');
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.description || 'Login failed.'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
});