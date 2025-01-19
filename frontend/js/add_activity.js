document.addEventListener('DOMContentLoaded', () => {
    const addActivityForm = document.getElementById('add-activity-form');
  
    addActivityForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const activityData = {
        name: document.getElementById('activity-name').value,
        difficulty: document.getElementById('activity-difficulty').value,
        duration: document.getElementById('activity-duration').value,
        description: document.getElementById('activity-description').value,
        park_id: document.getElementById('park-id').value,
      };
  
      try {
        const response = await fetch('http://localhost:5000/activities', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(activityData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add activity.");
        }
  
        alert('Activity added successfully!');
        addActivityForm.reset();
      } catch (error) {
        console.error("Error adding activity:", error);
        alert("Failed to add activity. Please try again.");
      }
    });
  });
  