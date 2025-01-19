document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const parkId = params.get('park_id');
    const faunaList = document.getElementById('fauna-list');
  
    if (!parkId) {
      alert("Park ID is missing!");
      window.location.href = "user.html";
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/parks/${parkId}/fauna`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch fauna.");
      }
  
      const fauna = await response.json();
      fauna.forEach(item => {
        const faunaCard = document.createElement('div');
        faunaCard.className = 'col-md-4 mb-4';
        faunaCard.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text"><strong>Scientific Name:</strong> ${item.scientific_name || 'N/A'}</p>
              <p class="card-text">${item.description || 'No description available.'}</p>
            </div>
          </div>
        `;
        faunaList.appendChild(faunaCard);
      });
    } catch (error) {
      console.error("Error fetching fauna:", error);
      alert("Failed to load fauna. Please try again later.");
    }
  });
  