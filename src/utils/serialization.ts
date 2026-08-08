import type { LogoConfig } from '../types';

const KEY_MAP: Record<string, string> = {
  companyName: 'cn',
  companyNameColor: 'cnc',
  companyNameFont: 'cnf',
  companyNameSize: 'cns',
  companyNameWeight: 'cnw',
  companyNameLetterSpacing: 'cnl',
  companyNameGradient: 'cng',
  companyNameGradientStart: 'cgs',
  companyNameGradientEnd: 'cge',
  bracketsShow: 'bs',
  bracketsColor: 'bc',
  bracketsType: 'bt',
  cursorShow: 'cs',
  cursorColor: 'cc',
  tagline: 't',
  taglineColor: 'tc',
  taglineFont: 'tf',
  taglineSize: 'ts',
  taglineLetterSpacing: 'tl',
  taglineShow: 'tsh',
  iconName: 'in',
  iconShow: 'ish',
  iconColor: 'ic',
  iconSize: 'is',
  iconRotation: 'ir',
  iconAnimation: 'ia',
  iconPosition: 'ip',
  bgShape: 'bsh',
  bgGradientType: 'bgt',
  bgColorStart: 'bcs',
  bgColorEnd: 'bce',
  bgSolidColor: 'bsc',
  bgGradientAngle: 'bga',
  borderRadius: 'br',
  paddingX: 'px',
  paddingY: 'py',
  shadowColor: 'sc',
  shadowBlur: 'sb',
  shadowSpread: 'ssp',
  shadowOffsetY: 'soy',
  shadowOffsetX: 'sox',
  glowAnimation: 'ga',
  glowDuration: 'gd',
  circuitShow: 'cish',
  circuitColor: 'cic',
  circuitOpacity: 'cio',
  circuitPattern: 'cip',
  binaryShow: 'bish',
  binaryTextLeft: 'btl',
  binaryTextRight: 'btr',
  binaryColor: 'bic',
  binarySize: 'bis',
  canvasColor: 'cac',
  companyNameSplit: 'cnspl',
  companyNamePart1: 'cnp1',
  companyNamePart2: 'cnp2',
  companyNameColorPart2: 'cncp2',
  companyNameFontPart2: 'cnfp2',
  companyNameWeightPart2: 'cnwp2',
  companyNameGradientPart2: 'cngp2',
  companyNameGradientStartPart2: 'cgsp2',
  companyNameGradientEndPart2: 'cgep2',
  customIconSvg: 'cis',
  customIconViewBox: 'civb',
};

const REVERSE_KEY_MAP: Record<string, string> = Object.entries(KEY_MAP).reduce(
  (acc, [long, short]) => {
    acc[short] = long;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Encode string to URL-safe Base64
 */
const encodeBase64 = (str: string): string => {
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error('Base64 encoding failed:', e);
    return '';
  }
};

/**
 * Decode string from URL-safe Base64
 */
const decodeBase64 = (base64: string): string => {
  try {
    let bin = base64.replace(/-/g, '+').replace(/_/g, '/');
    while (bin.length % 4) bin += '=';
    const binString = atob(bin);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error('Base64 decoding failed:', e);
    return '';
  }
};

/**
 * Serialize a full or partial LogoConfig into a short URL hash
 */
export const serializeConfig = (config: LogoConfig): string => {
  const shortObj: Record<string, any> = {};
  
  Object.entries(config).forEach(([key, value]) => {
    const shortKey = KEY_MAP[key];
    if (shortKey) {
      // Don't include empty or default values if they are bulky (e.g. empty customIconSvg)
      if (key === 'customIconSvg' && !value) return;
      shortObj[shortKey] = value;
    }
  });

  const jsonStr = JSON.stringify(shortObj);
  return encodeBase64(jsonStr);
};

/**
 * Deserialize a URL hash back into a partial LogoConfig
 */
export const deserializeConfig = (hash: string): Partial<LogoConfig> | null => {
  if (!hash) return null;
  
  const decoded = decodeBase64(hash);
  if (!decoded) return null;

  try {
    const shortObj = JSON.parse(decoded);
    const config: Record<string, any> = {};

    Object.entries(shortObj).forEach(([shortKey, value]) => {
      const longKey = REVERSE_KEY_MAP[shortKey];
      if (longKey) {
        config[longKey] = value;
      }
    });

    return config as Partial<LogoConfig>;
  } catch (e) {
    console.error('Error parsing deserialized config:', e);
    return null;
  }
};
