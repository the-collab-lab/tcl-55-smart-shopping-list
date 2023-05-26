import { useEffect, useState } from 'react';
import {
	Box,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	FormControl,
	FormLabel,
	RadioGroup,
	Radio,
	Input,
	Button,
	useToast,
	Flex,
	Stack,
	Heading,
	Text,
} from '@chakra-ui/react';
import { addItem } from '../api/firebase';

export function AddItem({
	data,
	listId,
	isOpen,
	onClose,
	btnRef,
	initialValue,
}) {
	const [timeframe, setTimeframe] = useState('7');
	const [itemName, setItemName] = useState(initialValue);
	const toast = useToast();

	const onItemChange = (e) => setItemName(e.target.value);

	// function to validate itemName input that returns error messages if any - called onFormSubmit
	function validateItemInput(data, trimmedItemName) {
		// 1- checks for empty inputs

		if (!trimmedItemName) {
			toast({
				title: 'No item name entered',
				description: `Please enter an item name.`,
				variant: 'errorToast',
			});
			return false;
		}

		// 2- checks for invalid characters

		if (trimmedItemName.search(/[^a-z0-9'&-\s]/i) !== -1) {
			toast({
				title: 'Invalid item name entered',
				description: `Please only use alphanumeric, ', -, or & characters in your item name.`,
				variant: 'errorToast',
			});
			return false;
		}

		const normalizedItemName = trimmedItemName
			.replace(/[^a-z0-9'&-]/gi, '')
			.toLowerCase();

		const potentialMatch = data.find(
			(item) =>
				item.name.replaceAll(' ', '').toLowerCase() === normalizedItemName,
		);

		// 3- checks for potential match including exact match and match after removing special characters and spaces

		if (potentialMatch) {
			toast({
				title: 'Item already on list',
				description: `You are already tracking ${potentialMatch.name}.`,
				variant: 'errorToast',
			});
			return false;
		}
		return true;
	}

	const onFormSubmit = async (e) => {
		e.preventDefault();
		const trimmedItemName = itemName.trim();

		const isValidItem = validateItemInput(data, trimmedItemName);

		if (isValidItem) {
			const result = await addItem(listId, {
				itemName: trimmedItemName,
				daysUntilNextPurchase: timeframe,
			});
			if (result) {
				toast({
					title: 'Item added',
					description: `Added ${trimmedItemName} to your list.`,
					variant: 'successToast',
				});
				setItemName('');
				setTimeframe('7');
			} else {
				toast({
					title: 'Error adding item',
					description: 'Please try again.',
					variant: 'errorToast',
				});
			}
		}
	};

	return (
		<>
			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent bg={'brand.500'} justify="center">
					<DrawerCloseButton />
					<DrawerHeader>
						<Heading>Add Item</Heading>
					</DrawerHeader>
					<DrawerBody>
						<form onSubmit={onFormSubmit}>
							<Flex direction="column" justify="center" gap={4}>
								<Text htmlFor="itemName">Item Name:</Text>
								<Input
									type="text"
									id="itemName"
									name="itemName"
									variant="filled"
									bg="darkBackground.500"
									value={itemName}
									onChange={onItemChange}
								/>
								<FormControl>
									<FormLabel htmlFor="timeframe">
										How soon will you buy this again?
									</FormLabel>
									<RadioGroup onChange={setTimeframe} value={timeframe}>
										<Stack>
											<Radio value={'7'} borderColor="text.500">
												Soon
											</Radio>
											<Radio value={'14'} borderColor="text.500">
												Kind of Soon
											</Radio>
											<Radio value={'30'} borderColor="text.500">
												Not Soon
											</Radio>
										</Stack>
									</RadioGroup>
								</FormControl>
								<Box>
									<Button type="submit" p={2}>
										Add Item
									</Button>
								</Box>
							</Flex>
						</form>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
