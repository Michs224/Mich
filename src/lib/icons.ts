// Phosphor icons in the light weight, inlined at build time. One family for the whole site (02 §17).
import arrowDown from '@phosphor-icons/core/assets/light/arrow-down-light.svg?raw';
import arrowLeft from '@phosphor-icons/core/assets/light/arrow-left-light.svg?raw';
import arrowRight from '@phosphor-icons/core/assets/light/arrow-right-light.svg?raw';
import arrowUpRight from '@phosphor-icons/core/assets/light/arrow-up-right-light.svg?raw';
import caretDown from '@phosphor-icons/core/assets/light/caret-down-light.svg?raw';
import downloadSimple from '@phosphor-icons/core/assets/light/download-simple-light.svg?raw';
import envelopeSimple from '@phosphor-icons/core/assets/light/envelope-simple-light.svg?raw';
import githubLogo from '@phosphor-icons/core/assets/light/github-logo-light.svg?raw';
import house from '@phosphor-icons/core/assets/light/house-light.svg?raw';
import instagramLogo from '@phosphor-icons/core/assets/light/instagram-logo-light.svg?raw';
import linkedinLogo from '@phosphor-icons/core/assets/light/linkedin-logo-light.svg?raw';
import magnifyingGlassPlus from '@phosphor-icons/core/assets/light/magnifying-glass-plus-light.svg?raw';
import paperPlaneTilt from '@phosphor-icons/core/assets/light/paper-plane-tilt-light.svg?raw';
import pause from '@phosphor-icons/core/assets/light/pause-light.svg?raw';
import play from '@phosphor-icons/core/assets/light/play-light.svg?raw';
import x from '@phosphor-icons/core/assets/light/x-light.svg?raw';
import xLogo from '@phosphor-icons/core/assets/light/x-logo-light.svg?raw';

const ICONS = {
  'arrow-down': arrowDown,
  'arrow-left': arrowLeft,
  'arrow-right': arrowRight,
  'arrow-up-right': arrowUpRight,
  'caret-down': caretDown,
  'download-simple': downloadSimple,
  'envelope-simple': envelopeSimple,
  'github-logo': githubLogo,
  house,
  'instagram-logo': instagramLogo,
  'linkedin-logo': linkedinLogo,
  'magnifying-glass-plus': magnifyingGlassPlus,
  'paper-plane-tilt': paperPlaneTilt,
  pause,
  play,
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
