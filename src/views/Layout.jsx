import { Box, Center, Flex, Heading } from '@chakra-ui/layout';
import { Outlet, useLocation } from 'react-router-dom';

export function Layout() {
	const location = useLocation();

	return (
		<Flex direction="column" p={2} h="100%">
			<Center>
				<Heading size={location.pathname === '/' ? '3xl' : 'xl'}>
					List Luxe
				</Heading>
			</Center>
			<Box as="main" h="100%">
				<Outlet />
			</Box>
		</Flex>
	);
}
