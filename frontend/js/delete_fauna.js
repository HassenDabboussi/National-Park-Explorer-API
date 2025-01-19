document.addEventListener('DOMContentLoaded', () => {
    const deleteFaunaForm = document.getElementById('delete-fauna-form');
  
    deleteFaunaForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const faunaId = document.getElementById('fauna-id').value;
  
      if (!confirm(`Are you sure you want to delete fauna with ID ${faunaId}? This action cannot be undone.`)) {
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/fauna/${faunaId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete fauna.");
        }
  
        alert('Fauna deleted successfully!');
        deleteFaunaForm.reset();
      } catch (error) {
        console.error("Error deleting fauna:", error);
        alert("Failed to delete fauna. Please try again.");
      }
    });
  });
  