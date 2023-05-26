import { useState } from 'react';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { streamListItems, addItem } from '../api';
import {
	Button,
	Box,
	Divider,
	Flex,
	IconButton,
	Input,
	InputGroup,
	FormControl,
	FormLabel,
	InputRightElement,
	useToast,
} from '@chakra-ui/react';
import { Image } from '@chakra-ui/image';
import { X } from 'feather-icons-react';

export function Home({ handleListTokenState }) {
	const [userEnteredToken, setUserEnteredToken] = useState('');
	const toast = useToast();

	const handleCreateList = async () => {
		const newToken = generateToken();

		const placeholder = await addItem(newToken, {
			itemName: null,
			daysUntilNextPurchase: '0',
		});
		if (placeholder) {
			handleListTokenState(newToken);
		} else {
			toast({
				title: 'Error',
				description: 'Error adding empty list to Firebase',
				variant: 'errorToast',
			});
		}
	};

	const handleChange = (e) => setUserEnteredToken(e.target.value);
	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (userEnteredToken.length === 0) {
			toast({
				title: 'Error',
				description: 'Please enter a token.',
				variant: 'errorToast',
			});
			return;
		}
		streamListItems(userEnteredToken, (snapshot) => {
			if (snapshot.empty) {
				toast({
					title: 'Error',
					description: 'List not found. Please try another token.',
					variant: 'errorToast',
				});
			} else {
				handleListTokenState(userEnteredToken);
			}
		});
	};

	return (
		<Flex
			direction="column"
			h="100%"
			align="center"
			justify="space-around"
			pt={4}
		>
			<Box pb={4}>
				<Button
					bg="soon.500"
					textColor="brand.500"
					onClick={handleCreateList}
					fontSize={{ base: 'md', md: 'xl' }}
				>
					Create a new list
				</Button>
			</Box>
			<Divider />
			<FormControl id="join-list">
				<form onSubmit={handleFormSubmit}>
					<Flex
						direction="column"
						align="center"
						justify="center"
						gap={2}
						pt={4}
					>
						<FormLabel htmlFor="join-list" fontSize={{ base: 'md', md: 'xl' }}>
							Join an existing list
						</FormLabel>
						<Box>
							<InputGroup size="md">
								<Input
									bg="darkBackground.500"
									mb={2}
									type="text"
									id="join-list"
									value={userEnteredToken}
									onChange={handleChange}
								/>
								<InputRightElement>
									<IconButton
										aria-label="Clear token"
										icon={<X />}
										onClick={() => setUserEnteredToken('')}
										_hover={{ bg: 'none' }}
										bg="none"
										display={
											userEnteredToken.length > 0 ? 'inline-flex' : 'none'
										}
									/>
								</InputRightElement>
							</InputGroup>
						</Box>
						<Button
							type="submit"
							bg="soon.500"
							textColor="brand.500"
							fontSize={{ base: 'md', md: 'xl' }}
						>
							Join
						</Button>
					</Flex>
				</form>
			</FormControl>
			<Image
				src={'./img/people.svg'}
				w="80%"
				alt="Shoppers at a grocery store enjoying their experience"
			/>
		</Flex>
	);
}
