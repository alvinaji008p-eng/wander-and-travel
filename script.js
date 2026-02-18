// State Management
const state = {
    stories: [],
    reviews: [],
    gallery: []
};

// Initial Mock Data (If LocalStorage is empty)
const mockData = {
    stories: [
        {
            id: 1,
            title: "A Culinary Journey Through Tokyo",
            image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80",
            location: "Tokyo, Japan",
            desc: "From hidden Ramen bars to high-end Sushi Omakase, Tokyo is a foodie's paradise..."
        },
        {
            id: 2,
            title: "Sunset Chasing in Santorini",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80",
            location: "Santorini, Greece",
            desc: "The white-washed buildings against the deep blue Aegean sea create a mesmerizing contrast..."
        },
        {
            id: 3,
            title: "Street Food of Mexico City",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80",
            location: "Mexico City, Mexico",
            desc: "Tacos al pastor, elotes, and churros. Exploring the vibrant street food culture..."
        }
    ],
    reviews: [
        {
            id: 1,
            title: "Sukiyabashi Jiro",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80",
            rating: 5,
            location: "Tokyo, Japan",
            desc: "The best sushi experience of my life. Perfection in every bite."
        },
        {
            id: 2,
            title: "Le Jules Verne",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
            rating: 4.5,
            location: "Paris, France",
            desc: "Dining on the Eiffel Tower is magical, though the price is steep."
        }
    ],
    gallery: [
         { image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80", title: "Swiss Alps" },
         { image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&q=80", title: "French Toast" },
         { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80", title: "Thailand Beach" },
         { image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80", title: "BBQ Night" },
         { image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80", title: "Venice Canals" }
    ]
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderAll();
    setupEventListeners();
});

// Load Data from LocalStorage or use Mock
function loadData() {
    state.stories = JSON.parse(localStorage.getItem('stories')) || mockData.stories;
    state.reviews = JSON.parse(localStorage.getItem('reviews')) || mockData.reviews;
    state.gallery = JSON.parse(localStorage.getItem('gallery')) || mockData.gallery;
}

// Save Data to LocalStorage
function saveData() {
    localStorage.setItem('stories', JSON.stringify(state.stories));
    localStorage.setItem('reviews', JSON.stringify(state.reviews));
    localStorage.setItem('gallery', JSON.stringify(state.gallery));
}

// Navigation Logic
function showSection(sectionId) {
    // Hide all sections, show target
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Update Nav
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    // Find link that corresponds to this section
    const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(l => l.innerText.toLowerCase() === sectionId || (sectionId === 'home' && l.innerText === 'Home'));
    if (activeLink) activeLink.classList.add('active');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal Logic
const modal = document.getElementById('upload-modal');
const form = document.getElementById('upload-form');

function openModal() {
    modal.classList.add('open');
}

function closeModal() {
    modal.classList.remove('open');
    form.reset();
}

window.onclick = function(event) {
    if (event.target == modal) closeModal();
}

function toggleRatingField() {
    const type = document.getElementById('post-type').value;
    const ratingGroup = document.getElementById('rating-group');
    if (type === 'review') {
        ratingGroup.style.display = 'block';
    } else {
        ratingGroup.style.display = 'none';
    }
}

// Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get file and Convert to Data URL
    const fileInput = document.getElementById('post-image');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        const newItem = {
            id: Date.now(),
            title: document.getElementById('post-title').value,
            location: document.getElementById('post-location').value,
            desc: document.getElementById('post-desc').value,
            image: reader.result, // Base64 string
            rating: document.getElementById('post-rating').value
        };

        const type = document.getElementById('post-type').value;

        if (type === 'story') {
            state.stories.unshift(newItem); // Add to beginning
        } else if (type === 'review') {
            state.reviews.unshift(newItem);
        } else if (type === 'photo') {
            state.gallery.unshift(newItem);
        }

        saveData();
        renderAll();
        closeModal();
        
        // Switch to the relevant section
        if(type === 'story') showSection('stories');
        if(type === 'review') showSection('reviews');
        if(type === 'photo') showSection('gallery');
    }

    if (file) {
        reader.readAsDataURL(file);
    }
});

// Rendering Logic
function renderAll() {
    renderStories();
    renderReviews();
    renderGallery();
}

function renderStories() {
    const grid = document.getElementById('stories-grid');
    grid.innerHTML = state.stories.map(story => `
        <div class="card">
            <img src="${story.image}" class="card-img" alt="${story.title}">
            <div class="card-body">
                <span class="card-tag"><i class="fa-solid fa-map-pin"></i> ${story.location}</span>
                <h3 class="card-title">${story.title}</h3>
                <p class="card-text">${story.desc}</p>
                <a href="#" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.5rem 1rem;">Read More</a>
            </div>
        </div>
    `).join('');
}

function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    grid.innerHTML = state.reviews.map(review => `
        <div class="card">
            <img src="${review.image}" class="card-img" alt="${review.title}">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <span class="card-tag">${review.location}</span>
                    <div class="rating">
                        ${renderStars(review.rating)}
                    </div>
                </div>
                <h3 class="card-title">${review.title}</h3>
                <p class="card-text">${review.desc}</p>
            </div>
        </div>
    `).join('');
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = state.gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-overlay">
                <h4 style="color: white;">${item.title}</h4>
                ${item.location ? `<p style="color: #ddd; font-size: 0.8rem;">${item.location}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else if (i - 0.5 === rating) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}

// Event Listeners for existing functionality
function setupEventListeners() {
    // Add logic for dynamic interactions if needed
}
