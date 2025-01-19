document.addEventListener('DOMContentLoaded', () => {
    const fetchFloraForm = document.getElementById('fetch-flora-form');
    const updateFloraForm = document.getElementById('update-flora-form');
  
    fetchFloraForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const floraId = document.getElementById('flora-id').value;
  
      try {
        const response = await fetch(`http://localhost:5000/flora/${floraId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch flora details.");
        }
  
        const flora = await response.json();
  
        // Populate the update form with fetched flora details
        document.getElementById('flora-name').value = flora.name;
        document.getElementById('flora-scientific-name').value = flora.scientific_name || '';
        document.getElementById('flora-description').value = flora.description || '';
  
        // Show the update form
        updateFloraForm.style.display = 'block';
      } catch (error) {
        console.error("Error fetching flora details:", error);
        alert("Failed to fetch flora details. Please try again.");
      }
    });
  
    updateFloraForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const floraId = document.getElementById('flora-id').value;
  
      const updatedFloraData = {
        name: document.getElementById('flora-name').value,
        scientific_name: document.getElementById('flora-scientific-name').value,
        description: document.getElementById('flora-description').value,
      };
  
      try {
        const response = await fetch(`http://localhost:5000/flora/${floraId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFloraData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update flora.");
        }
  
        alert('Flora updated successfully!');
        updateFloraForm.reset();
        updateFloraForm.style.display = 'none';
        fetchFloraForm.reset();
      } catch (error) {
        console.error("Error updating flora:", error);
        alert("Failed to update flora. Please try again.");
      }
    });
  });
  