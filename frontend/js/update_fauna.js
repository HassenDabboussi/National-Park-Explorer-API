document.addEventListener('DOMContentLoaded', () => {
    const fetchFaunaForm = document.getElementById('fetch-fauna-form');
    const updateFaunaForm = document.getElementById('update-fauna-form');
  
    fetchFaunaForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const faunaId = document.getElementById('fauna-id').value;
  
      try {
        const response = await fetch(`http://localhost:5000/fauna/${faunaId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch fauna details.");
        }
  
        const fauna = await response.json();
  
        // Populate the update form with fetched fauna details
        document.getElementById('fauna-name').value = fauna.name;
        document.getElementById('fauna-scientific-name').value = fauna.scientific_name || '';
        document.getElementById('fauna-description').value = fauna.description || '';
  
        // Show the update form
        updateFaunaForm.style.display = 'block';
      } catch (error) {
        console.error("Error fetching fauna details:", error);
        alert("Failed to fetch fauna details. Please try again.");
      }
    });
  
    updateFaunaForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const faunaId = document.getElementById('fauna-id').value;
  
      const updatedFaunaData = {
        name: document.getElementById('fauna-name').value,
        scientific_name: document.getElementById('fauna-scientific-name').value,
        description: document.getElementById('fauna-description').value,
      };
  
      try {
        const response = await fetch(`http://localhost:5000/fauna/${faunaId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFaunaData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update fauna.");
        }
  
        alert('Fauna updated successfully!');
        updateFaunaForm.reset();
        updateFaunaForm.style.display = 'none';
        fetchFaunaForm.reset();
      } catch (error) {
        console.error("Error updating fauna:", error);
        alert("Failed to update fauna. Please try again.");
      }
    });
  });
  