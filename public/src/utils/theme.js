import { THEMES, THEME_DEFAULT, CHAT_STATUS_KEY } from '../config/constants';

export const getTheme = (theme = '') => {
	const indexOfTheme = THEMES.indexOf(theme);
	if (indexOfTheme > -1) {
		return THEMES[indexOfTheme];
	}
	return THEME_DEFAULT;
};

export const getThemeClass = (theme = '') => {
  return `${getTheme(theme)}-theme`;
}

export const getChatMinimized = () => {
	const minimized = localStorage.getItem(CHAT_STATUS_KEY) || false;
	return !!minimized;
};

export const setChatMinimized = (minimized) => {
	localStorage.setItem(CHAT_STATUS_KEY, minimized);
};
