import { Fragment, useState, useEffect } from 'react';
import { comparePurchaseUrgency } from '../api';
import { ListItem } from '../components';
import {
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
} from '@chakra-ui/react';
import { CopyIcon, CloseIcon } from '@chakra-ui/icons';

export function List({ data, listId }) {
	const [searchInput, setSearchInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const successToast = useToast({ variant: 'successToast' });
	const errorToast = useToast({ variant: 'errorToast' });

	const categorizedData = comparePurchaseUrgency(data);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsOpen(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, [isOpen]);

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
			successToast({ title: `You have successfully deleted ${itemName}.` });
		} else {
			errorToast({ title: `Error deleting ${itemName}, please try again .` });
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
		<VStack m="3em">
			<Heading mb="0.5em">List Luxe</Heading>
			<Text>Token:</Text>
			<Text>
				{listId}
				<CopyIcon
					aria-label="delete"
					size="sm"
					_hover={{ cursor: 'pointer' }}
					ml="0.5em"
					onClick={() => {
						navigator.clipboard.writeText(`${listId}`);
					}}
				/>
			</Text>
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
					<p>Your shopping list is currently empty.</p>
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
				<Tabs>
					<TabList>
						<Tab key="All">All</Tab>
						{Object.keys(categorizedData).map((key) => (
							<Tab key={key}>{key}</Tab>
						))}
					</TabList>

					<TabPanels>
						<TabPanel>
							{Object.keys(categorizedData).map((key) => (
								<Fragment key={key}>
									{categorizedData[key].filter((item) =>
										item.name.toLowerCase().includes(searchInput.toLowerCase()),
									).length > 0 && (
										<>
											<h2>{key}:</h2>
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
