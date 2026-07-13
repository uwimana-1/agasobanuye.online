// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page or movie detail page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        initializeHomePage();
    } else if (window.location.pathname.endsWith('movie.html')) {
        initializeMoviePage();
    }
});

// Navigate to movie watch/download
function goToMovie(movieId) {
    // Find the movie by ID
    const movie = movies.find(m => m.id === movieId);
    
    if (movie && movie.watchLink) {
        // Open the watch link in a new tab
        window.open(movie.watchLink, '_blank');
    } else {
        // Fallback if no movie or link found
        alert('Watch link not available for this movie.');
    }
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

// Render featured movies section (HOME - Newest movies first)
function renderFeaturedMovies() {
    const featuredContainer = document.getElementById('featured-movies');
    // Show all non-series, non-action movies, sorted by newest first
    const featuredMovies = movies.filter(movie => {
        return movie.type !== 'series' && movie.type !== 'ACTION';
    });
    
    // Sort movies by upload date (newest first)
    featuredMovies.sort((a, b) => {
        // Handle movies without uploadDate (put them at the end)
        if (!a.uploadDate) return 1;
        if (!b.uploadDate) return -1;
        // Sort by date (newest first)
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    });
    
    if (featuredMovies.length === 0) {
        featuredContainer.innerHTML = '<p class="no-movies">No movies available.</p>';
        return;
    }
    
    featuredContainer.innerHTML = '';
    featuredMovies.forEach(movie => {
        const movieCard = createMovieScrollCard(movie);
        featuredContainer.appendChild(movieCard);
    });
}

// Render action movies section
function renderActionMovies() {
    const actionContainer = document.getElementById('action-movies');
    // Show only action movies (type: "ACTION")
    const actionMovies = movies.filter(movie => movie.type === 'ACTION');
    
    if (actionMovies.length === 0) {
        actionContainer.innerHTML = '<p class="no-movies">No action movies available.</p>';
        return;
    }
    
    actionContainer.innerHTML = '';
    actionMovies.forEach(movie => {
        const movieCard = createMovieScrollCard(movie);
        actionContainer.appendChild(movieCard);
    });
}

// Render series section
function renderSeries() {
    const seriesContainer = document.getElementById('series-movies');
    // Show only series movies (type: "series")
    const series = movies.filter(movie => movie.type === 'series');
    
    if (series.length === 0) {
        seriesContainer.innerHTML = '<p class="no-movies">No series available.</p>';
        return;
    }
    
    // Show individual series episodes as separate cards
    seriesContainer.innerHTML = series.map(movie => createMovieCard(movie)).join('');
}

// Ultra-simple search with guaranteed visible buttons
function doSearch() {
    const searchInput = document.getElementById('search-input');
    const term = searchInput.value.toLowerCase().trim();
    
    if (!term) {
        alert('Please enter a search term');
        return;
    }
    
    // Hide all sections
    document.getElementById('featured').style.display = 'none';
    document.getElementById('action').style.display = 'none';
    document.getElementById('series').style.display = 'none';
    
    // Show search results
    const searchSection = document.getElementById('search-results');
    const searchContainer = document.getElementById('search-movies');
    searchSection.style.display = 'block';
    
    // Search movies
    const results = movies.filter(movie => 
        movie.title.toLowerCase().includes(term) || 
        movie.interpreter.toLowerCase().includes(term)
    );
    
    // Create simple HTML with visible buttons
    let html = '';
    results.forEach(movie => {
        html += `
            <div style="background: #1a1a1a; border-radius: 10px; padding: 15px; margin: 10px; border: 1px solid #333;">
                <div style="display: flex; gap: 15px;">
                    <img src="${movie.poster}" style="width: 100px; height: 150px; object-fit: cover; border-radius: 5px;">
                    <div style="flex: 1;">
                        <h3 style="color: white; margin: 0 0 10px 0;">${movie.title}</h3>
                        <p style="color: #ccc; margin: 0 0 15px 0;">${movie.interpreter}</p>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button onclick="window.open('${movie.watchLink}', '_blank')" style="background: #e50914; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                                <i class="fas fa-play"></i> Watch
                            </button>
                            <button onclick="window.open('${movie.downloadLink}', '_blank')" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button onclick="navigator.clipboard.writeText('${movie.watchLink}'); alert('Link copied!')" style="background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                                <i class="fas fa-share"></i> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    searchContainer.innerHTML = html;
}

function clearAll() {
    // Clear search input
    document.getElementById('search-input').value = '';
    
    // Hide search results
    document.getElementById('search-results').style.display = 'none';
    
    // Show all sections
    document.getElementById('featured').style.display = 'block';
    document.getElementById('action').style.display = 'block';
    document.getElementById('series').style.display = 'block';
}

function initializeSearch() {
    console.log('Initializing search functionality...');
    
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    console.log('Search input element:', searchInput);
    console.log('Search button element:', searchBtn);
    
    if (!searchInput || !searchBtn) {
        console.error('Search elements not found!');
        return;
    }
    
    // Simple direct search on button click
    searchBtn.onclick = function() {
        console.log('Search button clicked - direct method');
        window.searchMovies();
    };
    
    // Search on Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            console.log('Enter key pressed - direct method');
            window.searchMovies();
        }
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('Escape key pressed');
            clearSearch();
        }
    });
    
    console.log('Search initialization complete');
}

// Perform search
function performSearch() {
    console.log('Search function called');
    
    try {
        const searchInput = document.getElementById('search-input');
        console.log('Search input found:', searchInput);
        
        if (!searchInput) {
            console.error('Search input not found');
            return;
        }
        
        const searchTerm = searchInput.value.trim().toLowerCase();
        console.log('Search term:', searchTerm);
        
        if (searchTerm === '') {
            console.log('Empty search term, clearing search');
            clearSearch();
            return;
        }
        
        console.log('Total movies available:', movies.length);
        
        // Search movies by title or interpreter
        const searchResults = movies.filter(movie => {
            const titleMatch = movie.title && movie.title.toLowerCase().includes(searchTerm);
            const interpreterMatch = movie.interpreter && movie.interpreter.toLowerCase().includes(searchTerm);
            const genreMatch = movie.genre && movie.genre.some(g => g.toLowerCase().includes(searchTerm));
            
            const found = titleMatch || interpreterMatch || genreMatch;
            if (found) {
                console.log('Found movie:', movie.title, 'Type:', movie.type);
            }
            return found;
        });
        
        console.log('Search results count:', searchResults.length);
        console.log('Search results:', searchResults);
        displaySearchResults(searchResults, searchTerm);
        
    } catch (error) {
        console.error('Search error:', error);
        alert('Search error: ' + error.message);
    }
}

// Display search results
function displaySearchResults(results, searchTerm) {
    console.log('Displaying search results for:', searchTerm);
    
    try {
        const searchSection = document.getElementById('search-results');
        const searchMoviesContainer = document.getElementById('search-movies');
        
        console.log('Search section found:', searchSection);
        console.log('Search container found:', searchMoviesContainer);
        
        if (!searchSection || !searchMoviesContainer) {
            console.error('Search elements not found');
            alert('Search elements not found');
            return;
        }
        
        // Hide all sections
        const featuredSection = document.getElementById('featured');
        const actionSection = document.getElementById('action');
        const seriesSection = document.getElementById('series');
        
        if (featuredSection) featuredSection.style.display = 'none';
        if (actionSection) actionSection.style.display = 'none';
        if (seriesSection) seriesSection.style.display = 'none';
        
        // Show search results
        searchSection.style.display = 'block';
        
        if (results.length === 0) {
            searchMoviesContainer.innerHTML = `<p class="no-movies">No movies found for "${searchTerm}"</p>`;
            console.log('No results found');
        } else {
            console.log('Found', results.length, 'results');
            searchMoviesContainer.innerHTML = '';
            results.forEach(movie => {
                const movieCard = createMovieCard(movie);
                searchMoviesContainer.appendChild(movieCard);
            });
            console.log('Search results displayed');
        }
        
    } catch (error) {
        console.error('Display search results error:', error);
        alert('Error displaying search results: ' + error.message);
    }
}

// Clear search
function clearSearch() {
    console.log('Clearing search');
    
    try {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            console.log('Search input cleared');
        }
        
        // Hide search results
        const searchSection = document.getElementById('search-results');
        if (searchSection) {
            searchSection.style.display = 'none';
            console.log('Search results hidden');
        }
        
        // Show all sections
        const featuredSection = document.getElementById('featured');
        const actionSection = document.getElementById('action');
        const seriesSection = document.getElementById('series');
        
        if (featuredSection) {
            featuredSection.style.display = 'block';
            console.log('Featured section shown');
        }
        if (actionSection) {
            actionSection.style.display = 'block';
            console.log('Action section shown');
        }
        if (seriesSection) {
            seriesSection.style.display = 'block';
            console.log('Series section shown');
        }
        
    } catch (error) {
        console.error('Clear search error:', error);
        alert('Error clearing search: ' + error.message);
    }
}

// Create movie card HTML
function createMovieCard(movie) {
    return `
        <div class="movie-card">
            <div style="position: relative;">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="movie-card-info">
                <div class="movie-card-title">${movie.title}</div>
                <div class="movie-card-interpreter">${movie.interpreter}</div>
                <div class="movie-actions" id="actions-${movie.id}">
                    <button class="watch-btn" onclick="window.open('${movie.watchLink}', '_blank')">
                        <i class="fas fa-play"></i> Watch
                    </button>
                    <button class="download-btn" onclick="window.open('${movie.downloadLink}', '_blank')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="share-btn" onclick="navigator.clipboard.writeText('${movie.watchLink}'); alert('Link copied!')">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create series single post (one poster for entire series)
function createSeriesSinglePost(seriesName, allEpisodes) {
    const card = document.createElement('div');
    card.className = 'series-card';
    card.style.cursor = 'pointer';
    card.style.minWidth = '200px';
    card.style.position = 'relative';
    
    // Use the first episode's poster
    const firstEpisode = allEpisodes[0];
    
    card.innerHTML = `
        <div style="position: relative;">
            <img src="${firstEpisode.poster}" alt="${seriesName}" class="movie-poster" loading="lazy">
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="movie-card-info">
            <div class="movie-card-title">${seriesName}</div>
            <div class="movie-card-interpreter">${firstEpisode.interpreter}</div>
            <div class="episode-count">${allEpisodes.length > 1 ? allEpisodes.length : ''}</div>
            <div class="movie-actions" id="actions-${firstEpisode.id}">
                <button class="watch-btn" onclick="goToMovie('${firstEpisode.id}')">
                    <i class="fas fa-play"></i> Watch
                </button>
                <button class="download-btn" onclick="downloadMovie('${firstEpisode.downloadLink}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="share-btn" onclick="shareMovie('${firstEpisode.id}')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
    
    // Store episodes data for click handler
    card.episodes = allEpisodes;
    card.seriesName = seriesName;
    
    card.addEventListener('click', () => showSeriesAllEpisodes(seriesName, allEpisodes));
    return card;
}

// Create series card that shows all seasons and episodes when clicked
function createSeriesCard(seriesName, allEpisodes) {
    const card = document.createElement('div');
    card.className = 'series-card';
    card.style.cursor = 'pointer';
    card.style.minWidth = '200px';
    card.style.position = 'relative';
    
    // Use the first episode's poster
    const firstEpisode = allEpisodes[0];
    
    // Count total seasons
    const seasons = new Set();
    allEpisodes.forEach(ep => {
        const match = ep.title.match(/S(\d+)E/);
        if (match) seasons.add(match[1]);
    });
    const seasonCount = seasons.size || 1;
    
    card.innerHTML = `
        <img src="${firstEpisode.poster}" alt="${seriesName}" class="movie-poster" loading="lazy">
        <div class="movie-card-info">
            <div class="movie-card-title">${seriesName}</div>
            <div class="series-info">${seasonCount} Season${seasonCount > 1 ? 's' : ''}</div>
            <div class="movie-card-interpreter">${firstEpisode.interpreter}</div>
            <div class="episode-count">${allEpisodes.length > 1 ? allEpisodes.length : ''}</div>
        </div>
    `;
    
    // Store episodes data for click handler
    card.allEpisodes = allEpisodes;
    card.seriesName = seriesName;
    
    card.addEventListener('click', () => showSeriesAllEpisodes(seriesName, allEpisodes));
    return card;
}

// Show all seasons and episodes when series card is clicked
function showSeriesAllEpisodes(seriesName, allEpisodes) {
    const seriesContainer = document.getElementById('series-movies');
    
    // Group episodes by season
    const seasons = {};
    allEpisodes.forEach(ep => {
        let seasonNum = '1';
        const match = ep.title.match(/S(\d+)E/);
        if (match) seasonNum = match[1];
        
        if (!seasons[seasonNum]) {
            seasons[seasonNum] = [];
        }
        seasons[seasonNum].push(ep);
    });
    
    // Create header with back button
    const header = document.createElement('div');
    header.className = 'episodes-header';
    header.innerHTML = `
        <button class="back-to-series-btn" onclick="renderSeries()">
            <i class="fas fa-arrow-left"></i> Back to Series
        </button>
        <h3>${seriesName} - All Seasons & Episodes</h3>
    `;
    
    // Clear container and add header
    seriesContainer.innerHTML = '';
    seriesContainer.appendChild(header);
    
    // Create seasons container
    const seasonsContainer = document.createElement('div');
    seasonsContainer.className = 'seasons-container';
    
    // Add each season with its episodes
    Object.keys(seasons).sort((a, b) => parseInt(a) - parseInt(b)).forEach(seasonNum => {
        const seasonDiv = document.createElement('div');
        seasonDiv.className = 'season-section';
        
        const seasonHeader = document.createElement('h4');
        seasonHeader.className = 'season-header';
        seasonHeader.textContent = `Season ${seasonNum}`;
        seasonDiv.appendChild(seasonHeader);
        
        const episodesGrid = document.createElement('div');
        episodesGrid.className = 'episodes-grid';
        
        seasons[seasonNum].forEach(movie => {
            const episodeCard = createMovieCard(movie);
            episodesGrid.appendChild(episodeCard);
        });
        
        seasonDiv.appendChild(episodesGrid);
        seasonsContainer.appendChild(seasonDiv);
    });
    
    seriesContainer.appendChild(seasonsContainer);
}

// Create series card that shows all episodes when clicked
function createSeriesCard(seriesName, allEpisodes) {
    const card = document.createElement('div');
    card.className = 'series-card';
    card.style.cursor = 'pointer';
    card.style.minWidth = '200px';
    card.style.position = 'relative';
    
    // Use the first episode's poster
    const firstEpisode = allEpisodes[0];
    
    card.innerHTML = `
        <div style="position: relative;">
            <img src="${firstEpisode.poster}" alt="${seriesName}" class="movie-poster" loading="lazy">
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="movie-card-info">
            <div class="movie-card-title">${seriesName}</div>
            <div class="movie-card-interpreter">${firstEpisode.interpreter}</div>
            <div class="episode-count">${allEpisodes.length > 1 ? allEpisodes.length : ''}</div>
        </div>
    `;
    
    // Store episodes data for click handler
    card.episodes = allEpisodes;
    card.seriesName = seriesName;
    
    card.addEventListener('click', () => showSeriesEpisodes(seriesName, allEpisodes));
    return card;
}

// Show series episodes when series card is clicked
function showSeriesEpisodes(seriesName, episodes) {
    const seriesContainer = document.getElementById('series-movies');
    
    // Create header with back button
    const header = document.createElement('div');
    header.className = 'episodes-header';
    header.innerHTML = `
        <button class="back-to-series-btn" onclick="renderSeries()">
            <i class="fas fa-arrow-left"></i> Back to Series
        </button>
        <h3>${seriesName} - All Episodes</h3>
    `;
    
    // Clear container and add header
    seriesContainer.innerHTML = '';
    seriesContainer.appendChild(header);
    
    // Create episodes container
    const episodesContainer = document.createElement('div');
    episodesContainer.className = 'episodes-grid';
    
    // Add all episode cards
    episodes.forEach(movie => {
        const episodeCard = createMovieCard(movie);
        episodesContainer.appendChild(episodeCard);
    });
    
    seriesContainer.appendChild(episodesContainer);
}

// Create movie scroll card for horizontal sections
function createMovieScrollCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.cursor = 'pointer';
    card.style.minWidth = '200px';
    
    card.innerHTML = `
        <div style="position: relative;">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="movie-card-info">
            <div class="movie-card-title">${movie.title}</div>
            <div class="movie-card-interpreter">${movie.interpreter}</div>
            <div class="movie-actions" id="actions-${movie.id}">
                <button class="watch-btn" onclick="goToMovie('${movie.id}')">
                    <i class="fas fa-play"></i> Watch
                </button>
                <button class="download-btn" onclick="downloadMovie('${movie.downloadLink}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="share-btn" onclick="shareMovie('${movie.id}')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
    
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

// Download movie function
function downloadMovie(downloadLink) {
    if (downloadLink) {
        window.open(downloadLink, '_blank');
    } else {
        alert('Download link not available for this movie.');
    }
}

// Show movie actions when mouse enters card
function showMovieActions(movieId) {
    // Hide all other action buttons first
    document.querySelectorAll('.movie-actions').forEach(actions => {
        actions.style.display = 'none';
    });
    
    // Show this movie's action buttons
    const actionsDiv = document.getElementById(`actions-${movieId}`);
    if (actionsDiv) {
        actionsDiv.style.display = 'flex';
    }
}

// Hide movie actions when mouse leaves card
function hideMovieActions(movieId) {
    const actionsDiv = document.getElementById(`actions-${movieId}`);
    if (actionsDiv) {
        actionsDiv.style.display = 'none';
    }
}

// Share movie function
function shareMovie(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
        const shareText = `Check out "${movie.title}" on Agasobanuye! Watch: ${movie.watchLink}`;
        
        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: movie.title,
                text: shareText,
                url: movie.watchLink
            }).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Movie link copied to clipboard!');
            }).catch(() => {
                alert('Share link: ' + movie.watchLink);
            });
        }
    }
}

// Initialize home page
function initializeHomePage() {
    console.log('Initializing home page...');
    console.log('Movies data loaded:', movies.length, 'movies');
    console.log('Sample movie:', movies[0]);
    
    renderFeaturedMovies();
    renderActionMovies();
    renderSeries();
    
    // Initialize scroll buttons after content is loaded
    setTimeout(initializeScrollButtons, 100);
    
    // Initialize search functionality
    initializeSearch();
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
