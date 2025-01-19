document.addEventListener('DOMContentLoaded', () => {
    const addFaunaForm = document.getElementById('add-fauna-form');
  
    addFaunaForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const faunaData = {
        name: document.getElementById('fauna-name').value,
        scientific_name: document.getElementById('fauna-scientific-name').value,
        description: document.getElementById('fauna-description').value,
      };
  
      try {
        const response = await fetch('http://localhost:5000/fauna', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(faunaData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add fauna.");
        }
  
        alert('Fauna added successfully!');
        addFaunaForm.reset();
      } catch (error) {
        console.error("Error adding fauna:", error);
        alert("Failed to add fauna. Please try again.");
      }
    });
  });
  