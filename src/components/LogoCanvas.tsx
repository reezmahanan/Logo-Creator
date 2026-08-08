import React, { useRef } from 'react';
import type { LogoConfig } from '../types';
import * as Lucide from 'lucide-react';

// Map of available icons
export const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Terminal: Lucide.Terminal,
  Cpu: Lucide.Cpu,
  Code: Lucide.Code,
  Globe: Lucide.Globe,
  Layers: Lucide.Layers,
  Activity: Lucide.Activity,
  Shield: Lucide.Shield,
  Database: Lucide.Database,
  Cloud: Lucide.Cloud,
  Settings: Lucide.Settings,
  Key: Lucide.Key,
  Leaf: Lucide.Leaf,
  Radio: Lucide.Radio,
  Tv: Lucide.Tv,
  Hash: Lucide.Hash,
  Heart: Lucide.Heart,
  Smile: Lucide.Smile,
  Star: Lucide.Star,
  Sun: Lucide.Sun,
  Moon: Lucide.Moon,
  Workflow: Lucide.Workflow,
  Compass: Lucide.Compass,
  Binary: Lucide.Binary,
  Command: Lucide.Command,
  Box: Lucide.Box,
  GitBranch: Lucide.GitBranch,
  Link2: Lucide.Link2,
  Lock: Lucide.Lock,
  Monitor: Lucide.Monitor,
  Power: Lucide.Power,
  Server: Lucide.Server,
  Wifi: Lucide.Wifi,
  Zap: Lucide.Zap,
};

