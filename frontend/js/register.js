document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
  
      if (response.ok) {
        alert('Registration successful! Redirecting to login page...');
        window.location.href = 'index.html'; // Redirect to login page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.description || 'Registration failed.'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });