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
  Search
} from 'lucide-react';

interface ControlPanelProps {
  config: LogoConfig;
  onChange: (updates: Partial<LogoConfig>) => void;
  activePresetId: string | null;
  onSelectPreset: (preset: Preset) => void;
}

type TabType = 'presets' | 'text' | 'icon' | 'background' | 'deco';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChange,
  activePresetId,
  onSelectPreset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const [iconSearch, setIconSearch] = useState('');

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

  // Filter icons based on search query
  const filteredIcons = Object.keys(ICON_MAP).filter(name =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="sidebar">
      {/* Tabs */}
      <div className="tab-bar">
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
        
        {/* PRESETS TAB */}
        {activeTab === 'presets' && (
          <div className="presets-grid">
            {PRESETS.map((preset) => (
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
        )}

        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <>
            <div className="control-group">
              <label>Company Name</label>
              <input
                type="text"
                className="input-text"
                value={config.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>

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
              <label>Font Family</label>
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

            <div className="toggle-wrapper">
              <span className="toggle-label">Text Color Gradient</span>
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
                  <label>Gradient Start</label>
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
                  <label>Gradient End</label>
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
                <label>Text Color</label>
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

            <div className="control-row">
              <div className="control-group">
                <label>Font Weight</label>
                <select
                  className="select-input"
                  value={config.companyNameWeight}
                  onChange={(e) => handleInputChange('companyNameWeight', e.target.value)}
                >
                  <option value="normal">Normal (400)</option>
                  <option value="bold">Bold (700)</option>
                </select>
              </div>
              
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

                <div className="control-row">
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
                  value={config.shadowColor.startsWith('rgba') ? '#03c6fc' : config.shadowColor} // simple hex map for raw picker
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
