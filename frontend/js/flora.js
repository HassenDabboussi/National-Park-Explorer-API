document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const parkId = params.get('park_id');
    const floraList = document.getElementById('flora-list');
  
    if (!parkId) {
      alert("Park ID is missing!");
      window.location.href = "user.html";
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/parks/${parkId}/flora`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch flora.");
      }
  
      const flora = await response.json();
      flora.forEach(item => {
        const floraCard = document.createElement('div');
        floraCard.className = 'col-md-4 mb-4';
        floraCard.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text"><strong>Scientific Name:</strong> ${item.scientific_name || 'N/A'}</p>
              <p class="card-text">${item.description || 'No description available.'}</p>
            </div>
          </div>
        `;
        floraList.appendChild(floraCard);
      });
    } catch (error) {
      console.error("Error fetching flora:", error);
      alert("Failed to load flora. Please try again later.");
    }
  });
  