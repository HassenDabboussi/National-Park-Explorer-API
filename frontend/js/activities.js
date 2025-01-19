document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const parkId = params.get('park_id');
    const activitiesList = document.getElementById('activities-list');
  
    if (!parkId) {
      alert("Park ID is missing!");
      window.location.href = "user.html";
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/parks/${parkId}/activities`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch activities.");
      }
  
      const activities = await response.json();
      activities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'col-md-4 mb-4';
        activityCard.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${activity.name}</h5>
              <p class="card-text"><strong>Difficulty:</strong> ${activity.difficulty || 'N/A'}</p>
              <p class="card-text"><strong>Duration:</strong> ${activity.duration || 'N/A'}</p>
              <p class="card-text">${activity.description || 'No description available.'}</p>
            </div>
          </div>
        `;
        activitiesList.appendChild(activityCard);
      });
    } catch (error) {
      console.error("Error fetching activities:", error);
      alert("Failed to load activities. Please try again later.");
    }
  });
  