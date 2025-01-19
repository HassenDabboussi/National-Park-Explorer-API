document.addEventListener('DOMContentLoaded', () => {
    const deleteFloraForm = document.getElementById('delete-flora-form');
  
    deleteFloraForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const floraId = document.getElementById('flora-id').value;
  
      if (!confirm(`Are you sure you want to delete flora with ID ${floraId}? This action cannot be undone.`)) {
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/flora/${floraId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete flora.");
        }
  
        alert('Flora deleted successfully!');
        deleteFloraForm.reset();
      } catch (error) {
        console.error("Error deleting flora:", error);
        alert("Failed to delete flora. Please try again.");
      }
    });
  });
  