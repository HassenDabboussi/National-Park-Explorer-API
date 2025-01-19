document.addEventListener('DOMContentLoaded', () => {
    const fetchActivityForm = document.getElementById('fetch-activity-form');
    const updateActivityForm = document.getElementById('update-activity-form');
  
    fetchActivityForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const activityId = document.getElementById('activity-id').value;
  
      try {
        const response = await fetch(`http://localhost:5000/activities/${activityId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch activity details.");
        }
  
        const activity = await response.json();
  
        // Populate the update form with fetched activity details
        document.getElementById('activity-name').value = activity.name;
        document.getElementById('activity-difficulty').value = activity.difficulty || '';
        document.getElementById('activity-duration').value = activity.duration || '';
        document.getElementById('activity-description').value = activity.description || '';
  
        // Show the update form
        updateActivityForm.style.display = 'block';
      } catch (error) {
        console.error("Error fetching activity details:", error);
        alert("Failed to fetch activity details. Please try again.");
      }
    });
  
    updateActivityForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const activityId = document.getElementById('activity-id').value;
  
      const updatedActivityData = {
        name: document.getElementById('activity-name').value,
        difficulty: document.getElementById('activity-difficulty').value,
        duration: document.getElementById('activity-duration').value,
        description: document.getElementById('activity-description').value,
      };
  
      try {
        const response = await fetch(`http://localhost:5000/activities/${activityId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedActivityData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update activity.");
        }
  
        alert('Activity updated successfully!');
        updateActivityForm.reset();
        updateActivityForm.style.display = 'none';
        fetchActivityForm.reset();
      } catch (error) {
        console.error("Error updating activity:", error);
        alert("Failed to update activity. Please try again.");
      }
    });
  });
  