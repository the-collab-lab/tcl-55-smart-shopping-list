import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItem } from '../components';

export function List({ data, listId }) {
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [dialogText, setDialogText] = useState('');

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

	const filterItem = (item) => {
		if (item.name.toLowerCase().includes(searchInput.toLowerCase())) {
			return (
				<ListItem
					key={item.id}
					listId={listId}
					item={item}
					handleDeleteConfirmation={handleDeleteConfirmation}
				/>
			);
		}

		return [];
	};

	return (
		<>
			{data.length === 0 && (
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
			{data.length !== 0 && (
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
					></input>
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
			<ul>{data.flatMap((item) => filterItem(item))}</ul>
		</>
	);
}
