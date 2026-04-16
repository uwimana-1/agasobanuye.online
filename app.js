// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page or movie detail page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        initializeHomePage();
    } else if (window.location.pathname.endsWith('movie.html')) {
        initializeMoviePage();
    }
});

// Navigate to movie detail page
function goToMovie(movieId) {
    window.location.href = `movie.html?id=${movieId}`;
}

// Initialize scroll buttons
function initializeScrollButtons() {
    const sections = ['featured-movies', 'popular-movies', 'series-movies'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const leftBtn = document.querySelector(`.scroll-left[onclick*="${sectionId}"]`);
        const rightBtn = document.querySelector(`.scroll-right[onclick*="${sectionId}"]`);
        
        function updateScrollButtons() {
            if (section.scrollLeft <= 0) {
                leftBtn.disabled = true;
            } else {
                leftBtn.disabled = false;
            }
            
            if (section.scrollLeft >= section.scrollWidth - section.clientWidth - 1) {
                rightBtn.disabled = true;
            } else {
                rightBtn.disabled = false;
            }
        }
        
        section.addEventListener('scroll', updateScrollButtons);
        updateScrollButtons(); // Initial state
    });
}

// Render featured movies section
function renderFeaturedMovies() {
    const featuredContainer = document.getElementById('featured-movies');
    const featuredMovies = movies.filter(movie => movie.isFeatured);
    
    if (featuredMovies.length === 0) {
        featuredContainer.innerHTML = '<p class="no-movies">No featured movies available.</p>';
        return;
    }
    
    featuredMovies.forEach(movie => {
        const movieCard = createMovieScrollCard(movie);
        featuredContainer.appendChild(movieCard);
    });
}

// Render popular movies section
function renderPopularMovies() {
    const popularContainer = document.getElementById('popular-movies');
    const popularMovies = movies.filter(movie => movie.isPopular);
    
    if (popularMovies.length === 0) {
        popularContainer.innerHTML = '<p class="no-movies">No popular movies available.</p>';
        return;
    }
    
    popularContainer.innerHTML = popularMovies.map(movie => createMovieCard(movie)).join('');
}

// Render series section
function renderSeries() {
    const seriesContainer = document.getElementById('series-movies');
    const series = movies.filter(movie => movie.type === 'series');
    
    if (series.length === 0) {
        seriesContainer.innerHTML = '<p class="no-movies">No series available.</p>';
        return;
    }
    
    seriesContainer.innerHTML = series.map(movie => createMovieCard(movie)).join('');
}

// Render all movies section
function renderAllMovies() {
    const allMoviesContainer = document.getElementById('all-movies');
    
    if (movies.length === 0) {
        allMoviesContainer.innerHTML = '<p class="no-movies">No movies available.</p>';
        return;
    }
    
    allMoviesContainer.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Search on button click
    searchBtn.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        clearSearch();
        return;
    }
    
    // Search movies by title or interpreter
    const searchResults = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.interpreter.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(searchResults, searchTerm);
}

// Display search results
function displaySearchResults(results, searchTerm) {
    const searchSection = document.getElementById('search-results');
    const searchMoviesContainer = document.getElementById('search-movies');
    
    // Hide all other sections
    document.getElementById('featured').style.display = 'none';
    document.getElementById('popular').style.display = 'none';
    document.getElementById('series').style.display = 'none';
    document.getElementById('movies').style.display = 'none';
    
    // Show search results
    searchSection.style.display = 'block';
    
    if (results.length === 0) {
        searchMoviesContainer.innerHTML = `<p class="no-movies">No movies found for "${searchTerm}"</p>`;
    } else {
        searchMoviesContainer.innerHTML = results.map(movie => createMovieCard(movie)).join('');
    }
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    
    // Hide search results
    document.getElementById('search-results').style.display = 'none';
    
    // Show all sections
    document.getElementById('featured').style.display = 'block';
    document.getElementById('popular').style.display = 'block';
    document.getElementById('series').style.display = 'block';
    document.getElementById('movies').style.display = 'block';
}

// Create movie card HTML
function createMovieCard(movie) {
    return `
        <div class="movie-card" onclick="goToMovie('${movie.id}')">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-card-info">
                <div class="movie-card-title">${movie.title}</div>
                <div class="movie-card-interpreter">${movie.interpreter}</div>
            </div>
        </div>
    `;
}

