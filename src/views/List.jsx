import { Fragment, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api';
import { Button, useDisclosure } from '@chakra-ui/react';
import { AddItem } from './AddItem';
import { ListItem } from '../components';

export function List({ data, listId }) {
	const [searchInput, setSearchInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [dialogText, setDialogText] = useState('');
	const btnRef = useRef();
	const { isOpen: isDrawerOpen, onOpen, onClose } = useDisclosure();

	const navigate = useNavigate();
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

	const handleFirstItem = () => {
		navigate('/add-item');
	};

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
			<AddItem
				btnRef={btnRef}
				data={data}
				listId={listId}
				onClose={onClose}
				isOpen={isDrawerOpen}
			/>
			{Object.values(categorizedData).flat().length === 0 && (
				<section
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
					}}
				>
					<p>Your shopping list is currently empty.</p>
					<button name="firstItem" onClick={handleFirstItem}>
						Add Item
					</button>
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
					<Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
						Add Item
					</Button>
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
