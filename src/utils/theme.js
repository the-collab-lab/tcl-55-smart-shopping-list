import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
	},
	fonts: {
		heading: 'Playfair Display',
		body: 'Ysabeau',
	},
	styles: {
		global: {
			'#root': {
				height: '100%',
			},
			'html, body': {
				height: '100%',
				bg: 'brand.500',
				color: 'text.500',
				scrollbarWidth: 'stable both-edges',
			},
		},
	},
	colors: {
		brand: {
			500: '#3B293D',
		},
		darkBackground: {
			500: '#231825',
		},
		overdue: {
			500: '#CE6A92',
		},
		inactive: {
			500: '#7C7582',
		},
		soon: {
			500: '#5AA1D8',
		},
		approaching: {
			500: '#1E5C8B',
		},
		notSoon: {
			500: '#0D324D',
		},
		text: {
			500: '#DEDFE3',
		},
	},
	components: {
		Alert: {
			variants: {
				errorToast: {
					container: {
						bg: '#CE6A92',
					},
				},
				successToast: {
					container: {
						bg: '#5AA1D8',
					},
				},
				infoToast: {
					container: {
						bg: '#986C9D',
					},
				},
			},
		},
		Button: { variants: { solid: { bg: 'soon.500', color: 'brand.500' } } },
		Toast: {
			defaultProps: {
				position: 'top',
				color: 'text.500',
			},
		},
	},
});

export default theme;
