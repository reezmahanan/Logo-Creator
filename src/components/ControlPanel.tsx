import React, { useState } from 'react';
import type { LogoConfig, Preset } from '../types';
import { ICON_MAP } from './LogoCanvas';
import { PRESETS } from '../presets';
import { 
  Palette, 
  Type, 
  Smile, 
  Sliders, 
  Compass, 
  Search,
  Upload,
  Wand2
} from 'lucide-react';

interface ControlPanelProps {
  config: LogoConfig;
  onChange: (updates: Partial<LogoConfig>) => void;
  activePresetId: string | null;
  onSelectPreset: (preset: Preset) => void;
}

type TabType = 'wizard' | 'presets' | 'text' | 'icon' | 'background' | 'deco';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChange,
  activePresetId,
  onSelectPreset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('wizard'); // Default to wizard to encourage engagement
  const [iconSearch, setIconSearch] = useState('');
  const [presetCategory, setPresetCategory] = useState<'all' | 'classic' | 'cyberpunk' | 'corporate' | 'creative'>('all');

  // Stepper Wizard states
  const [wizardStep, setWizardStep] = useState(1);
  const [wizSplit, setWizSplit] = useState(false);
  const [wizCompanyName, setWizCompanyName] = useState('Reezma Tech');
  const [wizPart1, setWizPart1] = useState('Reezma');
  const [wizPart2, setWizPart2] = useState('Tech');
  const [wizTagline, setWizTagline] = useState('INNOVATIVE DESIGN');
  const [wizPersonality, setWizPersonality] = useState<'developer' | 'cyberpunk' | 'minimal' | 'luxury' | 'eco'>('developer');
  const [wizPalette, setWizPalette] = useState<'cyan' | 'gold' | 'green' | 'pink' | 'mono'>('cyan');
  const [wizSymbolGroup, setWizSymbolGroup] = useState<'dev' | 'infra' | 'corporate' | 'creative' | 'none'>('dev');

  // Fonts available
  const FONTS = [
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Fira Code', value: 'Fira Code, monospace' },
    { name: 'Outfit', value: 'Outfit, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Source Code Pro', value: 'Source Code Pro, monospace' },
    { name: 'Orbitron (Sci-Fi)', value: 'Orbitron, sans-serif' },
    { name: 'Syncopate (Wide)', value: 'Syncopate, sans-serif' },
    { name: 'Press Start 2P (8-Bit)', value: '"Press Start 2P", monospace' },
    { name: 'Cinzel (Luxury)', value: 'Cinzel, serif' },
    { name: 'Great Vibes (Script)', value: '"Great Vibes", cursive' },
    { name: 'Bungee (Block)', value: 'Bungee, sans-serif' },
    { name: 'Rubik Mono (Thick)', value: '"Rubik Mono One", monospace' },
    { name: 'Abril Fatface (Heavy)', value: '"Abril Fatface", serif' },
  ];

  const handleInputChange = (key: keyof LogoConfig, value: any) => {
    onChange({ [key]: value });
  };

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        if (!svgElement) {
          alert('Invalid SVG file: No <svg> tag found.');
          return;
        }

        const viewBox = svgElement.getAttribute('viewBox') || '0 0 24 24';
        const innerHTML = svgElement.innerHTML;

        onChange({
          iconName: 'custom',
          customIconSvg: innerHTML,
          customIconViewBox: viewBox,
          iconShow: true
        });
      } catch (err) {
        console.error('Error parsing SVG file:', err);
        alert('Failed to parse SVG file.');
      }
    };
    reader.readAsText(file);
  };

  // Rule-based preference generator
  const handleGenerateLogo = () => {
    const newConfig = { ...config };

    // 1. Text configurations
    newConfig.companyNameSplit = wizSplit;
    newConfig.companyName = wizCompanyName;
    newConfig.companyNamePart1 = wizPart1;
    newConfig.companyNamePart2 = wizPart2;
    newConfig.tagline = wizTagline;
    newConfig.taglineShow = !!wizTagline;

    // 2. Personality Styles & Fonts Mapping
    switch (wizPersonality) {
      case 'developer':
        newConfig.companyNameFont = 'Courier New, monospace';
        newConfig.companyNameFontPart2 = 'Courier New, monospace';
        newConfig.companyNameWeight = 'bold';
        newConfig.companyNameWeightPart2 = 'normal';
        newConfig.bracketsShow = true;
        newConfig.bracketsType = 'angle';
        newConfig.cursorShow = true;
        newConfig.bgShape = 'rectangle';
        newConfig.borderRadius = 8;
        newConfig.circuitShow = true;
        newConfig.circuitPattern = 'circuit';
        newConfig.circuitOpacity = 0.2;
        newConfig.binaryShow = true;
        newConfig.taglineFont = 'Courier New, monospace';
        break;
      case 'cyberpunk':
        newConfig.companyNameFont = 'Orbitron, sans-serif';
        newConfig.companyNameFontPart2 = 'Orbitron, sans-serif';
        newConfig.companyNameWeight = '900';
        newConfig.companyNameWeightPart2 = 'normal';
        newConfig.bracketsShow = true;
        newConfig.bracketsType = 'square';
        newConfig.cursorShow = false;
        newConfig.bgShape = 'rectangle';
        newConfig.borderRadius = 14;
        newConfig.circuitShow = true;
        newConfig.circuitPattern = 'dots';
        newConfig.circuitOpacity = 0.25;
        newConfig.binaryShow = true;
        newConfig.taglineFont = 'Syncopate, sans-serif';
        newConfig.glowAnimation = true;
        newConfig.glowDuration = 2.5;
        break;
      case 'minimal':
        newConfig.companyNameFont = 'Inter, sans-serif';
        newConfig.companyNameFontPart2 = 'Inter, sans-serif';
        newConfig.companyNameWeight = 'bold';
        newConfig.companyNameWeightPart2 = 'bold';
        newConfig.bracketsShow = false;
        newConfig.bracketsType = 'none';
        newConfig.cursorShow = false;
        newConfig.bgShape = 'rectangle';
        newConfig.borderRadius = 6;
        newConfig.circuitShow = false;
        newConfig.binaryShow = false;
        newConfig.taglineFont = 'Inter, sans-serif';
        newConfig.glowAnimation = false;
        break;
      case 'luxury':
        newConfig.companyNameFont = 'Cinzel, serif';
        newConfig.companyNameFontPart2 = 'Inter, sans-serif';
        newConfig.companyNameWeight = '900';
        newConfig.companyNameWeightPart2 = '300';
        newConfig.bracketsShow = false;
        newConfig.bracketsType = 'none';
        newConfig.cursorShow = false;
        newConfig.bgShape = 'rectangle';
        newConfig.borderRadius = 0;
        newConfig.circuitShow = false;
        newConfig.binaryShow = false;
        newConfig.taglineFont = 'Cinzel, serif';
        newConfig.glowAnimation = false;
        break;
      case 'eco':
        newConfig.companyNameFont = 'Outfit, sans-serif';
        newConfig.companyNameFontPart2 = 'Outfit, sans-serif';
        newConfig.companyNameWeight = 'bold';
        newConfig.companyNameWeightPart2 = 'normal';
        newConfig.bracketsShow = true;
        newConfig.bracketsType = 'curly';
        newConfig.cursorShow = true;
        newConfig.bgShape = 'circle';
        newConfig.borderRadius = 40;
        newConfig.circuitShow = true;
        newConfig.circuitPattern = 'dots';
        newConfig.circuitOpacity = 0.15;
        newConfig.binaryShow = false;
        newConfig.taglineFont = 'Outfit, sans-serif';
        break;
    }

    // 3. Color Palettes Mapping
    let colStart = '#ffffff';
    let colEnd = '#03c6fc';
    let bgStart = '#0f172a';
    let bgEnd = '#1e293b';
    let shadow = 'rgba(3, 198, 252, 0.4)';

    switch (wizPalette) {
      case 'cyan':
        colStart = '#03c6fc';
        colEnd = '#a855f7';
        bgStart = '#0b0f19';
        bgEnd = '#131b2e';
        shadow = 'rgba(3, 198, 252, 0.4)';
        break;
      case 'gold':
        colStart = '#dfa735';
        colEnd = '#f8e08f';
        bgStart = '#000000';
        bgEnd = '#1a1a1a';
        shadow = 'rgba(223, 167, 53, 0.3)';
        break;
      case 'green':
        colStart = '#a3e635';
        colEnd = '#10b981';
        bgStart = '#062f21';
        bgEnd = '#021f15';
        shadow = 'rgba(16, 185, 129, 0.35)';
        break;
      case 'pink':
        colStart = '#ff007f';
        colEnd = '#00f0ff';
        bgStart = '#110022';
        bgEnd = '#05000a';
        shadow = 'rgba(255, 0, 127, 0.5)';
        break;
      case 'mono':
        colStart = '#ffffff';
        colEnd = '#94a3b8';
        bgStart = '#0f172a';
        bgEnd = '#1e293b';
        shadow = 'rgba(255, 255, 255, 0.1)';
        break;
    }

    newConfig.companyNameGradient = true;
    newConfig.companyNameGradientStart = colStart;
    newConfig.companyNameGradientEnd = colEnd;
    newConfig.companyNameColor = colStart;

    newConfig.companyNameGradientPart2 = true;
    newConfig.companyNameGradientStartPart2 = colEnd;
    newConfig.companyNameGradientEndPart2 = colStart;
    newConfig.companyNameColorPart2 = colEnd;

    newConfig.bracketsColor = colStart;
    newConfig.cursorColor = colEnd;
    newConfig.taglineColor = colEnd;
    newConfig.iconColor = colStart;
    newConfig.circuitColor = colStart;
    newConfig.binaryColor = `${colStart}33`; // opacity equivalent

    newConfig.bgGradientType = 'linear';
    newConfig.bgGradientAngle = 135;
    newConfig.bgColorStart = bgStart;
    newConfig.bgColorEnd = bgEnd;
    newConfig.shadowColor = shadow;
    newConfig.shadowBlur = 25;
    newConfig.shadowOffsetY = 6;

    if (wizPersonality === 'luxury' || wizPersonality === 'minimal') {
      newConfig.bgShape = 'rectangle';
    }

    // 4. Symbols Mapping
    newConfig.iconShow = wizSymbolGroup !== 'none';
    if (wizSymbolGroup !== 'none') {
      newConfig.iconRotation = 0;
      newConfig.iconSize = 26;
      newConfig.iconPosition = 'left';
      
      switch (wizSymbolGroup) {
        case 'dev':
          newConfig.iconName = 'Terminal';
          break;
        case 'infra':
          newConfig.iconName = 'Cpu';
          break;
        case 'corporate':
          newConfig.iconName = 'Shield';
          break;
        case 'creative':
          newConfig.iconName = 'Zap';
          break;
      }
    }

    // Trigger update
    onChange(newConfig);
    setWizardStep(1);
    setActiveTab('text'); // open Text tab for adjustments
  };

  // Filter icons based on search query
  const filteredIcons = Object.keys(ICON_MAP).filter(name =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="sidebar">
      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'wizard' ? 'active' : ''}`}
          onClick={() => setActiveTab('wizard')}
          style={{ position: 'relative' }}
        >
          <Wand2 size={18} color="var(--accent-purple)" />
          <span style={{ color: 'var(--accent-purple)' }}>Wizard</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
        >
          <Compass size={18} />
          <span>Presets</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <Type size={18} />
          <span>Text</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'icon' ? 'active' : ''}`}
          onClick={() => setActiveTab('icon')}
        >
          <Smile size={18} />
          <span>Icon</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => setActiveTab('background')}
        >
          <Palette size={18} />
          <span>Background</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'deco' ? 'active' : ''}`}
          onClick={() => setActiveTab('deco')}
        >
          <Sliders size={18} />
          <span>Deco & FX</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        
        {/* WIZARD TAB */}
        {activeTab === 'wizard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-purple)' }}>Logo Preference Wizard</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Step {wizardStep} of 4</span>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', gap: '0.25rem', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ flex: 1, background: 'var(--accent-purple)', opacity: wizardStep >= 1 ? 1 : 0.2 }}></div>
              <div style={{ flex: 1, background: 'var(--accent-purple)', opacity: wizardStep >= 2 ? 1 : 0.2 }}></div>
              <div style={{ flex: 1, background: 'var(--accent-purple)', opacity: wizardStep >= 3 ? 1 : 0.2 }}></div>
              <div style={{ flex: 1, background: 'var(--accent-purple)', opacity: wizardStep >= 4 ? 1 : 0.2 }}></div>
            </div>

            {/* STEP 1: BRAND INFO */}
            {wizardStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Let's start with your company brand naming details. You can split it into two parts for a modern look.
                </p>

                <div className="toggle-wrapper" style={{ marginBottom: '0.25rem' }}>
                  <span className="toggle-label">Split Brand Text</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={wizSplit}
                      onChange={(e) => setWizSplit(e.target.checked)}
                    />
                    <span className="slider-toggle"></span>
                  </label>
                </div>

                {!wizSplit ? (
                  <div className="control-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      className="input-text"
                      value={wizCompanyName}
                      onChange={(e) => setWizCompanyName(e.target.value)}
                      placeholder="e.g. Reezma Tech"
                    />
                  </div>
                ) : (
                  <div className="control-row">
                    <div className="control-group">
                      <label>Part 1 (Bold)</label>
                      <input
                        type="text"
                        className="input-text"
                        value={wizPart1}
                        onChange={(e) => setWizPart1(e.target.value)}
                        placeholder="e.g. Reezma"
                      />
                    </div>
                    <div className="control-group">
                      <label>Part 2 (Light)</label>
                      <input
                        type="text"
                        className="input-text"
                        value={wizPart2}
                        onChange={(e) => setWizPart2(e.target.value)}
                        placeholder="e.g. Tech"
                      />
                    </div>
                  </div>
                )}

                <div className="control-group">
                  <label>Tagline / Subtitle</label>
                  <input
                    type="text"
                    className="input-text"
                    value={wizTagline}
                    onChange={(e) => setWizTagline(e.target.value)}
                    placeholder="e.g. INNOVATIVE DESIGN"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PERSONALITY */}
            {wizardStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Select the core design style and personality that represents your brand.
                </p>

                {(
                  [
                    { id: 'developer', name: 'Classic Developer', desc: 'Code bracket highlights, terminal typography, blinking cursors.' },
                    { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Vibrant glowing shadows, tech overlays, futuristic font.' },
                    { id: 'minimal', name: 'Modern Minimal', desc: 'Clean, flat corporate layouts, sans-serif typography.' },
                    { id: 'luxury', name: 'Luxury & Prestige', desc: 'Serif fonts, fine borders, high elegance.' },
                    { id: 'eco', name: 'Eco Tech', desc: 'Organic circular structures, sustainable balanced layouts.' }
                  ] as const
                ).map((style) => (
                  <button
                    key={style.id}
                    className={`preset-card ${wizPersonality === style.id ? 'active' : ''}`}
                    onClick={() => setWizPersonality(style.id)}
                    style={{ padding: '0.75rem' }}
                  >
                    <div className="preset-name" style={{ fontSize: '0.85rem' }}>{style.name}</div>
                    <div className="preset-desc" style={{ fontSize: '0.7rem' }}>{style.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: COLOR PALETTE */}
            {wizardStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Select a color scheme preference that matches your style.
                </p>

                {(
                  [
                    { id: 'cyan', name: 'Electric Cyan', preview: 'linear-gradient(135deg, #03c6fc, #a855f7)', desc: 'Neon cyan mixed with tech purple.' },
                    { id: 'gold', name: 'Gold Rush', preview: 'linear-gradient(135deg, #dfa735, #f8e08f)', desc: 'Rich premium metallic gold tones.' },
                    { id: 'green', name: 'Forest Green', preview: 'linear-gradient(135deg, #a3e635, #10b981)', desc: 'Clean bio-tech and emerald greens.' },
                    { id: 'pink', name: 'Cyber Pink', preview: 'linear-gradient(135deg, #ff007f, #00f0ff)', desc: 'Vaporwave magenta and cyber cyan.' },
                    { id: 'mono', name: 'Classic Mono', preview: 'linear-gradient(135deg, #ffffff, #94a3b8)', desc: 'Stark high-contrast white and dark slate.' }
                  ] as const
                ).map((pal) => (
                  <button
                    key={pal.id}
                    className={`preset-card ${wizPalette === pal.id ? 'active' : ''}`}
                    onClick={() => setWizPalette(pal.id)}
                    style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: pal.preview, flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="preset-name" style={{ fontSize: '0.85rem', margin: 0 }}>{pal.name}</div>
                      <div className="preset-desc" style={{ fontSize: '0.7rem' }}>{pal.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 4: PRIMARY SYMBOL */}
            {wizardStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Choose a vector category to accent your logo.
                </p>

                {(
                  [
                    { id: 'dev', name: 'Developer Symbols', desc: 'Code bracket tags, terminals, command line.' },
                    { id: 'infra', name: 'Infrastructure', desc: 'Hardware CPU chips, computer boards, circuits.' },
                    { id: 'corporate', name: 'Trust & Protection', desc: 'Secure shields, internet globes, network keys.' },
                    { id: 'creative', name: 'Creativity & Energy', desc: 'Lightning zaps, rating stars, eco leaves.' },
                    { id: 'none', name: 'No Symbol', desc: 'Wordmark only. Clean typography-focused logo.' }
                  ] as const
                ).map((sym) => (
                  <button
                    key={sym.id}
                    className={`preset-card ${wizSymbolGroup === sym.id ? 'active' : ''}`}
                    onClick={() => setWizSymbolGroup(sym.id)}
                    style={{ padding: '0.75rem' }}
                  >
                    <div className="preset-name" style={{ fontSize: '0.85rem' }}>{sym.name}</div>
                    <div className="preset-desc" style={{ fontSize: '0.7rem' }}>{sym.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {wizardStep > 1 && (
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.5rem' }}
                  onClick={() => setWizardStep(prev => prev - 1)}
                >
                  Back
                </button>
              )}
              {wizardStep < 4 ? (
                <button
                  className="btn-primary"
                  style={{ flex: 2, padding: '0.5rem', background: 'var(--accent-purple)', boxShadow: '0 4px 10px rgba(168, 85, 247, 0.2)', border: 'none' }}
                  onClick={() => setWizardStep(prev => prev + 1)}
                >
                  Next Step
                </button>
              ) : (
                <button
                  className="btn-primary"
                  style={{ flex: 2, padding: '0.5rem', background: 'linear-gradient(135deg, var(--accent-purple) 0%, #7c3aed 100%)', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.35)', border: 'none' }}
                  onClick={handleGenerateLogo}
                >
                  Generate Logo ✨
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* PRESETS TAB */}
        {activeTab === 'presets' && (
          <>
            <div className="category-tabs" style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.25rem' }}>
              {(['all', 'classic', 'cyberpunk', 'corporate', 'creative'] as const).map((cat) => (
                <button
                  key={cat}
                  className={`btn-secondary ${presetCategory === cat ? 'active' : ''}`}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    background: presetCategory === cat ? 'rgba(3, 198, 252, 0.15)' : 'var(--bg-tertiary)',
                    borderColor: presetCategory === cat ? 'var(--accent-blue)' : 'var(--border-light)',
                    color: presetCategory === cat ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  }}
                  onClick={() => setPresetCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="presets-grid" style={{ marginTop: '0.5rem' }}>
              {PRESETS.filter(p => presetCategory === 'all' || p.category === presetCategory).map((preset) => (
                <button
                  key={preset.id}
                  className={`preset-card ${activePresetId === preset.id ? 'active' : ''}`}
                  onClick={() => onSelectPreset(preset)}
                >
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-desc">{preset.description}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <>
            <div className="toggle-wrapper" style={{ marginBottom: '0.25rem' }}>
              <span className="toggle-label">Split Brand Text</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.companyNameSplit}
                  onChange={(e) => handleInputChange('companyNameSplit', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {!config.companyNameSplit ? (
              <div className="control-group">
                <label>Company Name</label>
                <input
                  type="text"
                  className="input-text"
                  value={config.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
            ) : (
              <div className="control-row">
                <div className="control-group">
                  <label>Brand Text Part 1</label>
                  <input
                    type="text"
                    className="input-text"
                    value={config.companyNamePart1}
                    onChange={(e) => handleInputChange('companyNamePart1', e.target.value)}
                  />
                </div>
                <div className="control-group">
                  <label>Brand Text Part 2</label>
                  <input
                    type="text"
                    className="input-text"
                    value={config.companyNamePart2}
                    onChange={(e) => handleInputChange('companyNamePart2', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="toggle-wrapper">
              <span className="toggle-label">Show Brackets</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.bracketsShow}
                  onChange={(e) => handleInputChange('bracketsShow', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {config.bracketsShow && (
              <div className="control-row">
                <div className="control-group">
                  <label>Bracket Type</label>
                  <select
                    className="select-input"
                    value={config.bracketsType}
                    onChange={(e) => handleInputChange('bracketsType', e.target.value)}
                  >
                    <option value="angle">&lt; angle /&gt;</option>
                    <option value="curly">&#123; curly &#125;</option>
                    <option value="square">[ square ]</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>Bracket Color</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      className="color-input"
                      value={config.bracketsColor}
                      onChange={(e) => handleInputChange('bracketsColor', e.target.value)}
                    />
                    <span className="color-hex-label">{config.bracketsColor}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="control-group">
              <label>{config.companyNameSplit ? "Font Family (Part 1)" : "Font Family"}</label>
              <select
                className="select-input"
                value={config.companyNameFont}
                onChange={(e) => handleInputChange('companyNameFont', e.target.value)}
              >
                {FONTS.map((font) => (
                  <option key={font.name} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {config.companyNameSplit && (
              <div className="control-group">
                <label>Font Family (Part 2)</label>
                <select
                  className="select-input"
                  value={config.companyNameFontPart2}
                  onChange={(e) => handleInputChange('companyNameFontPart2', e.target.value)}
                >
                  {FONTS.map((font) => (
                    <option key={font.name} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="control-row">
              <div className="control-group">
                <label>Font Size</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="16"
                    max="60"
                    value={config.companyNameSize}
                    onChange={(e) => handleInputChange('companyNameSize', parseInt(e.target.value))}
                  />
                  <span className="slider-value">{config.companyNameSize}px</span>
                </div>
              </div>

              <div className="control-group">
                <label>Letter Spacing</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    value={config.companyNameLetterSpacing}
                    onChange={(e) => handleInputChange('companyNameLetterSpacing', parseInt(e.target.value))}
                  />
                  <span className="slider-value">{config.companyNameLetterSpacing}px</span>
                </div>
              </div>
            </div>

            <div className="control-row">
              <div className="control-group">
                <label>{config.companyNameSplit ? "Font Weight (Part 1)" : "Font Weight"}</label>
                <select
                  className="select-input"
                  value={config.companyNameWeight}
                  onChange={(e) => handleInputChange('companyNameWeight', e.target.value)}
                >
                  <option value="normal">Normal (400)</option>
                  <option value="bold">Bold (700)</option>
                  <option value="900">Black (900)</option>
                  <option value="300">Light (300)</option>
                </select>
              </div>
              
              {config.companyNameSplit ? (
                <div className="control-group">
                  <label>Font Weight (Part 2)</label>
                  <select
                    className="select-input"
                    value={config.companyNameWeightPart2}
                    onChange={(e) => handleInputChange('companyNameWeightPart2', e.target.value)}
                  >
                    <option value="normal">Normal (400)</option>
                    <option value="bold">Bold (700)</option>
                    <option value="900">Black (900)</option>
                    <option value="300">Light (300)</option>
                  </select>
                </div>
              ) : (
                <div className="control-group">
                  <label>Cursor Color</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      className="color-input"
                      value={config.cursorColor}
                      onChange={(e) => handleInputChange('cursorColor', e.target.value)}
                      disabled={!config.cursorShow}
                    />
                    <span className="color-hex-label" style={{ opacity: config.cursorShow ? 1 : 0.4 }}>
                      {config.cursorColor}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {config.companyNameSplit && (
              <div className="control-row">
                <div className="control-group">
                  <label>Cursor Color</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      className="color-input"
                      value={config.cursorColor}
                      onChange={(e) => handleInputChange('cursorColor', e.target.value)}
                      disabled={!config.cursorShow}
                    />
                    <span className="color-hex-label" style={{ opacity: config.cursorShow ? 1 : 0.4 }}>
                      {config.cursorColor}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="toggle-wrapper">
              <span className="toggle-label">Blinking Cursor</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.cursorShow}
                  onChange={(e) => handleInputChange('cursorShow', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            {/* COLOR OPTIONS */}
            <div className="toggle-wrapper">
              <span className="toggle-label">{config.companyNameSplit ? "Gradient Color (Part 1)" : "Text Color Gradient"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.companyNameGradient}
                  onChange={(e) => handleInputChange('companyNameGradient', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {config.companyNameGradient ? (
              <div className="control-row">
                <div className="control-group">
                  <label>Gradient Start (Part 1)</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      className="color-input"
                      value={config.companyNameGradientStart}
                      onChange={(e) => handleInputChange('companyNameGradientStart', e.target.value)}
                    />
                    <span className="color-hex-label">{config.companyNameGradientStart}</span>
                  </div>
                </div>
                <div className="control-group">
                  <label>Gradient End (Part 1)</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      className="color-input"
                      value={config.companyNameGradientEnd}
                      onChange={(e) => handleInputChange('companyNameGradientEnd', e.target.value)}
                    />
                    <span className="color-hex-label">{config.companyNameGradientEnd}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="control-group">
                <label>Text Color {config.companyNameSplit && "(Part 1)"}</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    className="color-input"
                    value={config.companyNameColor}
                    onChange={(e) => handleInputChange('companyNameColor', e.target.value)}
                  />
                  <span className="color-hex-label">{config.companyNameColor}</span>
                </div>
              </div>
            )}

            {config.companyNameSplit && (
              <>
                <div className="toggle-wrapper" style={{ marginTop: '0.5rem' }}>
                  <span className="toggle-label">Gradient Color (Part 2)</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={config.companyNameGradientPart2}
                      onChange={(e) => handleInputChange('companyNameGradientPart2', e.target.checked)}
                    />
                    <span className="slider-toggle"></span>
                  </label>
                </div>

                {config.companyNameGradientPart2 ? (
                  <div className="control-row">
                    <div className="control-group">
                      <label>Gradient Start (Part 2)</label>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          className="color-input"
                          value={config.companyNameGradientStartPart2}
                          onChange={(e) => handleInputChange('companyNameGradientStartPart2', e.target.value)}
                        />
                        <span className="color-hex-label">{config.companyNameGradientStartPart2}</span>
                      </div>
                    </div>
                    <div className="control-group">
                      <label>Gradient End (Part 2)</label>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          className="color-input"
                          value={config.companyNameGradientEndPart2}
                          onChange={(e) => handleInputChange('companyNameGradientEndPart2', e.target.value)}
                        />
                        <span className="color-hex-label">{config.companyNameGradientEndPart2}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="control-group">
                    <label>Text Color (Part 2)</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-input"
                        value={config.companyNameColorPart2}
                        onChange={(e) => handleInputChange('companyNameColorPart2', e.target.value)}
                      />
                      <span className="color-hex-label">{config.companyNameColorPart2}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            {/* TAGLINE CONTROLS */}
            <div className="toggle-wrapper">
              <span className="toggle-label">Show Tagline</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.taglineShow}
                  onChange={(e) => handleInputChange('taglineShow', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {config.taglineShow && (
              <>
                <div className="control-group">
                  <label>Tagline Text</label>
                  <input
                    type="text"
                    className="input-text"
                    value={config.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Tagline Font</label>
                  <select
                    className="select-input"
                    value={config.taglineFont}
                    onChange={(e) => handleInputChange('taglineFont', e.target.value)}
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Courier New, monospace">Courier New</option>
                    <option value="Outfit, sans-serif">Outfit</option>
                    <option value="Montserrat, sans-serif">Montserrat</option>
                    <option value="Inter, sans-serif">Inter</option>
                  </select>
                </div>

                <div className="control-row">
                  <div className="control-group">
                    <label>Tagline Size</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="8"
                        max="24"
                        value={config.taglineSize}
                        onChange={(e) => handleInputChange('taglineSize', parseInt(e.target.value))}
                      />
                      <span className="slider-value">{config.taglineSize}px</span>
                    </div>
                  </div>

                  <div className="control-group">
                    <label>Tagline Spacing</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={config.taglineLetterSpacing}
                        onChange={(e) => handleInputChange('taglineLetterSpacing', parseInt(e.target.value))}
                      />
                      <span className="slider-value">{config.taglineLetterSpacing}px</span>
                    </div>
                  </div>
                </div>

                <div className="control-group">
                  <label>Tagline Color</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      className="color-input"
                      value={config.taglineColor}
                      onChange={(e) => handleInputChange('taglineColor', e.target.value)}
                    />
                    <span className="color-hex-label">{config.taglineColor}</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ICON TAB */}
        {activeTab === 'icon' && (
          <>
            <div className="toggle-wrapper">
              <span className="toggle-label">Enable Icon</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.iconShow}
                  onChange={(e) => handleInputChange('iconShow', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {config.iconShow && (
              <>
                <div className="control-group">
                  <label>Icon Source</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <button
                      className={`btn-secondary ${config.iconName !== 'custom' ? 'active' : ''}`}
                      style={{
                        flex: 1,
                        fontSize: '0.8rem',
                        padding: '0.4rem',
                        background: config.iconName !== 'custom' ? 'rgba(3, 198, 252, 0.1)' : 'var(--bg-tertiary)',
                        borderColor: config.iconName !== 'custom' ? 'var(--accent-blue)' : 'var(--border-light)',
                      }}
                      onClick={() => handleInputChange('iconName', 'Terminal')}
                    >
                      Preset Icons
                    </button>
                    <button
                      className={`btn-secondary ${config.iconName === 'custom' ? 'active' : ''}`}
                      style={{
                        flex: 1,
                        fontSize: '0.8rem',
                        padding: '0.4rem',
                        background: config.iconName === 'custom' ? 'rgba(3, 198, 252, 0.1)' : 'var(--bg-tertiary)',
                        borderColor: config.iconName === 'custom' ? 'var(--accent-blue)' : 'var(--border-light)',
                      }}
                      onClick={() => handleInputChange('iconName', 'custom')}
                    >
                      Custom SVG
                    </button>
                  </div>
                </div>

                {config.iconName === 'custom' ? (
                  <div className="control-group" style={{ padding: '1rem', background: 'rgba(11, 15, 25, 0.4)', borderRadius: '6px', border: '1px dashed var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <label style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                      <Upload size={24} color="var(--accent-blue)" />
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.85rem' }}>Upload Brand SVG File</span>
                      <input
                        type="file"
                        accept=".svg"
                        style={{ display: 'none' }}
                        onChange={handleSvgUpload}
                      />
                    </label>
                    {config.customIconSvg ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', textAlign: 'center', marginTop: '0.5rem', fontWeight: 500 }}>
                        ✓ Custom SVG Active ({config.customIconViewBox})
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '0.5rem' }}>
                        Supports custom shapes & vectors. Color controls will apply.
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="control-group">
                      <label>Search Icons</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="input-text icon-search-bar"
                          style={{ width: '100%', paddingLeft: '2.25rem' }}
                          placeholder="Search CPU, terminal, globe..."
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                      </div>
                    </div>

                    <div className="icon-selector-grid">
                      {filteredIcons.map((name) => {
                        const IconElem = ICON_MAP[name];
                        return (
                          <button
                            key={name}
                            title={name}
                            className={`icon-select-btn ${config.iconName === name ? 'active' : ''}`}
                            onClick={() => handleInputChange('iconName', name)}
                          >
                            <IconElem size={20} />
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="control-row" style={{ marginTop: '0.5rem' }}>
                  <div className="control-group">
                    <label>Icon Position</label>
                    <select
                      className="select-input"
                      value={config.iconPosition}
                      onChange={(e) => handleInputChange('iconPosition', e.target.value)}
                    >
                      <option value="left">Left of Text</option>
                      <option value="right">Right of Text</option>
                      <option value="top">Above Text</option>
                      <option value="bottom">Below Text</option>
                    </select>
                  </div>

                  <div className="control-group">
                    <label>Icon Color</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-input"
                        value={config.iconColor}
                        onChange={(e) => handleInputChange('iconColor', e.target.value)}
                      />
                      <span className="color-hex-label">{config.iconColor}</span>
                    </div>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-group">
                    <label>Icon Size</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="16"
                        max="64"
                        value={config.iconSize}
                        onChange={(e) => handleInputChange('iconSize', parseInt(e.target.value))}
                      />
                      <span className="slider-value">{config.iconSize}px</span>
                    </div>
                  </div>

                  <div className="control-group">
                    <label>Icon Rotation</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={config.iconRotation}
                        onChange={(e) => handleInputChange('iconRotation', parseInt(e.target.value))}
                      />
                      <span className="slider-value">{config.iconRotation}°</span>
                    </div>
                  </div>
                </div>

                <div className="control-group">
                  <label>Icon Animation</label>
                  <select
                    className="select-input"
                    value={config.iconAnimation}
                    onChange={(e) => handleInputChange('iconAnimation', e.target.value)}
                  >
                    <option value="none">Static (None)</option>
                    <option value="spin">Spin (Slow)</option>
                    <option value="pulse">Pulse (Breathe)</option>
                    <option value="float">Float (Up & Down)</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {/* BACKGROUND TAB */}
        {activeTab === 'background' && (
          <>
            <div className="control-group">
              <label>Logo Container Shape</label>
              <select
                className="select-input"
                value={config.bgShape}
                onChange={(e) => handleInputChange('bgShape', e.target.value)}
              >
                <option value="rectangle">Rounded Rectangle</option>
                <option value="circle">Circle</option>
                <option value="hexagon">Hexagon</option>
                <option value="shield">Shield</option>
                <option value="triangle">Triangle</option>
                <option value="badge">Bookmark Badge</option>
              </select>
            </div>

            <div className="control-group">
              <label>Background Fill Type</label>
              <select
                className="select-input"
                value={config.bgGradientType}
                onChange={(e) => handleInputChange('bgGradientType', e.target.value)}
              >
                <option value="solid">Solid Color</option>
                <option value="linear">Linear Gradient</option>
                <option value="radial">Radial Gradient</option>
              </select>
            </div>

            {config.bgGradientType === 'solid' ? (
              <div className="control-group">
                <label>Solid Background Color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    className="color-input"
                    value={config.bgSolidColor}
                    onChange={(e) => handleInputChange('bgSolidColor', e.target.value)}
                  />
                  <span className="color-hex-label">{config.bgSolidColor}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="control-row">
                  <div className="control-group">
                    <label>Gradient Start</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-input"
                        value={config.bgColorStart}
                        onChange={(e) => handleInputChange('bgColorStart', e.target.value)}
                      />
                      <span className="color-hex-label">{config.bgColorStart}</span>
                    </div>
                  </div>
                  <div className="control-group">
                    <label>Gradient End</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-input"
                        value={config.bgColorEnd}
                        onChange={(e) => handleInputChange('bgColorEnd', e.target.value)}
                      />
                      <span className="color-hex-label">{config.bgColorEnd}</span>
                    </div>
                  </div>
                </div>

                {config.bgGradientType === 'linear' && (
                  <div className="control-group">
                    <label>Gradient Angle</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={config.bgGradientAngle}
                        onChange={(e) => handleInputChange('bgGradientAngle', parseInt(e.target.value))}
                      />
                      <span className="slider-value">{config.bgGradientAngle}°</span>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="control-row">
              <div className="control-group">
                <label>Horizontal Padding</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="12"
                    max="80"
                    value={config.paddingX}
                    onChange={(e) => handleInputChange('paddingX', parseInt(e.target.value))}
                  />
                  <span className="slider-value">{config.paddingX}px</span>
                </div>
              </div>
              <div className="control-group">
                <label>Vertical Padding</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="8"
                    max="60"
                    value={config.paddingY}
                    onChange={(e) => handleInputChange('paddingY', parseInt(e.target.value))}
                  />
                  <span className="slider-value">{config.paddingY}px</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>Border Radius</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={config.borderRadius}
                  onChange={(e) => handleInputChange('borderRadius', parseInt(e.target.value))}
                />
                <span className="slider-value">{config.borderRadius}px</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            <div className="control-group">
              <label>Shadow & Glow Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  className="color-input"
                  value={config.shadowColor.startsWith('rgba') ? '#03c6fc' : config.shadowColor}
                  onChange={(e) => handleInputChange('shadowColor', e.target.value)}
                />
                <span className="color-hex-label">{config.shadowColor}</span>
              </div>
            </div>

            <div className="control-row">
              <div className="control-group">
                <label>Glow Blur</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={config.shadowBlur}
                    onChange={(e) => handleInputChange('shadowBlur', parseInt(e.target.value))}
                  />
                  <span className="slider-value">{config.shadowBlur}px</span>
                </div>
              </div>

              <div className="control-group">
                <label>Glow Offset Y</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={config.shadowOffsetY}
                    onChange={(e) => handleInputChange('shadowOffsetY', parseInt(e.target.value))}
                  />
                  <span className="slider-value">{config.shadowOffsetY}px</span>
                </div>
              </div>
            </div>

            <div className="toggle-wrapper">
              <span className="toggle-label">Glow Pulse Anim</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.glowAnimation}
                  onChange={(e) => handleInputChange('glowAnimation', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {config.glowAnimation && (
              <div className="control-group">
                <label>Glow Anim Speed</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={config.glowDuration}
                    onChange={(e) => handleInputChange('glowDuration', parseFloat(e.target.value))}
                  />
                  <span className="slider-value">{config.glowDuration}s</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* DECO & FX TAB */}
        {activeTab === 'deco' && (
          <>
            <div className="toggle-wrapper">
              <span className="toggle-label">Circuit Lines Overlay</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.circuitShow}
                  onChange={(e) => handleInputChange('circuitShow', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {config.circuitShow && (
              <>
                <div className="control-group">
                  <label>Pattern Style</label>
                  <select
                    className="select-input"
                    value={config.circuitPattern}
                    onChange={(e) => handleInputChange('circuitPattern', e.target.value)}
                  >
                    <option value="circuit">Classic Circuit</option>
                    <option value="dots">Dots Matrix</option>
                    <option value="grid">Grid Pattern</option>
                  </select>
                </div>

                <div className="control-row">
                  <div className="control-group">
                    <label>Pattern Color</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-input"
                        value={config.circuitColor}
                        onChange={(e) => handleInputChange('circuitColor', e.target.value)}
                      />
                      <span className="color-hex-label">{config.circuitColor}</span>
                    </div>
                  </div>
                  <div className="control-group">
                    <label>Pattern Opacity</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0.05"
                        max="0.8"
                        step="0.05"
                        value={config.circuitOpacity}
                        onChange={(e) => handleInputChange('circuitOpacity', parseFloat(e.target.value))}
                      />
                      <span className="slider-value">{Math.round(config.circuitOpacity * 100)}%</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            <div className="toggle-wrapper">
              <span className="toggle-label">Binary Code Decor</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.binaryShow}
                  onChange={(e) => handleInputChange('binaryShow', e.target.checked)}
                />
                <span className="slider-toggle"></span>
              </label>
            </div>

            {config.binaryShow && (
              <>
                <div className="control-row">
                  <div className="control-group">
                    <label>Top-Left Text</label>
                    <input
                      type="text"
                      className="input-text"
                      maxLength={8}
                      value={config.binaryTextLeft}
                      onChange={(e) => handleInputChange('binaryTextLeft', e.target.value)}
                    />
                  </div>
                  <div className="control-group">
                    <label>Bottom-Right Text</label>
                    <input
                      type="text"
                      className="input-text"
                      maxLength={8}
                      value={config.binaryTextRight}
                      onChange={(e) => handleInputChange('binaryTextRight', e.target.value)}
                    />
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-group">
                    <label>Binary Color</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        className="color-input"
                        value={config.binaryColor.startsWith('rgba') ? '#03c6fc' : config.binaryColor}
                        onChange={(e) => handleInputChange('binaryColor', e.target.value)}
                      />
                      <span className="color-hex-label">{config.binaryColor}</span>
                    </div>
                  </div>
                  <div className="control-group">
                    <label>Binary Text Size</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="8"
                        max="16"
                        value={config.binarySize}
                        onChange={(e) => handleInputChange('binarySize', parseInt(e.target.value))}
                      />
                      <span className="slider-value">{config.binarySize}px</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            <div className="control-group">
              <label>Workspace Canvas Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  className="color-input"
                  value={config.canvasColor}
                  onChange={(e) => handleInputChange('canvasColor', e.target.value)}
                />
                <span className="color-hex-label">{config.canvasColor}</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
