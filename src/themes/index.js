import { jungleCabinTheme } from './jungleCabin';
import { cozyTavernTheme } from './cozyTavern';

export const THEMES = {
  [jungleCabinTheme.id]: jungleCabinTheme,
  [cozyTavernTheme.id]: cozyTavernTheme
};

export const THEME_LIST = [
  jungleCabinTheme,
  cozyTavernTheme
];

export const DEFAULT_THEME_ID = jungleCabinTheme.id;

export function getTheme(themeId) {
  return THEMES[themeId] || jungleCabinTheme;
}
