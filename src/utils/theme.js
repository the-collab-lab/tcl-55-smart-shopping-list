import { extendTheme } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { alertAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(alertAnatomy.keys);

const baseStyle = definePartsStyle((props) => {
	const { status } = props;

	const successBase = status === 'success' && {
		container: {
			background: 'soon.500',
			color: 'text.500',
		},
	};

	const warningBase = status === 'warning' && {
		container: {
			background: 'warning.500',
			color: 'text.500',
		},
	};

	const errorBase = status === 'error' && {
		container: {
			background: 'overdue.500',
			color: 'text.500',
		},
	};

	const infoBase = status === 'info' && {
		container: {
			background: '#986C9D',
			color: 'text.500',
		},
	};

	return {
		...successBase,
		...warningBase,
		...errorBase,
		...infoBase,
	};
});

const alertTheme = defineMultiStyleConfig({ baseStyle });

const theme = extendTheme({
	fonts: {
		heading: 'Playfair Display',
		body: 'Ysabeau',
	},
	styles: {
		global: {
			'html, body': {
				bg: 'brand.500',
				color: 'text.500',
			},
		},
	},
	colors: {
		brand: {
			500: '#3B293D',
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
		Alert: { ...alertTheme },
		Toast: {
			defaultProps: {
				position: 'top',
				color: 'text.500',
			},
		},
	},
});

export default theme;
