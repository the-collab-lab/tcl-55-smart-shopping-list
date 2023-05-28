
import { Fragment, useState, useEffect, useRef } from 'react';
import { comparePurchaseUrgency } from '../api';
import { Button, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { AddItem } from '../components/AddItem';
import { ListItem } from '../components';
import {
	Box,
	VStack,
	Heading,
	Text,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Accordion,
	useToast,
	InputGroup,
	Input,
	InputRightElement,
	IconButton,
} from '@chakra-ui/react';
import { CopyIcon, CloseIcon } from '@chakra-ui/icons';

export function List({ data, listId }) {
	const [searchInput, setSearchInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const successToast = useToast({ variant: 'successToast' });
	const errorToast = useToast({ variant: 'errorToast' });
	const [dialogText, setDialogText] = useState('');
	const btnRef = useRef();
	const { isOpen: isDrawerOpen, onOpen, onClose } = useDisclosure();

	const categorizedData = comparePurchaseUrgency(data);

	const handleSearchInput = (e) => {
		const text = e.target.value;
		setSearchInput(text);
	};

	const handleClear = () => {
		setSearchInput('');
	};

	const handleFormSubmit = (e) => e.preventDefault();

	const handleDeleteConfirmation = (result, itemName) => {
		if (result) {
			successToast({
				description: `You have successfully deleted ${itemName}.`,
			});
		} else {
			errorToast({
				description: `Error deleting ${itemName}, please try again .`,
			});
		}
	};

	const filterItem = (item, urgency) => {
		if (item.name.toLowerCase().includes(searchInput.toLowerCase())) {
			return (
				<Accordion key={item.id} allowMultiple>
					<ListItem
						listId={listId}
						item={item}
						urgency={urgency}
						handleDeleteConfirmation={handleDeleteConfirmation}
					/>
				</Accordion>
			);
		}

		return [];
	};

	return (
		<VStack>
			<Text>Token:</Text>
			<Text>
				{listId}
				<IconButton
					aria-label="delete"
					size="sm"
					bg="none"
					_hover={{ cursor: 'pointer' }}
					ml="0.5em"
					onClick={() => {
						navigator.clipboard.writeText(`${listId}`);
						successToast({ description: `Token copied!` });
					}}
					icon={<CopyIcon />}
				/>
			</Text>
		<>
			<IconButton
				aria-label="Add Item"
				icon={<AddIcon />}
				onClick={onOpen}
				position="absolute"
				top={4}
				right={4}
				ref={btnRef}
				colorScheme="blue"
				background="soon.500"
				size="md"
				borderRadius="3xl"
			/>
			<AddItem
				btnRef={btnRef}
				data={data}
				listId={listId}
				onClose={onClose}
				isOpen={isDrawerOpen}
				initialValue={
					Object.values(categorizedData)
						.flat()
						.map((item) => item.name.toLowerCase())
						.some((str) => str.includes(searchInput.toLowerCase()))
						? ''
						: searchInput
				}
			/>
			{Object.values(categorizedData).flat().length === 0 && (
				<section
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						margin: '1.5em',
						gap: '1em',
					}}
				>
					<Text>Your shopping list is currently empty.</Text>
        </section>
			)}
			{Object.values(categorizedData).flat().length !== 0 && (
				<form
					onSubmit={handleFormSubmit}
					style={{
						display: 'flex',
						gap: '1em',
						margin: '1.5em',
					}}
				>
					<InputGroup>
						<Input
							id="search"
							name="search"
							value={searchInput}
							placeholder="Filter items here..."
							onChange={handleSearchInput}
							bg="darkBackground.500"
							color="#DEDFE3"
						/>
						(
						<InputRightElement>
							{searchInput.length > 0 && <CloseIcon onClick={handleClear} />}
						</InputRightElement>
						)
					</InputGroup>
				</form>
			)}
			{data.length > 0 && (
				<Tabs
					sx={{
						'@media (max-width: 24em)': {
							w: '100%',
						},
					}}
				>
					<Box
						overflow="auto"
						sx={{
							scrollbarWidth: 'none',
							'::-webkit-scrollbar': {
								display: 'none',
							},
						}}
					>
						<TabList
							sx={{
								'@media (max-width: 24em)': {
									overflowY: 'hidden',
									w: 'max-content',
								},
							}}
						>
							<Tab _selected={{ bg: 'soon.500' }} flexShrink={0}>
								All
							</Tab>
							{Object.keys(categorizedData).map((key) => (
								<Tab key={key} _selected={{ bg: 'soon.500' }} flexShrink={0}>
									{key}
								</Tab>
							))}
						</TabList>
					</Box>

					<TabPanels>
						<TabPanel>
							{Object.keys(categorizedData).map((key) => (
								<Fragment key={key}>
									{categorizedData[key].filter((item) =>
										item.name.toLowerCase().includes(searchInput.toLowerCase()),
									).length > 0 && (
										<>
											<Heading fontSize="16">
												<h2>{key}:</h2>
											</Heading>
											{categorizedData[key].flatMap((item) =>
												filterItem(item, key),
											)}
										</>
									)}
								</Fragment>
							))}
						</TabPanel>
						{Object.keys(categorizedData).map((key) => (
							<Fragment key={key}>
								{categorizedData[key].filter((item) =>
									item.name.toLowerCase().includes(searchInput.toLowerCase()),
								).length > 0 && (
									<TabPanel>
										{categorizedData[key].flatMap((item) =>
											filterItem(item, key),
										)}
									</TabPanel>
								)}
							</Fragment>
						))}
					</TabPanels>
				</Tabs>
			)}
		</VStack>
	);
}
