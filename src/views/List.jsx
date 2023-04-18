import { useEffect, useState } from 'react';
import { ListItem } from '../components';

export function List({ data }) {
	const [searchInput, setSearchInput] = useState('');
	const [filteredData, setFilteredData] = useState([]);

	console.log('filtered Data', filteredData);

	//WIP
	/* useEffect =
		(() => {
			if (!filteredData) {
				showData(data);
			} else {
				showData(filteredData);
			}
		},
		[]); */

	const handleSearchInput = (e) => {
		const text = e.target.value.toLowerCase();
		setSearchInput(text);
		setFilteredData(
			data.filter((item) => item.name.toLowerCase().includes(text)),
		);
		console.log(filteredData);
	};

	// const handleClear = (e) => {
	// 	setSearchInput('');
	// 	setFilteredData(data);
	// };

	// WIP
	/* const showData = (dataSet) => {
		dataSet.map((item) => (
			<ul>
				<ListItem key={item.id} name={item.name} />
			</ul>
		));
	}; */

	return (
		<>
			<form>
				<label htmlFor="search">Filter Items</label>
				<input
					type="text"
					id="search"
					name="search"
					value={searchInput}
					onChange={handleSearchInput}
					placeholder="Start typing here..."
				></input>
				{/* <button type="reset" onClick={handleClear}>
					Clear Filter
				</button> */}
			</form>
			<ul>
				{filteredData.map((item) => (
					<ListItem key={item.id} name={item.name} />
				))}
			</ul>
		</>
	);
}
