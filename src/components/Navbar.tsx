import React, { useState } from 'react';
import type { LogoConfig } from '../types';
import { serializeConfig } from '../utils/serialization';
import { 
  Undo2, 
  Redo2, 
  Download, 
  RotateCcw, 
  Copy, 
  Check, 
  X,
  FileCode,
  Image as ImageIcon,
  Share2
} from 'lucide-react';

interface NavbarProps {
  config: LogoConfig;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
  svgRef,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedTextType, setCopiedTextType] = useState<'svg' | 'html' | null>(null);
  const [sharedCopied, setSharedCopied] = useState(false);

  // Helper function to extract self-contained SVG string
  const getSvgString = (): string => {
    if (!svgRef.current) return '';
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgRef.current);
    
    // Clean up internal React IDs or attributes if any
    svgString = svgString.replace(/data-reactroot="[^"]*"/g, '');
    return svgString;
  };

  // Export as SVG file download
  const handleExportSVG = () => {
    const svgString = getSvgString();
    if (!svgString) return;

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${config.companyNameSplit ? config.companyNamePart1.toLowerCase() : config.companyName.toLowerCase()}-logo.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  // Export as PNG file download (scale factor for high resolution)
  const handleExportPNG = (scale = 2) => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgString = getSvgString();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    const width = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value || 600;
    const height = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value || 400;
    
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Transparent background or draw background rect
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.scale(scale, scale);
        context.drawImage(image, 0, 0, width, height);
        
        try {
          const pngURL = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngURL;
          downloadLink.download = `${config.companyNameSplit ? config.companyNamePart1.toLowerCase() : config.companyName.toLowerCase()}-logo.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } catch (err) {
          console.error('Error rasterizing PNG: ', err);
          alert('Could not generate PNG due to browser security restrictions on external font resources. Try downloading SVG.');
        }
      }
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  // Copy SVG XML string to clipboard
  const handleCopySVGCode = async () => {
    const svgString = getSvgString();
    if (!svgString) return;

    try {
      await navigator.clipboard.writeText(svgString);
      setCopiedTextType('svg');
      setTimeout(() => setCopiedTextType(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Generate shareable configuration URL
  const handleShare = async () => {
    const serialized = serializeConfig(config);
    const shareUrl = `${window.location.origin}${window.location.pathname}#share=${serialized}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  // Generate pure HTML/CSS code representation
  const generatePureHtmlCss = (): string => {
    const bgStyle = config.bgGradientType === 'solid' 
      ? `background-color: ${config.bgSolidColor};`
      : `background: ${config.bgGradientType === 'linear' 
          ? `linear-gradient(${config.bgGradientAngle}deg, ${config.bgColorStart} 0%, ${config.bgColorEnd} 100%)` 
          : `radial-gradient(circle, ${config.bgColorStart} 0%, ${config.bgColorEnd} 100%)`
        };`;

    const fontStylePart1 = `font-family: ${config.companyNameFont}; font-weight: ${config.companyNameWeight};`;
    const fontStylePart2 = `font-family: ${config.companyNameFontPart2}; font-weight: ${config.companyNameWeightPart2};`;
    
    const textColorPart1 = config.companyNameGradient 
      ? `background: linear-gradient(to right, ${config.companyNameGradientStart}, ${config.companyNameGradientEnd}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${config.companyNameColor};`;
      
    const textColorPart2 = config.companyNameGradientPart2 
      ? `background: linear-gradient(to right, ${config.companyNameGradientStartPart2}, ${config.companyNameGradientEndPart2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
      : `color: ${config.companyNameColorPart2};`;

    const glowStyle = config.glowAnimation 
      ? `box-shadow: 0 0 20px ${config.shadowColor}; animation: glowing ${config.glowDuration}s ease infinite;` 
      : `box-shadow: ${config.shadowOffsetX}px ${config.shadowOffsetY}px ${config.shadowBlur}px ${config.shadowColor};`;

    const leftBracket = config.bracketsType === 'curly' ? '{' : config.bracketsType === 'square' ? '[' : '&lt;';
    const rightBracket = config.bracketsType === 'curly' ? '}' : config.bracketsType === 'square' ? ']' : '/&gt;';

    // Icon render block inside HTML
    let iconHtml = '';
    if (config.iconShow) {
      if (config.iconName === 'custom' && config.customIconSvg) {
        iconHtml = `<svg class="logo-icon custom-icon" viewBox="${config.customIconViewBox || '0 0 24 24'}">${config.customIconSvg}</svg>`;
      } else {
        // Fallback placeholder with standard Lucide icon name representation
        iconHtml = `<!-- Icon: ${config.iconName} -->
    <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
      }
    }

    // Determine icon layout order based on position settings
    const isIconLeft = config.iconShow && config.iconPosition === 'left';
    const isIconRight = config.iconShow && config.iconPosition === 'right';
    const isIconTop = config.iconShow && config.iconPosition === 'top';
    const isIconBottom = config.iconShow && config.iconPosition === 'bottom';

    return `<!-- Logo HTML -->
<div class="reezma-logo-container">
  <div class="reezma-logo ${isIconTop ? 'layout-top' : ''} ${isIconBottom ? 'layout-bottom' : ''}">
    ${config.binaryShow ? `<span class="binary binary-1">${config.binaryTextLeft}</span>` : ''}
    ${config.circuitShow ? `<div class="circuit-lines pattern-${config.circuitPattern}"></div>` : ''}
    
    ${isIconTop ? iconHtml : ''}
    
    <div class="logo-main-row">
      ${isIconLeft ? iconHtml : ''}
      
      <h1 class="logo-text">
        ${config.bracketsShow ? `<span class="brackets">${leftBracket}</span>` : ''}
        ${config.companyNameSplit ? `
        <span class="company-name-part part-1">${config.companyNamePart1}</span>
        <span class="company-name-part part-2">${config.companyNamePart2}</span>
        ` : `
        <span class="company-name">${config.companyName}</span>
        `}
        ${config.bracketsShow ? `<span class="brackets">${rightBracket}</span>` : ''}
        ${config.cursorShow ? `<span class="cursor"></span>` : ''}
      </h1>
      
      ${isIconRight ? iconHtml : ''}
    </div>
    
    ${isIconBottom ? iconHtml : ''}
    
    ${config.binaryShow ? `<span class="binary binary-2">${config.binaryTextRight}</span>` : ''}
  </div>
  ${config.taglineShow ? `<div class="tagline">${config.tagline}</div>` : ''}
</div>

<!-- Logo CSS -->
<style>
  .reezma-logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .reezma-logo {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: ${config.paddingY}px ${config.paddingX}px;
    border-radius: ${config.borderRadius}px;
    ${bgStyle}
    ${glowStyle}
    transition: all 0.3s ease;
    overflow: hidden;
  }
  .reezma-logo.layout-top { flex-direction: column; }
  .reezma-logo.layout-bottom { flex-direction: column-reverse; }
  
  .logo-main-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .logo-text {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${config.companyNameSize}px;
    letter-spacing: ${config.companyNameLetterSpacing}px;
  }
  ${config.companyNameSplit ? `
  .company-name-part.part-1 {
    ${fontStylePart1}
    ${textColorPart1}
  }
  .company-name-part.part-2 {
    ${fontStylePart2}
    ${textColorPart2}
    margin-left: 2px;
  }
  ` : `
  .company-name {
    ${fontStylePart1}
    ${textColorPart1}
  }
  `}
  .brackets {
    color: ${config.bracketsColor};
  }
  .cursor {
    display: inline-block;
    width: 3px;
    height: ${config.companyNameSize * 0.8}px;
    background-color: ${config.cursorColor};
    margin-left: 5px;
    animation: blink-cursor 1.2s step-end infinite;
  }
  .logo-icon {
    width: ${config.iconSize}px;
    height: ${config.iconSize}px;
    color: ${config.iconColor};
    stroke: ${config.iconColor};
    fill: ${config.iconColor};
    transform: rotate(${config.iconRotation}deg);
    display: block;
    ${config.iconAnimation === 'spin' ? 'animation: spin-slow 8s linear infinite;' : ''}
    ${config.iconAnimation === 'pulse' ? 'animation: pulse-slow 3s ease-in-out infinite;' : ''}
    ${config.iconAnimation === 'float' ? 'animation: float-slow 4s ease-in-out infinite;' : ''}
  }
  .tagline {
    margin-top: 15px;
    font-family: ${config.taglineFont};
    font-size: ${config.taglineSize}px;
    color: ${config.taglineColor};
    letter-spacing: ${config.taglineLetterSpacing}px;
    font-weight: bold;
  }
  .binary {
    position: absolute;
    color: ${config.binaryColor};
    font-family: 'Courier New', monospace;
    font-size: ${config.binarySize}px;
    user-select: none;
  }
  .binary-1 { top: 8px; left: 12px; }
  .binary-2 { bottom: 8px; right: 12px; }
  
  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes glowing {
    0%, 100% { box-shadow: 0 0 15px ${config.shadowColor}; }
    50% { box-shadow: 0 0 25px ${config.shadowColor}; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
</style>`;
  };

  // Copy HTML/CSS code representation
  const handleCopyHTMLCSS = async () => {
    const code = generatePureHtmlCss();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTextType('html');
      setTimeout(() => setCopiedTextType(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-brand">
          <h1>
            <span>&lt;</span>LogoCreator<span>/&gt;</span>
          </h1>
        </div>

        <div className="nav-actions">
          {/* History Controls */}
          <button 
            className="btn-icon" 
            onClick={onUndo} 
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          
          <button 
            className="btn-icon" 
            onClick={onRedo} 
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 size={16} />
          </button>

          <button 
            className="btn-icon" 
            onClick={onReset}
            title="Reset Settings"
          >
            <RotateCcw size={16} />
          </button>

          <div className="toolbar-divider" style={{ height: '24px' }}></div>

          {/* Share Action */}
          <button 
            className="btn-secondary" 
            onClick={handleShare}
            title="Share Design Link"
            style={{ 
              borderColor: sharedCopied ? 'var(--accent-green)' : 'var(--border-light)', 
              color: sharedCopied ? 'var(--accent-green)' : 'inherit',
              padding: '0.5rem 1rem'
            }}
          >
            {sharedCopied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{sharedCopied ? 'Copied!' : 'Share Design'}</span>
          </button>

          {/* Export Action */}
          <button 
            className="btn-primary" 
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download size={16} />
            <span>Export Logo</span>
          </button>
        </div>
      </header>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsExportModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Export Options</h3>
              <button className="btn-icon" onClick={() => setIsExportModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Select a file format to download or copy the logo source directly to integrate into your codebase.
              </p>

              <div className="export-options-grid">
                <div className="export-card" onClick={handleExportSVG}>
                  <FileCode size={36} color="var(--accent-blue)" />
                  <span className="export-card-title">Download SVG</span>
                  <span className="export-card-desc">Lossless vector file. Ideal for web design and scaling.</span>
                </div>

                <div className="export-card" onClick={() => handleExportPNG(2)}>
                  <ImageIcon size={36} color="var(--accent-green)" />
                  <span className="export-card-title">Download PNG</span>
                  <span className="export-card-desc">Raster image. 2x resolution (retina support) with transparency.</span>
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ margin: 0 }}>SVG Markup</label>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={handleCopySVGCode}
                  >
                    {copiedTextType === 'svg' ? (
                      <>
                        <Check size={12} color="var(--accent-green)" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="code-preview-box">
                  {getSvgString()}
                </div>
              </div>

              <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ margin: 0 }}>HTML/CSS Components</label>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={handleCopyHTMLCSS}
                  >
                    {copiedTextType === 'html' ? (
                      <>
                        <Check size={12} color="var(--accent-green)" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy HTML/CSS</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="code-preview-box" style={{ maxHeight: '120px' }}>
                  {generatePureHtmlCss()}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsExportModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
