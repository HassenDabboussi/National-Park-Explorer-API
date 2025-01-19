document.addEventListener('DOMContentLoaded', () => {
    const addParkForm = document.getElementById('add-park-form');
  
    addParkForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const parkData = {
        name: document.getElementById('park-name').value,
        location: document.getElementById('park-location').value,
        size: document.getElementById('park-size').value,
        description: document.getElementById('park-description').value,
        image_url: document.getElementById('park-image-url').value,
      };
  
      try {
        const response = await fetch('http://localhost:5000/parks', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parkData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add park.");
        }
  
        alert('Park added successfully!');
        addParkForm.reset();
      } catch (error) {
        console.error("Error adding park:", error);
        alert("Failed to add park. Please try again.");
      }
    });
  });
  