// Create movie scroll card for horizontal sections
function createMovieScrollCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.cursor = 'pointer';
    card.style.minWidth = '200px';
    
    card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
        <div class="movie-card-info">
            <div class="movie-card-title">${movie.title}</div>
            <div class="movie-card-interpreter">${movie.interpreter}</div>
        </div>
    `;
    
    card.addEventListener('click', () => goToMovie(movie.id));
    return card;
}

// Scroll section function
function scrollSection(sectionId, direction) {
    const section = document.getElementById(sectionId);
    const scrollAmount = 220; // Width of card + gap
    
    if (direction === 'left') {
        section.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        section.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Initialize movie detail page
function initializeMoviePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        showError();
        return;
    }
    
    // Simulate loading
    setTimeout(() => {
        const movie = movies.find(m => m.id === movieId);
        
        if (movie) {
            displayMovieDetails(movie);
        } else {
            showError();
        }
    }, 500);
}

// Initialize home page
function initializeHomePage() {
    renderFeaturedMovies();
    renderPopularMovies();
    renderSeries();
    renderAllMovies();
    
    // Initialize scroll buttons after content is loaded
    setTimeout(initializeScrollButtons, 100);
    
    // Initialize search functionality
    initializeSearch();
}

// Setup movie action buttons
function setupMovieActions(movie) {
    const watchBtn = document.getElementById('watch-btn');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    
    // Watch button
    watchBtn.addEventListener('click', function() {
        // Navigate directly to watch link instead of opening in new tab
        window.location.href = movie.watchLink;
    });
    
    // Download button
    downloadBtn.addEventListener('click', function() {
        window.open(movie.downloadLink, '_blank');
    });
    
    // Share button
    shareBtn.addEventListener('click', function() {
        shareMovie();
    });
}

// Share movie functionality
function shareMovie() {
    const currentUrl = window.location.href;
    
    if (navigator.share) {
        // Use Web Share API if available
        navigator.share({
            title: document.getElementById('movie-title').textContent,
            text: document.getElementById('movie-description').textContent,
            url: currentUrl
        }).catch(err => {
            console.log('Error sharing:', err);
            copyToClipboard(currentUrl);
        });
    } else {
        // Fallback to clipboard
        copyToClipboard(currentUrl);
    }
}

// Copy to clipboard helper function
function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    try {
        textarea.select();
        document.execCommand('copy');
        showNotification('Link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy link. Please copy manually.');
    } finally {
        document.body.removeChild(textarea);
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #4682B4;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Display movie details on the detail page
function displayMovieDetails(movie) {
    // Hide loading and show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('movie-content').style.display = 'block';
    
    // Update page title
    document.getElementById('movie-page-title').textContent = `${movie.title} - Agasobanuye`;
    
    // Fill in movie details
    document.getElementById('movie-title').textContent = movie.title;
    
    // Display genres
    const genreContainer = document.getElementById('movie-genre');
    genreContainer.innerHTML = movie.genre.map(genre => 
        `<span class="genre-tag">${genre}</span>`
    ).join('');
    
    // Setup button actions
    setupMovieActions(movie);
    
    // Load popular movies in detail page
    loadPopularMoviesInDetail();
}

// Load popular movies in detail page
function loadPopularMoviesInDetail() {
    const popularContainer = document.getElementById('detail-popular-movies');
    const popularMovies = movies.filter(movie => movie.isPopular);
    
    if (popularMovies.length === 0) {
        popularContainer.innerHTML = '<p class="no-movies">No popular movies available.</p>';
        return;
    }
    
    popularContainer.innerHTML = popularMovies.map(movie => createMovieCard(movie)).join('');
}

// Show error state
function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-message').style.display = 'block';
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-movies {
        text-align: center;
        color: #888;
        font-style: italic;
        padding: 2rem;
    }
`;
document.head.appendChild(style);

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(20, 20, 20, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
    }
});

// Donation Modal functionality
function initializeDonationModal() {
    const donateBtn = document.getElementById('donate-btn');
    const modal = document.getElementById('donation-modal');
    const closeBtn = document.querySelector('.close-btn');

    if (donateBtn && modal && closeBtn) {
        // Open modal when donate button is clicked
        donateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close modal when close button is clicked
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Close modal when clicking outside the modal content
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        });
    }
}

// Copy to clipboard functionality
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            const copyText = this.querySelector('.copy-text');
            const originalText = copyText.textContent;
            
            // Use the modern Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showCopySuccess(this, copyText, originalText);
                }).catch(() => {
                    fallbackCopy(textToCopy, this, copyText, originalText);
                });
            } else {
                // Fallback for older browsers
                fallbackCopy(textToCopy, this, copyText, originalText);
            }
        });
    });
}

// Fallback copy method
function fallbackCopy(text, button, copyText, originalText) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button, copyText, originalText);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(button, copyText, originalText) {
    button.classList.add('copied');
    copyText.textContent = 'Copied!';
    
    // Reset button after 2 seconds
    setTimeout(() => {
        button.classList.remove('copied');
        copyText.textContent = originalText;
    }, 2000);
}

// Initialize back button
document.addEventListener('DOMContentLoaded', function() {
    initializeDonationModal();
    initializeCopyButtons();
});
