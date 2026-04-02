// StreamHD integration
const playButtons = document.querySelectorAll('.play-btn');
const modal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.querySelector('.close');

playButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const streamUrl = this.getAttribute('data-stream');
        videoPlayer.src = streamUrl;  // Direct StreamHD player URL
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    videoPlayer.src = '';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        videoPlayer.src = '';
        document.body.style.overflow = 'auto';
    }
});