interface LogoCanvasProps {
  config: LogoConfig;
  showGrid: boolean;
  zoom: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const LogoCanvas: React.FC<LogoCanvasProps> = ({
  config,
  showGrid,
  zoom,
  svgRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-calculate dimensions of the Logo Box
  const companyNameText = config.companyNameSplit
    ? `${config.companyNamePart1}${config.companyNamePart2}`
    : config.companyName;
  const charWidth = config.companyNameSize * 0.58; // Approximation based on font size
  const textLength = companyNameText.length * charWidth;
  const bracketsWidth = config.bracketsShow
    ? config.bracketsType === 'angle'
      ? config.companyNameSize * 1.5 // < and />
      : config.companyNameSize * 1.1 // { and } or [ and ]
    : 0;
  
  const iconSpacing = config.iconShow ? config.iconSize + 12 : 0;
  
  // Calculate width
  let contentWidth = textLength + bracketsWidth;
  if (config.iconShow && (config.iconPosition === 'left' || config.iconPosition === 'right')) {
    contentWidth += iconSpacing;
  }
  
  let boxWidth = Math.max(240, contentWidth + config.paddingX * 2);

  // Calculate height
  let contentHeight = config.companyNameSize;
  if (config.iconShow && (config.iconPosition === 'top' || config.iconPosition === 'bottom')) {
    contentHeight += config.iconSize + 10;
  }
  let boxHeight = Math.max(100, contentHeight + config.paddingY * 2);

  // If circle shape, scale container to a perfect square of the larger dimension to fit long names without clipping
  if (config.bgShape === 'circle') {
    const maxDim = Math.max(boxWidth, boxHeight);
    boxWidth = maxDim;
    boxHeight = maxDim;
  }

  // Canvas size wraps the logo box and tagline
  const canvasWidth = Math.max(600, boxWidth + 100);
  const canvasHeight = Math.max(400, boxHeight + (config.taglineShow ? config.taglineSize + 60 : 60));

  // Center coordinates of the logo box inside the canvas
  const boxX = (canvasWidth - boxWidth) / 2;
  const boxY = (canvasHeight - boxHeight) / 2 - (config.taglineShow ? config.taglineSize / 2 : 0);

  // Renders the icon path/SVG elements directly inside SVG
  const renderIcon = (x: number, y: number) => {
    if (!config.iconShow) return null;
    
    // Rotation and animation styles
    let transformStr = `translate(${x}, ${y}) rotate(${config.iconRotation})`;
    let className = 'logo-icon-svg';
    if (config.iconAnimation === 'spin') className += ' animate-spin-slow';
    if (config.iconAnimation === 'pulse') className += ' animate-pulse-slow';
    if (config.iconAnimation === 'float') className += ' animate-float-slow';

    if (config.iconName === 'custom') {
      if (!config.customIconSvg) return null;
      return (
        <g transform={transformStr} className={className}>
          <g transform={`translate(${-config.iconSize / 2}, ${-config.iconSize / 2})`}>
            <svg
              width={config.iconSize}
              height={config.iconSize}
              viewBox={config.customIconViewBox || "0 0 24 24"}
              fill={config.iconColor}
              color={config.iconColor}
              stroke={config.iconColor}
              style={{ display: 'block' }}
              dangerouslySetInnerHTML={{ __html: config.customIconSvg }}
            />
          </g>
        </g>
      );
    }

    const IconComponent = ICON_MAP[config.iconName] || Lucide.Terminal;
    return (
      <g transform={transformStr} className={className}>
        <g transform={`translate(${-config.iconSize / 2}, ${-config.iconSize / 2})`}>
          <IconComponent
            color={config.iconColor}
            size={config.iconSize}
            strokeWidth={2}
          />
        </g>
      </g>
    );
  };

  // Get Bracket characters
  const getBrackets = () => {
    switch (config.bracketsType) {
      case 'curly': return { left: '{', right: '}' };
      case 'square': return { left: '[', right: ']' };
      case 'angle':
      default:
        return { left: '<', right: '/>' };
    }
  };

  const brackets = getBrackets();

  // Helper coordinate variables for laying out items inside the logo box group
  // Everything is relative to the logo box (0,0 is top-left of box)
  const boxCenterX = boxWidth / 2;
  const boxCenterY = boxHeight / 2;

  // Let's compute text and icon offsets
  let textX = boxCenterX;
  let textY = boxCenterY;
  let iconX = boxCenterX;
  let iconY = boxCenterY;

  if (config.iconShow) {
    const totalOffset = 10;
    if (config.iconPosition === 'left') {
      iconX = boxCenterX - (textLength + bracketsWidth) / 2 - totalOffset;
      textX = boxCenterX + iconSpacing / 2;
    } else if (config.iconPosition === 'right') {
      iconX = boxCenterX + (textLength + bracketsWidth) / 2 + totalOffset;
      textX = boxCenterX - iconSpacing / 2;
    } else if (config.iconPosition === 'top') {
      iconY = boxCenterY - config.companyNameSize / 2 - 8;
      textY = boxCenterY + config.iconSize / 2;
    } else if (config.iconPosition === 'bottom') {
      iconY = boxCenterY + config.companyNameSize / 2 + 8;
      textY = boxCenterY - config.iconSize / 2;
    }
  }

  // Bracket widths and offsets
  const leftBracketX = textX - textLength / 2 - (config.bracketsType === 'angle' ? 12 : 8);
  const rightBracketX = textX + textLength / 2 + (config.bracketsType === 'angle' ? 6 : 8);

  // SVG Font styles
  const fontStyle = {
    fontFamily: config.companyNameFont,
    fontSize: `${config.companyNameSize}px`,
    fontWeight: config.companyNameWeight,
    letterSpacing: `${config.companyNameLetterSpacing}px`,
  };

  const taglineStyle = {
    fontFamily: config.taglineFont,
    fontSize: `${config.taglineSize}px`,
    letterSpacing: `${config.taglineLetterSpacing}px`,
    fontWeight: 'bold',
  };

  // Binary position adjustments based on shape geometry
  const isRect = config.bgShape === 'rectangle';
  const isCircle = config.bgShape === 'circle';
  const minDim = Math.min(boxWidth, boxHeight);
  
  const binLeftX = isRect ? 12 : isCircle ? boxCenterX - minDim * 0.35 : 18;
  const binLeftY = isRect ? 22 : isCircle ? boxCenterY - minDim * 0.35 : 22;
  
  const binRightX = isRect ? boxWidth - 12 : isCircle ? boxCenterX + minDim * 0.35 : boxWidth - 18;
  const binRightY = isRect ? boxHeight - 12 : isCircle ? boxCenterY + minDim * 0.35 : boxHeight - 18;

  // Custom Shape renderer for the logo background and patterns
  const renderBgShape = (isPatternOverlay: boolean) => {
    const w = boxWidth;
    const h = boxHeight;
    const fillValue = isPatternOverlay
      ? `url(#pattern-${config.circuitPattern})`
      : config.bgGradientType === 'solid' ? config.bgSolidColor : 'url(#logo-bg)';
      
    const filterValue = isPatternOverlay ? undefined : 'url(#box-glow)';
    const strokeValue = isPatternOverlay ? 'none' : config.shadowColor;
    const strokeWidthValue = isPatternOverlay ? 0 : (config.glowAnimation ? 1 : 0);
    const styleValue = isPatternOverlay
      ? undefined
      : {
          animation: config.glowAnimation ? `glow-pulse ${config.glowDuration}s ease-in-out infinite` : 'none',
          '--glow-color': config.shadowColor,
        } as React.CSSProperties;

    if (isPatternOverlay && (!config.circuitShow || config.circuitPattern === 'none')) {
      return null;
    }

    switch (config.bgShape) {
      case 'circle': {
        const r = Math.min(w, h) / 2;
        return (
          <circle
            cx={boxCenterX}
            cy={boxCenterY}
            r={r}
            fill={fillValue}
            filter={filterValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            style={styleValue}
            pointerEvents={isPatternOverlay ? 'none' : 'auto'}
          />
        );
      }
      case 'hexagon': {
        const points = `${w/2},0 ${w},${h/4} ${w},${h*3/4} ${w/2},${h} 0,${h*3/4} 0,${h/4}`;
        return (
          <polygon
            points={points}
            fill={fillValue}
            filter={filterValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            style={styleValue}
            pointerEvents={isPatternOverlay ? 'none' : 'auto'}
          />
        );
      }
      case 'shield': {
        const path = `M 0,0 L ${w},0 L ${w},${h/2} Q ${w},${h*0.85} ${w/2},${h} Q 0,${h*0.85} 0,${h/2} Z`;
        return (
          <path
            d={path}
            fill={fillValue}
            filter={filterValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            style={styleValue}
            pointerEvents={isPatternOverlay ? 'none' : 'auto'}
          />
        );
      }
      case 'triangle': {
        const points = `${w/2},0 ${w},${h} 0,${h}`;
        return (
          <polygon
            points={points}
            fill={fillValue}
            filter={filterValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            style={styleValue}
            pointerEvents={isPatternOverlay ? 'none' : 'auto'}
          />
        );
      }
      case 'badge': {
        const path = `M 0,0 L ${w},0 L ${w},${h} L ${w/2},${h*0.8} L 0,${h} Z`;
        return (
          <path
            d={path}
            fill={fillValue}
            filter={filterValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            style={styleValue}
            pointerEvents={isPatternOverlay ? 'none' : 'auto'}
          />
        );
      }
      case 'rectangle':
      default:
        return (
          <rect
            width={w}
            height={h}
            rx={config.borderRadius}
            fill={fillValue}
            filter={filterValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            style={styleValue}
            pointerEvents={isPatternOverlay ? 'none' : 'auto'}
          />
        );
    }
  };

  return (
    <div className="checkerboard-bg">
      <div 
        ref={containerRef} 
        className="logo-board-wrapper"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg
          ref={svgRef}
          width={canvasWidth}
          height={canvasHeight}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ background: config.canvasColor, borderRadius: '8px' }}
        >
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bungee&family=Cinzel:wght@400;700;900&family=Fira+Code:wght@400;700&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;700;800&family=Orbitron:wght@400;700;900&family=Outfit:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Press+Start+2P&family=Rubik+Mono+One&family=Source+Code+Pro:wght@400;700&family=Syncopate:wght@400;700&display=swap');
              
              .animate-blink {
                animation: blink 1.2s step-end infinite;
              }
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              
              .animate-spin-slow {
                animation: spin-slow 8s linear infinite;
              }
              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              
              .animate-pulse-slow {
                animation: pulse-slow 3s ease-in-out infinite;
              }
              @keyframes pulse-slow {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.9; }
              }
              
              .animate-float-slow {
                animation: float-slow 4s ease-in-out infinite;
              }
              @keyframes float-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
            `}
          </style>
          <defs>
            {/* Background Gradients */}
            {config.bgGradientType === 'linear' ? (
              <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.bgColorStart} />
                <stop offset="100%" stopColor={config.bgColorEnd} />
              </linearGradient>
            ) : config.bgGradientType === 'radial' ? (
              <radialGradient id="logo-bg" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor={config.bgColorStart} />
                <stop offset="100%" stopColor={config.bgColorEnd} />
              </radialGradient>
            ) : null}
            {/* Text Gradients */}
            {config.companyNameGradient && (
              <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={config.companyNameGradientStart} />
                <stop offset="100%" stopColor={config.companyNameGradientEnd} />
              </linearGradient>
            )}

            {config.companyNameGradientPart2 && (
              <linearGradient id="text-gradient-part2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={config.companyNameGradientStartPart2} />
                <stop offset="100%" stopColor={config.companyNameGradientEndPart2} />
              </linearGradient>
            )}            {/* Glow Shadow Filters */}
            <filter id="box-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={config.shadowBlur / 3} result="blur" />
              <feOffset dx={config.shadowOffsetX} dy={config.shadowOffsetY} />
              <feComponentTransfer in="blur" result="glow1">
                <feFuncA type="linear" slope="0.8" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Tech Patterns */}
            <pattern id="pattern-circuit" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.5" fill={config.circuitColor} opacity={config.circuitOpacity} />
              <path d="M 8,8 L 40,8 M 8,8 L 8,40" fill="none" stroke={config.circuitColor} strokeWidth="1" opacity={config.circuitOpacity} />
              <circle cx="28" cy="28" r="1.5" fill={config.circuitColor} opacity={config.circuitOpacity} />
              <path d="M 28,28 L 28,40 M 28,28 L 40,28" fill="none" stroke={config.circuitColor} strokeWidth="1" opacity={config.circuitOpacity} />
            </pattern>
            
            <pattern id="pattern-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.5" fill={config.circuitColor} opacity={config.circuitOpacity} />
            </pattern>

            <pattern id="pattern-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={config.circuitColor} strokeWidth="0.8" opacity={config.circuitOpacity} />
            </pattern>
          </defs>

          {/* Grid Overlay inside the editor (rendered below logo if active) */}
          {showGrid && (
            <g opacity="0.3" pointerEvents="none">
              {/* Vertical grid lines */}
              {Array.from({ length: Math.ceil(canvasWidth / 20) }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 20}
                  y1={0}
                  x2={i * 20}
                  y2={canvasHeight}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              ))}
              {/* Horizontal grid lines */}
              {Array.from({ length: Math.ceil(canvasHeight / 20) }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * 20}
                  x2={canvasWidth}
                  y2={i * 20}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              ))}
              {/* Center guide lines */}
              <line x1={canvasWidth / 2} y1={0} x2={canvasWidth / 2} y2={canvasHeight} stroke={config.bracketsColor} strokeWidth="1" strokeDasharray="4 4" />
              <line x1={0} y1={canvasHeight / 2} x2={canvasWidth} y2={canvasHeight / 2} stroke={config.bracketsColor} strokeWidth="1" strokeDasharray="4 4" />
            </g>
          )}

          {/* Logo Group */}
          <g id="logo-main-group">
            {/* The Logo Box */}
            <g transform={`translate(${boxX}, ${boxY})`}>
              {/* Glow backdrop shape */}
              {renderBgShape(false)}

              {/* Pattern Overlay */}
              {renderBgShape(true)}

              {/* Binary Decor Left */}
              {config.binaryShow && (
                <text
                  x={binLeftX}
                  y={binLeftY}
                  fill={config.binaryColor}
                  fontSize={config.binarySize}
                  fontFamily="Courier New, monospace"
                  textAnchor="start"
                  dominantBaseline="middle"
                >
                  {config.binaryTextLeft}
                </text>
              )}

              {/* Binary Decor Right */}
              {config.binaryShow && (
                <text
                  x={binRightX}
                  y={binRightY}
                  fill={config.binaryColor}
                  fontSize={config.binarySize}
                  fontFamily="Courier New, monospace"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {config.binaryTextRight}
                </text>
              )}

              {/* Main Content inside the box */}
              {/* Centering all text elements using dominant-baseline */}
              
              {/* Left bracket */}
              {config.bracketsShow && (
                <text
                  x={leftBracketX}
                  y={textY}
                  fill={config.bracketsColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={fontStyle}
                >
                  {brackets.left}
                </text>
              )}

              {/* Company name text */}
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                style={fontStyle}
              >
                {config.companyNameSplit ? (
                  <>
                    <tspan
                      fill={config.companyNameGradient ? 'url(#text-gradient)' : config.companyNameColor}
                      style={{
                        fontWeight: config.companyNameWeight,
                        fontFamily: config.companyNameFont,
                      }}
                    >
                      {config.companyNamePart1}
                    </tspan>
                    <tspan
                      fill={config.companyNameGradientPart2 ? 'url(#text-gradient-part2)' : config.companyNameColorPart2}
                      style={{
                        fontWeight: config.companyNameWeightPart2,
                        fontFamily: config.companyNameFontPart2,
                      }}
                    >
                      {config.companyNamePart2}
                    </tspan>
                  </>
                ) : (
                  <tspan fill={config.companyNameGradient ? 'url(#text-gradient)' : config.companyNameColor}>
                    {config.companyName}
                  </tspan>
                )}
              </text>

              {/* Right bracket */}
              {config.bracketsShow && (
                <text
                  x={rightBracketX}
                  y={textY}
                  fill={config.bracketsColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={fontStyle}
                >
                  {brackets.right}
                </text>
              )}

              {/* Blinking Cursor */}
              {config.cursorShow && (
                <rect
                  x={rightBracketX + (config.bracketsShow ? config.companyNameSize * 0.7 : 5)}
                  y={textY - config.companyNameSize * 0.4}
                  width={3}
                  height={config.companyNameSize * 0.8}
                  fill={config.cursorColor}
                  className="animate-blink"
                />
              )}

              {/* Icon rendering */}
              {renderIcon(iconX, iconY)}
            </g>

            {/* Tagline text centered below the logo box */}
            {config.taglineShow && (
              <text
                x={canvasWidth / 2}
                y={boxY + boxHeight + 35}
                fill={config.taglineColor}
                textAnchor="middle"
                style={taglineStyle}
              >
                {config.tagline}
              </text>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};
