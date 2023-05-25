import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Flex,
	Heading,
	Text,
	Icon,
	HStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Github, Linkedin } from 'feather-icons-react';

function Bio({ name, github, linkedin }) {
	return (
		<HStack>
			<Text>{name}</Text>
			<Link to={github}>
				<Icon as={Github} />
			</Link>
			<Link to={linkedin}>
				<Icon as={Linkedin} />
			</Link>
		</HStack>
	);
}

export function About({ isOpen, onClose, ref }) {
	return (
		<>
			<Drawer
				isOpen={isOpen}
				onClose={onClose}
				finalFocusRef={ref}
				placement="right"
			>
				<DrawerOverlay />
				<DrawerContent bg={'brand.500'} justify="center">
					<DrawerCloseButton />
					<DrawerHeader>
						<Heading>About</Heading>
					</DrawerHeader>
					<DrawerBody>
						<Flex direction="column" justify="center" gap={4}>
							<Text>
								List Luxe is a smart shopping list developed as a part of
								<Link to="https://the-collab-lab.codes/">The Collab Lab</Link>.
								List Luxe is an advanced shopping app that optimizes your buying
								experience. Utilizing intelligent technology, it learns
								yourpurchase habits and forecasts when you'll need to
								re-purchase specific items.
							</Text>
							<Heading as="h3" size="md">
								Team Members
							</Heading>
							<Bio
								name="Ticia Francisco"
								github="https://github.com/ticiadev"
								linkedin="https://www.linkedin.com/in/ticiadev/"
							/>
							<Bio
								name="Katherine Yuneman"
								github="https://github.com/katherineyuneman"
								linkedin="https://www.linkedin.com/in/katherine-yuneman/"
							/>
							<Bio
								name="Yao Jiang"
								github="https://github.com/Yaosaur"
								linkedin="https://www.linkedin.com/in/yao-jiang-swerph/"
							/>
							<Bio
								name="Jeremiah Fallin"
								github="https://github.com/jeremiahfallin"
								linkedin="https://www.linkedin.com/in/jeremiah-fallin/"
							/>
						</Flex>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
