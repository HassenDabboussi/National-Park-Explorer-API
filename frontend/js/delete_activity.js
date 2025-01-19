document.addEventListener('DOMContentLoaded', () => {
    const deleteActivityForm = document.getElementById('delete-activity-form');
  
    deleteActivityForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const activityId = document.getElementById('activity-id').value;
  
      if (!confirm(`Are you sure you want to delete activity with ID ${activityId}? This action cannot be undone.`)) {
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/activities/${activityId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete activity.");
        }
  
        alert('Activity deleted successfully!');
        deleteActivityForm.reset();
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("Failed to delete activity. Please try again.");
      }
    });
  });
  