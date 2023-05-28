import { Fragment, useState, useEffect, useRef } from 'react';
import { comparePurchaseUrgency } from '../api';
import { Button, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { AddItem } from '../components/AddItem';
import { ListItem } from '../components';

export function List({ data, listId }) {
	const [searchInput, setSearchInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [dialogText, setDialogText] = useState('');
	const btnRef = useRef();
	const { isOpen: isDrawerOpen, onOpen, onClose } = useDisclosure();

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
			setIsOpen(true);
			setDialogText(`You have successfully deleted ${itemName}.`);
		} else {
			setIsOpen(true);
			setDialogText(`Error deleting ${itemName}, please try again .`);
		}
	};

	const filterItem = (item, urgency) => {
		if (item.name.toLowerCase().includes(searchInput.toLowerCase())) {
			return (
				<ListItem
					key={item.id}
					listId={listId}
					item={item}
					urgency={urgency}
					handleDeleteConfirmation={handleDeleteConfirmation}
				/>
			);
		}

		return [];
	};

	return (
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
					}}
				>
					<Text>Your shopping list is currently empty.</Text>
					<Button name="firstItem" onClick={onOpen}>
						Add Item
					</Button>
				</section>
			)}
			{Object.values(categorizedData).flat().length !== 0 && (
				<form
					onSubmit={handleFormSubmit}
					style={{ display: 'flex', gap: '1rem' }}
				>
					<label htmlFor="search">Filter Items</label>
					<input
						type="text"
						id="search"
						name="search"
						value={searchInput}
						onChange={handleSearchInput}
						placeholder="Start typing here..."
					/>

					{searchInput.length > 0 ? (
						<button type="reset" name="clear" onClick={handleClear}>
							Clear Filter
						</button>
					) : null}
				</form>
			)}
			<dialog open={isOpen} style={{ position: 'fixed' }}>
				{dialogText}
			</dialog>
			<ul>
				{Object.keys(categorizedData).map((key) => (
					<Fragment key={key}>
						{categorizedData[key].filter((item) =>
							item.name.toLowerCase().includes(searchInput.toLowerCase()),
						).length > 0 && (
							<>
								<h2>{key}:</h2>
								{categorizedData[key].flatMap((item) => filterItem(item, key))}
							</>
						)}
					</Fragment>
				))}
			</ul>
		</>
	);
}
