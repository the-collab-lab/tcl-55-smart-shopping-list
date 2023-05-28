import { Box, Center, Flex, Heading, VisuallyHidden } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';

import { About } from '../components/About';

export function Layout() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const location = useLocation();

	return (
		<>
			<About isOpen={isOpen} onClose={onClose} />
			<Flex
				direction="column"
				p={2}
				pt={location.pathname === '/' ? 16 : 8}
				h="100%"
			>
				<Center>
					<Heading
						size={location.pathname === '/' ? '3xl' : 'xl'}
						onClick={onOpen}
						cursor={'pointer'}
					>
						List Luxe
						<VisuallyHidden>Open about modal</VisuallyHidden>
					</Heading>
				</Center>
				<Box as="main" h="100%">
					<Outlet />
				</Box>
			</Flex>
		</>
	);
}
