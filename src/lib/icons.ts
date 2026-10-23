// Phosphor (regular) icons, inlined at build time. One family for the whole site (02 §17).
import arrowLeft from '@phosphor-icons/core/assets/regular/arrow-left.svg?raw';
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import arrowUpRight from '@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw';
import downloadSimple from '@phosphor-icons/core/assets/regular/download-simple.svg?raw';
import envelopeSimple from '@phosphor-icons/core/assets/regular/envelope-simple.svg?raw';
import githubLogo from '@phosphor-icons/core/assets/regular/github-logo.svg?raw';
import instagramLogo from '@phosphor-icons/core/assets/regular/instagram-logo.svg?raw';
import linkedinLogo from '@phosphor-icons/core/assets/regular/linkedin-logo.svg?raw';
import list from '@phosphor-icons/core/assets/regular/list.svg?raw';
import magnifyingGlassPlus from '@phosphor-icons/core/assets/regular/magnifying-glass-plus.svg?raw';
import x from '@phosphor-icons/core/assets/regular/x.svg?raw';
import xLogo from '@phosphor-icons/core/assets/regular/x-logo.svg?raw';

const ICONS = {
  'arrow-left': arrowLeft,
  'arrow-right': arrowRight,
  'arrow-up-right': arrowUpRight,
  'download-simple': downloadSimple,
  'envelope-simple': envelopeSimple,
  'github-logo': githubLogo,
  'instagram-logo': instagramLogo,
  'linkedin-logo': linkedinLogo,
  list,
  'magnifying-glass-plus': magnifyingGlassPlus,
  x,
  'x-logo': xLogo,
} as const;

export type IconName = keyof typeof ICONS;

/** Decorative SVG markup: the accessible name always comes from visible text or aria-label. */
export function iconSvg(name: IconName): string {
  const svg: string | undefined = ICONS[name];
  if (!svg) throw new Error(`Unknown icon: ${name}`);
  return svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
}
