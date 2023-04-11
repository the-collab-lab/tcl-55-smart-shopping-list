import { useState } from 'react';
import { addItem } from '../api/firebase';

export function AddItem() {
	const [timeframe, setTimeframe] = useState('soon');
	const [itemName, setItemName] = useState('');

	const onChange = (e) => setTimeframe(e.target.value);

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
			}}
		>
			<div
				style={{
					border: 'none',
					padding: 0,
					paddingBottom: '1.5rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<label htmlFor="itemName">Item name:</label>
				<input
					type="text"
					name="itemName"
					value={itemName}
					onChange={onChange}
				></input>
			</div>
			<fieldset
				style={{
					border: 'none',
					padding: 0,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
				}}
			>
				<label htmlFor="timeframe" style={{ gridColumn: 'span 2' }}>
					How soon will you buy this again?
				</label>

				<input
					type="radio"
					name="timeframe"
					value="Soon"
					id="soon"
					checked={timeframe === 'Soon'}
					onChange={onChange}
				/>

				<label htmlFor="soon">Soon</label>

				<input
					type="radio"
					name="timeframe"
					value="Kind of Soon"
					id="kindOfSoon"
					checked={timeframe === 'Kind of Soon'}
					onChange={onChange}
				/>

				<label htmlFor="kindOfSoon">Kind of Soon</label>

				<input
					type="radio"
					name="timeframe"
					value="Not Soon"
					id="notSoon"
					checked={timeframe === 'Not Soon'}
					onChange={onChange}
				/>
				<label htmlFor="notSoon">Not Soon</label>
			</fieldset>
			<button type="submit">Add Item</button>
		</form>
	);
}
