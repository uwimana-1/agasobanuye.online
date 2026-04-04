# Agasobanuye - Movie Streaming Website

A modern, responsive movie streaming website built with vanilla HTML, CSS, and JavaScript.

## 🚀 Quick Start

1. **Open the website**: Simply open `index.html` in your web browser
2. **Add your movies**: Place movie poster images in the `images/` folder
3. **Customize content**: Edit `movies.js` to add your own movie data

## 📁 Project Structure

```
555/
├── index.html          # Home page with movie sections
├── movie.html          # Movie detail page
├── styles.css          # All styling and responsive design
├── app.js              # Main application logic
├── movies.js           # Movie data source
├── images/             # Movie poster images
│   ├── README.md       # Images folder instructions
│   └── [your-posters]  # Add your movie posters here
└── README.md           # This file
```

## 🎬 How to Add Movies

### Step 1: Add Poster Images
1. Place movie poster images in the `images/` folder
2. Recommended size: 300x450 pixels
3. Supported formats: JPG, PNG, WebP
4. Use descriptive names (e.g., `inception.jpg`, `darkknight.jpg`)

### Step 2: Update Movie Data
Edit `movies.js` to add your movie information:

```javascript
{
  id: "unique-id",
  title: "Movie Title",
  type: "movie",           // or "series"
  isFeatured: true,         // Show in featured section
  isPopular: true,          // Show in popular section
  poster: "images/poster.jpg",
  description: "Movie description",
  year: 2024,
  interpreter: "Director Name",
  genre: ["Action", "Drama"],
  watchLink: "https://example.com/watch/movie",
  downloadLink: "https://example.com/download/movie"
}
```

### Step 3: Movie Fields Explained

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier (string) |
| `title` | ✅ | Movie title (string) |
| `type` | ✅ | "movie" or "series" |
| `isFeatured` | ✅ | Show in featured section (boolean) |
| `isPopular` | ✅ | Show in popular section (boolean) |
| `poster` | ✅ | Path to poster image (string) |
| `description` | ✅ | Movie description (string) |
| `year` | ✅ | Release year (number) |
| `interpreter` | ✅ | Director/Creator name (string) |
| `genre` | ✅ | Array of genres (string[]) |
| `watchLink` | ✅ | Streaming URL (string) |
| `downloadLink` | ✅ | Download URL (string) |

## 🎯 Website Sections

### Home Page (`index.html`)
- **Featured Movies**: Highlighted movies (isFeatured: true)
- **Popular Movies**: Popular content (isPopular: true)
- **TV Series**: All series content (type: "series")
- **All Movies**: Complete movie library

### Movie Detail Page (`movie.html`)
- Movie title and genres
- Watch, Download, and Share buttons
- Popular movies carousel

## 🎨 Customization

### Colors
Edit `styles.css` to change the theme:
- Primary red: `#e50914`
- Background dark: `#141414`
- Text white: `#ffffff`

### Layout
- Card sizes: Modify `.movie-card` width/height
- Grid spacing: Adjust `gap` values in `.movies-grid`
- Responsive breakpoints: Edit media queries at the bottom

## 📱 Features

### ✅ Implemented
- Responsive design (mobile + desktop)
- Horizontal scrolling with arrow controls
- Movie cards with interpreter names
- Dark Netflix-style theme
- Smooth animations and hover effects
- Share functionality (copy link to clipboard)
- Loading states and error handling

### 🔄 User Flow
1. **Browse**: Scroll through movie sections
2. **Click**: Tap any movie card to view details
3. **Watch/Download**: Use action buttons on detail page
4. **Share**: Copy movie link to share with others

## 🛠️ Technical Details

### No Backend Required
- All data stored locally in `movies.js`
- No server setup needed
- Works offline once loaded

### Vanilla JavaScript
- No frameworks required
- Modern ES6+ features
- Clean, modular code structure

### Responsive CSS
- Mobile-first approach
- Flexbox and Grid layouts
- Smooth animations

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 Tips

1. **Image Optimization**: Compress posters for faster loading
2. **Consistent Naming**: Use lowercase, no spaces in filenames
3. **Regular Updates**: Keep movie data current
4. **Testing**: Test on different screen sizes

## 🚀 Deployment

### Local Testing
```bash
# Simply open in browser
open index.html
```

### Web Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then visit http://localhost:8000
```

### Static Hosting
Deploy to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## 🤝 Contributing

1. Add your movies to `movies.js`
2. Add posters to `images/`
3. Test functionality
4. Share your improvements!

## 📞 Support

For issues or questions:
1. Check this README first
2. Verify image paths in `movies.js`
3. Test in different browsers
4. Check browser console for errors

---

**Enjoy your movie streaming website! 🎬✨**
