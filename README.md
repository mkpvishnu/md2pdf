# MD to PDF Converter

A modern, feature-rich Markdown to PDF converter built with React. Convert your Markdown documents into beautifully formatted PDFs with live preview and extensive customization options.

## Features

- **Live Preview**: See your changes in real-time with split-view editor
- **PDF Export**: Export to PDF with one click using html2pdf.js
- **Print Support**: Fallback print-to-PDF option for maximum compatibility
- **Customizable Styling**:
  - Adjustable margins, font sizes, and line heights
  - Multiple font families (Sans-serif, Serif, Monospace)
  - Custom accent colors
  - Flexible text alignment options
- **Three View Modes**: Edit-only, Preview-only, or Split view
- **A4 Format**: Standard A4 page formatting for professional documents
- **Dark Theme UI**: Easy on the eyes with modern dark interface

## Demo

Visit the live demo: [https://YOUR-USERNAME.github.io/md2pdf/](https://YOUR-USERNAME.github.io/md2pdf/)

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/md2pdf.git
   cd md2pdf
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to **Pages** (under "Code and automation")
   - Under "Build and deployment":
     - Source: Select **GitHub Actions**

2. **Update the base URL**:
   - Open `vite.config.js`
   - Change `base: '/md2pdf/'` to match your repository name
   - If your repo is named differently, update accordingly

3. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. The GitHub Action will automatically build and deploy your app

5. Your app will be available at: `https://YOUR-USERNAME.github.io/REPO-NAME/`

### Manual Deployment

If you prefer manual deployment:

```bash
npm run build
npm run deploy
```

## Usage

1. **Write Markdown**: Type or paste your Markdown content in the editor
2. **Customize**: Use the settings panel to adjust styling:
   - Toggle alignment for headings
   - Adjust page margins
   - Change font sizes
   - Select font family
   - Pick accent colors
   - Modify line height
3. **Preview**: See live preview in A4 format
4. **Export**: Click "Export PDF" to download your document

### Supported Markdown Syntax

- Headings: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`
- Lists: `- item`
- Horizontal rules: `---`

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **html2pdf.js** - PDF generation
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD

## Project Structure

```
md2pdf/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment workflow
├── src/
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles + Tailwind
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## Configuration

### Changing the Repository Name

If you rename your repository, update the `base` path in `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-new-repo-name/',
  // ...
})
```

### Customizing Default Styles

Edit the `defaultStyles` object in `src/App.jsx`:

```javascript
const defaultStyles = {
  centerH1: true,
  centerH2: false,
  centerH3: false,
  centerFirstParagraph: true,
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  fontSize: { body: 11, h1: 24, h2: 14, h3: 12 },
  fontFamily: 'sans-serif',
  headingColor: '#1a1a1a',
  accentColor: '#0d9488',
  lineHeight: 1.5,
};
```

## Troubleshooting

### PDF Export Not Working

If PDF export fails, try:
1. Use the "Print PDF" button as a fallback
2. Use your browser's print function (Ctrl/Cmd + P) and save as PDF
3. Check browser console for errors

### App Not Loading on GitHub Pages

1. Verify GitHub Pages is enabled in repository settings
2. Check that the `base` path in `vite.config.js` matches your repo name
3. Ensure GitHub Actions workflow completed successfully
4. Wait a few minutes after deployment for DNS propagation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with ❤️ using React and Vite
- PDF generation powered by html2pdf.js
- Icons from Lucide React
