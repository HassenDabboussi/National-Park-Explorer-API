document.addEventListener('DOMContentLoaded', () => {
    const deleteParkForm = document.getElementById('delete-park-form');
  
    deleteParkForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const parkId = document.getElementById('park-id').value;
  
      if (!confirm(`Are you sure you want to delete park with ID ${parkId}? This action cannot be undone.`)) {
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/parks/${parkId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete park.");
        }
  
        alert('Park deleted successfully!');
        deleteParkForm.reset();
      } catch (error) {
        console.error("Error deleting park:", error);
        alert("Failed to delete park. Please try again.");
      }
    });
  });
  