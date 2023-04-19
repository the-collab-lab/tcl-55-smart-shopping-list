import { useEffect, useState } from 'react';
import { ListItem } from '../components';

export function List({ data }) {
	const [searchInput, setSearchInput] = useState('');
	const [filteredData, setFilteredData] = useState([]);

	console.log('filtered Data', filteredData);

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
		console.log(filteredData);
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
				<button type="reset" name="clear" onClick={handleClear}>
					Clear Filter
				</button>
			</form>
			<ul>
				{filteredData.map((item) => (
					<ListItem key={item.id} name={item.name} />
				))}
			</ul>
		</>
	);
}
