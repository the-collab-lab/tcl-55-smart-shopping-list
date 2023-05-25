import { Box, Center, Heading } from '@chakra-ui/layout';
import { Outlet } from 'react-router-dom';

export function Layout() {
	return (
		<Box p={2}>
			<Center>
				<Heading>List Luxe</Heading>
			</Center>
			<Box as="main">
				<Outlet />
			</Box>
		</Box>
	);
}
