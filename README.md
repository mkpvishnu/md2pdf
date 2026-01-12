# 📄 Markdown to PDF Converter - Free Online Tool

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Website-blue?style=for-the-badge)](https://mkpvishnu.github.io/md2pdf/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mkpvishnu/md2pdf)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **🌐 [Click Here to Use the App Online →](https://mkpvishnu.github.io/md2pdf/)**

A powerful, **free online Markdown to PDF converter** built with React. Convert your Markdown documents into beautifully formatted, professional-looking PDFs instantly with real-time preview and extensive customization options. No installation required - use it directly in your browser!

## 🎯 Perfect For

- **Resume/CV Creation** - Write your resume in Markdown and export to PDF
- **Documentation** - Convert technical docs to shareable PDFs
- **Reports & Articles** - Create professional reports with custom styling
- **Academic Papers** - Format research documents with precise control
- **Notes & Drafts** - Transform your Markdown notes into printable PDFs
- **Business Documents** - Create invoices, proposals, and presentations

## ✨ Features

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

## 🚀 Try It Now - No Installation Needed!

**Website:** [https://mkpvishnu.github.io/md2pdf/](https://mkpvishnu.github.io/md2pdf/)

Simply open the link above in any modern web browser and start converting Markdown to PDF immediately! The app works completely client-side, so your documents stay private and secure on your device.

### How to Use (3 Simple Steps):

1. **Write or Paste** your Markdown content in the editor
2. **Customize** the styling (fonts, colors, margins, alignment)
3. **Export** your professional PDF with one click

No sign-up, no downloads, 100% free!

## 🌟 Why Choose This Markdown PDF Converter?

- **✅ Completely Free** - No premium plans, no hidden costs, 100% open source
- **🔒 Privacy First** - All conversion happens in your browser, no data sent to servers
- **⚡ Instant Conversion** - Convert Markdown to PDF in seconds with real-time preview
- **🎨 Full Customization** - Control every aspect: fonts, sizes, colors, margins, alignment
- **📱 Works Anywhere** - Responsive design works on desktop, tablet, and mobile browsers
- **💾 No Limits** - Convert unlimited documents of any size
- **🌐 Offline Capable** - Once loaded, works without internet connection
- **📋 Easy Markdown Editing** - Split-screen editor with live preview for best experience

### Popular Use Cases

**Students & Academics:** Convert lecture notes, research papers, and study materials from Markdown to shareable PDFs

**Developers:** Transform README files, technical documentation, and code comments into professional PDFs

**Content Writers:** Export blog drafts, articles, and manuscripts in perfectly formatted PDF documents

**Job Seekers:** Create and update resumes/CVs quickly using simple Markdown syntax

**Business Professionals:** Generate reports, meeting notes, and project documentation with custom branding

## 🛠️ For Developers - Installation & Setup

### Prerequisites

- Node.js 18+ and npm

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/mkpvishnu/md2pdf.git
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

5. Your app will be available at: `https://your-username.github.io/repo-name/`

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

## ❓ Frequently Asked Questions (FAQ)

### Is this Markdown to PDF converter really free?

Yes! This is a completely free, open-source tool with no hidden costs, subscriptions, or premium features. You can use it unlimited times.

### Is my data safe and private?

Absolutely! All Markdown to PDF conversion happens entirely in your browser using JavaScript. No files or content are uploaded to any server. Your documents remain 100% private on your device.

### What Markdown syntax is supported?

The converter supports standard Markdown including headings, bold, italic, links, bullet lists, and horizontal rules. See the "Supported Markdown Syntax" section for details.

### Can I use this for commercial purposes?

Yes! This project is MIT licensed, so you can use it freely for personal, academic, or commercial projects.

### Does it work offline?

Once the app is loaded in your browser, it can work without an internet connection. The conversion process doesn't require any server communication.

### What browsers are supported?

All modern browsers including Chrome, Firefox, Safari, Edge, and Opera. The app is responsive and works on desktop, tablet, and mobile devices.

### Can I customize the PDF styling?

Yes! You have full control over fonts, font sizes, margins, colors, line height, and text alignment. You can save your custom styles as defaults.

### What's the maximum document size?

There are no artificial limits. The app can handle documents of any size, limited only by your browser's memory capacity.

## 🔍 Keywords & Tags

`markdown to pdf`, `convert markdown to pdf`, `markdown converter`, `pdf generator`, `online markdown editor`, `free pdf converter`, `markdown preview`, `md to pdf`, `document converter`, `resume builder`, `cv generator`, `react markdown editor`, `web-based pdf converter`, `markdown formatter`, `export markdown`, `print markdown`, `markdown documentation tool`

## Acknowledgments

- Built with ❤️ using React and Vite
- PDF generation powered by html2pdf.js
- Icons from Lucide React
- Made with passion for the open-source community

---

**⭐ If you find this tool useful, please star the repository on GitHub!**

**🌐 Start Converting: [https://mkpvishnu.github.io/md2pdf/](https://mkpvishnu.github.io/md2pdf/)**
