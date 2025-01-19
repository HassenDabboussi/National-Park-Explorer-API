document.addEventListener('DOMContentLoaded', () => {
    const promoteForm = document.getElementById('promote-form');
    const logoutButton = document.getElementById('logout-btn');
  
    // Handle user promotion
    promoteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const userId = document.getElementById('user-id').value;
  
      try {
        const response = await fetch(`http://localhost:5000/promote`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to promote user.");
        }
  
        alert('User promoted successfully!');
        promoteForm.reset();
      } catch (error) {
        console.error("Error promoting user:", error);
        alert("Failed to promote user. Please try again.");
      }
    });
  
    // Handle logout functionality
    logoutButton.addEventListener('click', async () => {
      try {
        const response = await fetch(`http://localhost:5000/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to log out.");
        }
  
        // Clear the JWT token and redirect to login
        localStorage.removeItem('jwt_token');
        alert('Logged out successfully!');
        window.location.href = 'index.html';
      } catch (error) {
        console.error("Error logging out:", error);
        alert("Failed to log out. Please try again.");
      }
    });
  });
  