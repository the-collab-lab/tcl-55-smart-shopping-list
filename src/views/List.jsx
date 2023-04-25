import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItem } from '../components';

export function List({ data }) {
	const navigate = useNavigate();

	const [searchInput, setSearchInput] = useState('');
	const [filteredData, setFilteredData] = useState([]);

	const trueData = data.filter((item) => item.name !== null);

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	const handleSearchInput = (e) => {
		const text = e.target.value;
		setSearchInput(text);
		setFilteredData(
			trueData.filter((item) =>
				item.name.toLowerCase().includes(text.toLowerCase()),
			),
		);
	};

	const handleClear = () => {
		setSearchInput('');
		setFilteredData(trueData);
	};

	const handleFormSubmit = (e) => e.preventDefault();

	const handleFirstItem = () => {
		navigate('/add-item');
	};

	return (
		<>
			{trueData.length === 0 && (
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

			{trueData.length !== 0 && (
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
				{filteredData.map((item) => (
					<ListItem key={item.id} name={item.name} />
				))}
			</ul>
		</>
	);
}
