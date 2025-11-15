import { COLORS, ThemeType } from './colors';

export interface Theme {
  colors: typeof COLORS.light;
  type: ThemeType;
}

export const getTheme = (themeType: ThemeType): Theme => {
  return {
    colors: COLORS[themeType],
    type: themeType,
  };
};

export const themes = {
  light: getTheme('light'),
  dark: getTheme('dark'),
};
