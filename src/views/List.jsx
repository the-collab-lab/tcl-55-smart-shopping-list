import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api';
import { ListItem } from '../components';

export function List({ data, listId }) {
	const [searchInput, setSearchInput] = useState('');
	data = comparePurchaseUrgency(data);
	const navigate = useNavigate();

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

	const filterItem = (item, urgency) => {
		if (item.name.toLowerCase().includes(searchInput.toLowerCase())) {
			return <ListItem listId={listId} item={item} urgency={urgency} />;
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
			<ul>
				<h2>Overdue:</h2>
				{data.overdue.flatMap((item) => filterItem(item, 'overdue'))}
				<h2>Soon:</h2>
				{data.soon.flatMap((item) => filterItem(item, 'soon'))}
				<h2>Kind of soon:</h2>
				{data.kindOfSoon.flatMap((item) => filterItem(item, 'kindOfSoon'))}
				<h2>Not soon:</h2>
				{data.notSoon.flatMap((item) => filterItem(item, 'notSoon'))}
				<h2>Inactive:</h2>
				{data.inactive.flatMap((item) => filterItem(item, 'inactive'))}
			</ul>
		</>
	);
}
