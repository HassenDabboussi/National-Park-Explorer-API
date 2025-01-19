document.addEventListener('DOMContentLoaded', async () => {
    const parksList = document.getElementById('parks-list');
    const modal = new bootstrap.Modal(document.getElementById('parkDetailsModal'));
    const logoutBtn = document.getElementById('logout-btn');
  
    let selectedParkId = null;
  
    // Log Out Functionality
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('jwt_token');
      alert('You have been logged out!');
      window.location.href = 'index.html';
    });
  
    // Fetch and Display Parks
    try {
      const response = await fetch('http://localhost:5000/parks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
      });
      const parks = await response.json();
  
      parks.forEach(park => {
        const parkCard = document.createElement('div');
        parkCard.className = 'col-md-4 mb-4';
        parkCard.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${park.name}</h5>
              <p class="card-text">${park.location}</p>
              <button class="btn btn-primary" data-id="${park.id}">View Details</button>
            </div>
          </div>
        `;
        parksList.appendChild(parkCard);
      });
  
      // Add Event Listeners to "View Details" Buttons
      document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
          selectedParkId = e.target.getAttribute('data-id');
          const selectedPark = parks.find(p => p.id == selectedParkId);
          document.getElementById('park-name').textContent = selectedPark.name;
          document.getElementById('park-location').textContent = selectedPark.location;
          document.getElementById('park-size').textContent = selectedPark.size || 'N/A';
          document.getElementById('park-description').textContent = selectedPark.description || 'N/A';
          modal.show();
        });
      });
    } catch (error) {
      console.error('Error fetching parks:', error);
      alert('Failed to load parks. Please try again later.');
    }
  
    // Redirect to Flora and Fauna Pages
    document.getElementById('view-flora').addEventListener('click', () => {
      window.location.href = `flora.html?park_id=${selectedParkId}`;
    });
  
    document.getElementById('view-fauna').addEventListener('click', () => {
      window.location.href = `fauna.html?park_id=${selectedParkId}`;
    });

    document.getElementById('view-activities').addEventListener('click', () => {
        window.location.href = `activities.html?park_id=${selectedParkId}`;
      });
      
  });
  