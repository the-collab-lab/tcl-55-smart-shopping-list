import { useEffect, useState } from 'react';
import { ListItem } from '../components';

export function List({ data, listId }) {
	const [searchInput, setSearchInput] = useState('');
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	const handleSearchInput = (e) => {
		const text = e.target.value;
		setSearchInput(text);
		setFilteredData(
			data.filter((item) =>
				item.name.toLowerCase().includes(text.toLowerCase()),
			),
		);
	};

	const handleClear = () => {
		setSearchInput('');
		setFilteredData(data);
	};

	const handleFormSubmit = (e) => e.preventDefault();

	return (
		<>
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
			<ul>
				{filteredData.map((item) => (
					<ListItem key={item.id} listId={listId} item={item} />
				))}
			</ul>
		</>
	);
}
