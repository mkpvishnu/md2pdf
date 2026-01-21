import React, { useState, useRef, useCallback } from 'react';
import { FileDown, AlignCenter, Settings, Eye, Edit3, Type, Palette, Layout, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import html2pdf from 'html2pdf.js';

// Default sample markdown (the resume)
const defaultMarkdown = `# Your Name

**Your Title / Role**

Location | Phone | Email | LinkedIn

*Skills | Technologies | Areas of Expertise*

---

## Professional Experience

### Job Title / Role
**Company Name** | Location | Start Date - End Date

- Describe your key responsibilities and achievements
- Use bullet points for easy reading
- Highlight metrics and impact where possible

---

## Key Projects

### Project Name *(Company, Year)*
Brief description of the project, technologies used, and impact delivered.

---

## Education & Certifications

### Degree Name
*Institution Name* - Graduation Year

### Certifications
- Certification Name (Issuing Organization, Year)
`;

// Line formatting parser
// Syntax: >> at line start = center, {#hex} or {color} at start = color
const parseLineFormatting = (line) => {
  let centered = false;
  let color = null;
  let content = line;

  // Check for center prefix: >>
  if (content.startsWith('&gt;&gt; ') || content.startsWith('&gt;&gt;')) {
    centered = true;
    content = content.replace(/^&gt;&gt;\s*/, '');
  }

  // Check for color prefix: {#hex} or {colorname}
  const colorMatch = content.match(/^\{(#[a-fA-F0-9]{3,6}|[a-zA-Z]+)\}\s*/);
  if (colorMatch) {
    color = colorMatch[1];
    content = content.slice(colorMatch[0].length);
  }

  if (centered || color) {
    const styles = [];
    if (centered) styles.push('text-align: center');
    if (color) styles.push(`color: ${color}`);
    return `<span class="md-line-format" style="${styles.join('; ')}">${content}</span>`;
  }

  return line;
};

// Markdown parser (simple but effective)
const parseMarkdown = (md) => {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="md-hr"/>')
    // Headers with line formatting support
    .replace(/^### (.+)$/gm, (match, content) => `<h3 class="md-h3">${parseLineFormatting(content)}</h3>`)
    .replace(/^## (.+)$/gm, (match, content) => `<h2 class="md-h2">${parseLineFormatting(content)}</h2>`)
    .replace(/^# (.+)$/gm, (match, content) => `<h1 class="md-h1">${parseLineFormatting(content)}</h1>`)
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>')
    // Bullet points with line formatting
    .replace(/^- (.+)$/gm, (match, content) => `<li class="md-li">${parseLineFormatting(content)}</li>`)
    // Wrap consecutive li elements in ul
    .replace(/(<li class="md-li">.*<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>')
    // Paragraphs (lines that aren't already wrapped)
    .split('\n\n')
    .map(block => {
      if (block.trim() &&
          !block.startsWith('<h') &&
          !block.startsWith('<ul') &&
          !block.startsWith('<hr') &&
          !block.startsWith('<li')) {
        // Apply line formatting to each line in the paragraph
        const formattedLines = block.split('\n').map(line => parseLineFormatting(line)).join('<br/>');
        return `<p class="md-p">${formattedLines}</p>`;
      }
      return block;
    })
    .join('\n');

  return html;
};

// Style configuration defaults
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

export default function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [styles, setStyles] = useState(defaultStyles);
  const [showSettings, setShowSettings] = useState(true);
  const [activeTab, setActiveTab] = useState('both'); // 'edit', 'preview', 'both'
  const [isExporting, setIsExporting] = useState(false);
  const [formatColor, setFormatColor] = useState('#0d9488');
  const previewRef = useRef(null);
  const editorRef = useRef(null);

  // Insert formatting at current line
  const insertLineFormat = (prefix) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;

    // Find line start
    let lineStart = text.lastIndexOf('\n', start - 1) + 1;

    // Check if prefix already exists and toggle it off
    const lineEnd = text.indexOf('\n', start);
    const currentLine = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);

    let newText;
    let newCursorPos;

    if (currentLine.startsWith(prefix)) {
      // Remove prefix
      newText = text.slice(0, lineStart) + currentLine.slice(prefix.length) + text.slice(lineEnd === -1 ? text.length : lineEnd);
      newCursorPos = start - prefix.length;
    } else {
      // Add prefix
      newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
      newCursorPos = start + prefix.length;
    }

    setMarkdown(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const applyCenter = () => insertLineFormat('>> ');
  const applyColor = () => insertLineFormat(`{${formatColor}} `);

  // Generate CSS based on style config
  const generatePreviewCSS = useCallback(() => {
    const fontFamilyMap = {
      'sans-serif': "'Helvetica Neue', Helvetica, Arial, sans-serif",
      'serif': "'Times New Roman', Georgia, serif",
      'mono': "'Courier New', monospace"
    };

    return `
      .preview-content {
        font-family: ${fontFamilyMap[styles.fontFamily]};
        font-size: ${styles.fontSize.body}pt;
        line-height: ${styles.lineHeight};
        color: #333;
        padding: ${styles.margins.top}mm ${styles.margins.right}mm ${styles.margins.bottom}mm ${styles.margins.left}mm;
        background: white;
        min-height: 297mm;
        width: 210mm;
        box-sizing: border-box;
      }
      .md-h1 {
        font-size: ${styles.fontSize.h1}pt;
        font-weight: bold;
        color: ${styles.headingColor};
        margin: 0 0 8px 0;
        text-align: ${styles.centerH1 ? 'center' : 'left'};
      }
      .md-h2 {
        font-size: ${styles.fontSize.h2}pt;
        font-weight: bold;
        color: ${styles.headingColor};
        margin: 16px 0 8px 0;
        text-align: ${styles.centerH2 ? 'center' : 'left'};
        border-bottom: 2px solid ${styles.accentColor};
        padding-bottom: 4px;
      }
      .md-h3 {
        font-size: ${styles.fontSize.h3}pt;
        font-weight: bold;
        color: ${styles.accentColor};
        margin: 12px 0 6px 0;
        text-align: ${styles.centerH3 ? 'center' : 'left'};
      }
      .md-p {
        margin: 8px 0;
        text-align: justify;
      }
      .md-h1 + .md-p {
        text-align: ${styles.centerFirstParagraph ? 'center' : 'justify'};
        color: ${styles.accentColor};
        font-style: italic;
      }
      .md-h1 + .md-p + .md-p {
        text-align: center;
        font-size: ${styles.fontSize.body - 1}pt;
        color: #666;
      }
      .md-h1 + .md-p + .md-p + .md-p {
        text-align: center;
        font-style: italic;
        color: #666;
        font-size: ${styles.fontSize.body - 1}pt;
      }
      .md-ul {
        margin: 8px 0;
        padding-left: 20px;
      }
      .md-li {
        margin: 6px 0;
        text-align: justify;
      }
      .md-hr {
        border: none;
        border-top: 1.5px solid ${styles.accentColor};
        margin: 16px 0;
      }
      .md-link {
        color: ${styles.accentColor};
        text-decoration: underline;
      }
      strong {
        font-weight: bold;
      }
      em {
        font-style: italic;
      }
      .md-line-format {
        display: block;
      }
    `;
  }, [styles]);

  // Export to PDF
  const exportToPDF = async () => {
    setIsExporting(true);

    const element = previewRef.current;
    if (!element) {
      setIsExporting(false);
      return;
    }

    const opt = {
      margin: 0, // We handle margins in CSS
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF export error:', err);
      alert('PDF export failed. Try using browser print (Ctrl+P) as fallback.');
    }

    setIsExporting(false);
  };

  // Print as PDF fallback
  const printAsPDF = () => {
    const printWindow = window.open('', '_blank');
    const content = previewRef.current?.innerHTML || '';
    const css = generatePreviewCSS();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Document</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
            ${css}
          </style>
        </head>
        <body>
          <div class="preview-content">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Reset styles
  const resetStyles = () => setStyles(defaultStyles);

  // Update nested style values
  const updateMargin = (side, value) => {
    setStyles(prev => ({
      ...prev,
      margins: { ...prev.margins, [side]: parseInt(value) || 0 }
    }));
  };

  const updateFontSize = (element, value) => {
    setStyles(prev => ({
      ...prev,
      fontSize: { ...prev.fontSize, [element]: parseInt(value) || 11 }
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-teal-400 flex items-center gap-2">
              <FileDown size={20} />
              MD → PDF Converter
            </h1>

            {/* View Toggle */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${activeTab === 'edit' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <Edit3 size={14} /> Edit
              </button>
              <button
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${activeTab === 'both' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <Layout size={14} /> Split
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${activeTab === 'preview' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <Eye size={14} /> Preview
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${showSettings ? 'bg-teal-600' : 'bg-gray-700'} hover:bg-teal-500 transition`}
            >
              <Settings size={16} />
              Settings
              {showSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button
              onClick={printAsPDF}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-2 transition"
            >
              🖨️ Print PDF
            </button>

            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-medium flex items-center gap-2 transition disabled:opacity-50"
            >
              <FileDown size={16} />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-3 p-4 bg-gray-750 rounded-lg border border-gray-600 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Alignment Controls */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-teal-400 flex items-center gap-2">
                <AlignCenter size={14} /> Alignment
              </h3>
              <div className="space-y-1">
                {[
                  { key: 'centerH1', label: 'Center H1' },
                  { key: 'centerH2', label: 'Center H2' },
                  { key: 'centerH3', label: 'Center H3' },
                  { key: 'centerFirstParagraph', label: 'Center Subtitle' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={styles[key]}
                      onChange={(e) => setStyles(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded border-gray-500 text-teal-500 focus:ring-teal-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-teal-400 flex items-center gap-2">
                <Layout size={14} /> Margins (mm)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['top', 'right', 'bottom', 'left'].map(side => (
                  <div key={side} className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 w-10 capitalize">{side}</span>
                    <input
                      type="number"
                      value={styles.margins[side]}
                      onChange={(e) => updateMargin(side, e.target.value)}
                      className="w-14 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                      min="0"
                      max="50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Font Sizes */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-teal-400 flex items-center gap-2">
                <Type size={14} /> Font Sizes (pt)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'body', label: 'Body' },
                  { key: 'h1', label: 'H1' },
                  { key: 'h2', label: 'H2' },
                  { key: 'h3', label: 'H3' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 w-10">{label}</span>
                    <input
                      type="number"
                      value={styles.fontSize[key]}
                      onChange={(e) => updateFontSize(key, e.target.value)}
                      className="w-14 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                      min="8"
                      max="48"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Colors & Font */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-teal-400 flex items-center gap-2">
                <Palette size={14} /> Style
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Font</span>
                  <select
                    value={styles.fontFamily}
                    onChange={(e) => setStyles(prev => ({ ...prev, fontFamily: e.target.value }))}
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    <option value="sans-serif">Sans-serif</option>
                    <option value="serif">Serif</option>
                    <option value="mono">Monospace</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Accent</span>
                  <input
                    type="color"
                    value={styles.accentColor}
                    onChange={(e) => setStyles(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.accentColor}
                    onChange={(e) => setStyles(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Line H.</span>
                  <input
                    type="number"
                    value={styles.lineHeight}
                    onChange={(e) => setStyles(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) || 1.5 }))}
                    className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                    min="1"
                    max="3"
                    step="0.1"
                  />
                </div>
                <button
                  onClick={resetStyles}
                  className="w-full px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center justify-center gap-1"
                >
                  <RotateCcw size={12} /> Reset Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        {(activeTab === 'edit' || activeTab === 'both') && (
          <div className={`${activeTab === 'both' ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-700`}>
            <div className="bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={14} /> Markdown Editor
              </div>
              {/* Format Toolbar */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 mr-2">Line:</span>
                <button
                  onClick={applyCenter}
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1 transition"
                  title="Center current line (>>)"
                >
                  <AlignCenter size={12} /> Center
                </button>
                <div className="flex items-center gap-1 bg-gray-700 rounded px-1">
                  <input
                    type="color"
                    value={formatColor}
                    onChange={(e) => setFormatColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0"
                    title="Pick color"
                  />
                  <button
                    onClick={applyColor}
                    className="px-2 py-1 hover:bg-gray-600 rounded text-xs transition"
                    title="Apply color to current line ({#hex})"
                  >
                    Color
                  </button>
                </div>
              </div>
            </div>
            <textarea
              ref={editorRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder="Type your markdown here..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Panel */}
        {(activeTab === 'preview' || activeTab === 'both') && (
          <div className={`${activeTab === 'both' ? 'w-1/2' : 'w-full'} flex flex-col bg-gray-600 overflow-hidden`}>
            <div className="bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400 border-b border-gray-700 flex items-center gap-2">
              <Eye size={14} /> Live Preview (A4)
            </div>
            <div className="flex-1 overflow-auto p-6 flex justify-center">
              <div className="shadow-2xl">
                <style>{generatePreviewCSS()}</style>
                <div
                  ref={previewRef}
                  className="preview-content"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 text-xs text-gray-500 flex justify-between">
        <span>Characters: {markdown.length} | Lines: {markdown.split('\n').length}</span>
        <span className="text-gray-600">Syntax: {'>> '}center | {'{#hex} '}color</span>
        <span>A4 • {styles.fontFamily} • {styles.fontSize.body}pt</span>
      </div>
    </div>
  );
}
