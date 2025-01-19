document.addEventListener('DOMContentLoaded', () => {
    const fetchParkForm = document.getElementById('fetch-park-form');
    const updateParkForm = document.getElementById('update-park-form');
  
    fetchParkForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const parkId = document.getElementById('park-id').value;
  
      try {
        const response = await fetch(`http://localhost:5000/parks/${parkId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch park details.");
        }
  
        const park = await response.json();
  
        // Populate the update form with fetched park details
        document.getElementById('park-name').value = park.name;
        document.getElementById('park-location').value = park.location;
        document.getElementById('park-size').value = park.size || '';
        document.getElementById('park-description').value = park.description || '';
        document.getElementById('park-image-url').value = park.image_url || '';
  
        // Show the update form
        updateParkForm.style.display = 'block';
      } catch (error) {
        console.error("Error fetching park details:", error);
        alert("Failed to fetch park details. Please try again.");
      }
    });
  
    updateParkForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const parkId = document.getElementById('park-id').value;
  
      const updatedParkData = {
        name: document.getElementById('park-name').value,
        location: document.getElementById('park-location').value,
        size: document.getElementById('park-size').value,
        description: document.getElementById('park-description').value,
        image_url: document.getElementById('park-image-url').value,
      };
  
      try {
        const response = await fetch(`http://localhost:5000/parks/${parkId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedParkData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update park.");
        }
  
        alert('Park updated successfully!');
        updateParkForm.reset();
        updateParkForm.style.display = 'none';
        fetchParkForm.reset();
      } catch (error) {
        console.error("Error updating park:", error);
        alert("Failed to update park. Please try again.");
      }
    });
  });
  