document.addEventListener('DOMContentLoaded', () => {
    const addFloraForm = document.getElementById('add-flora-form');
  
    addFloraForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const floraData = {
        name: document.getElementById('flora-name').value,
        scientific_name: document.getElementById('flora-scientific-name').value,
        description: document.getElementById('flora-description').value,
      };
  
      try {
        const response = await fetch('http://localhost:5000/flora', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(floraData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add flora.");
        }
  
        alert('Flora added successfully!');
        addFloraForm.reset();
      } catch (error) {
        console.error("Error adding flora:", error);
        alert("Failed to add flora. Please try again.");
      }
    });
  });
  