import { fontFamily } from 'tailwindcss/defaultTheme';

export const content = ['./src/**/*.{html,js,ts,svelte}'];
export const theme = {
	extend: {
		fontFamily: {
			display: ['Space Grotesk', ...fontFamily.sans],
			body: ['Inter', ...fontFamily.sans]
		}
	}
};
export const plugins = [];
