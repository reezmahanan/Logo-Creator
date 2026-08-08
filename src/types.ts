export interface LogoConfig {
  // Brand Text
  companyName: string;
  companyNameColor: string;
  companyNameFont: string;
  companyNameSize: number;
  companyNameWeight: string;
  companyNameLetterSpacing: number;
  companyNameGradient: boolean;
  companyNameGradientStart: string;
  companyNameGradientEnd: string;

  // Brackets
  bracketsShow: boolean;
  bracketsColor: string;
  bracketsType: 'angle' | 'curly' | 'square' | 'none';

  // Blinking Cursor
  cursorShow: boolean;
  cursorColor: string;

  // Tagline
  tagline: string;
  taglineColor: string;
  taglineFont: string;
  taglineSize: number;
  taglineLetterSpacing: number;
  taglineShow: boolean;

  // Icon
  iconName: string; // from Lucide icons
  iconShow: boolean;
  iconColor: string;
  iconSize: number;
  iconRotation: number;
  iconAnimation: 'none' | 'spin' | 'pulse' | 'float';
  iconPosition: 'left' | 'right' | 'top' | 'bottom';

  // Background / Container
  bgShape: 'rectangle' | 'circle' | 'hexagon' | 'shield' | 'triangle' | 'badge';
  bgGradientType: 'solid' | 'linear' | 'radial';
  bgColorStart: string;
  bgColorEnd: string;
  bgSolidColor: string;
  bgGradientAngle: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  
  // Shadows & Glows
  shadowColor: string;
  shadowBlur: number;
  shadowSpread: number;
  shadowOffsetY: number;
  shadowOffsetX: number;
  glowAnimation: boolean;
  glowDuration: number;

  // Tech Elements
  circuitShow: boolean;
  circuitColor: string;
  circuitOpacity: number;
  circuitPattern: 'circuit' | 'dots' | 'grid' | 'none';
  
  binaryShow: boolean;
  binaryTextLeft: string;
  binaryTextRight: string;
  binaryColor: string;
  binarySize: number;

  // Outer Wrapper Settings
  canvasColor: string; // Background of the preview area

  // Brand Text Split Options
  companyNameSplit: boolean;
  companyNamePart1: string;
  companyNamePart2: string;
  companyNameColorPart2: string;
  companyNameFontPart2: string;
  companyNameWeightPart2: string;
  companyNameGradientPart2: boolean;
  companyNameGradientStartPart2: string;
  companyNameGradientEndPart2: string;

  // Custom SVG Icon uploader options
  customIconSvg: string; // Raw inner HTML of SVG
  customIconViewBox: string; // ViewBox of uploaded SVG
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  category?: 'classic' | 'cyberpunk' | 'corporate' | 'creative';
  config: LogoConfig;
}
