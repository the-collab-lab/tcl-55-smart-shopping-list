import { Outlet, NavLink } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';

import { About } from '../components/About';

import { Heading } from '@chakra-ui/layout';
import { VisuallyHidden } from '@chakra-ui/visually-hidden';

/**
 * TODO: The links defined in this file don't work!
 *
 * Instead of anchor element, they should use a component
 * from `react-router-dom` to navigate to the routes
 * defined in `App.jsx`.
 */

export function Layout() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<About isOpen={isOpen} onClose={onClose} />
			<div className="Layout">
				<header className="Layout-header">
					<Heading as="button" onClick={onOpen} cursor={'pointer'}>
						Smart shopping list
						<VisuallyHidden>Open about modal</VisuallyHidden>
					</Heading>
				</header>
				<main className="Layout-main">
					<Outlet />
				</main>
				<nav className="Nav">
					<NavLink to="/" className="Nav-link">
						Home
					</NavLink>
					<NavLink to="/list" className="Nav-link">
						List
					</NavLink>
					<NavLink to="/add-item" className="Nav-link">
						Add Item
					</NavLink>
				</nav>
			</div>
		</>
	);
}
