import { useEffect, useState } from 'react';
import { addItem } from '../api/firebase';

const timeframeToDays = {
	Soon: 7,
	'Kind of Soon': 14,
	'Not Soon': 30,
};

export function AddItem({ listId }) {
	const [timeframe, setTimeframe] = useState('soon');
	const [itemName, setItemName] = useState('');
	const [message, setMessage] = useState(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setMessage(null);
		}, 3000);

		return () => clearTimeout(timer);
	}, [message]);

	const onTimeChange = (e) => setTimeframe(e.target.value);
	const onItemChange = (e) => setItemName(e.target.value);

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();

				const result = addItem(listId, {
					itemName,
					daysUntilNextPurchase: timeframeToDays[timeframe],
				});
				if (result) {
					setMessage(`Added ${itemName} to your list.`);
					setItemName('');
					setTimeframe('Soon');
				} else {
					setMessage('Error adding item');
				}
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
					onChange={onItemChange}
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
					onChange={onTimeChange}
				/>

				<label htmlFor="soon">Soon</label>

				<input
					type="radio"
					name="timeframe"
					value="Kind of Soon"
					id="kindOfSoon"
					checked={timeframe === 'Kind of Soon'}
					onChange={onTimeChange}
				/>

				<label htmlFor="kindOfSoon">Kind of Soon</label>

				<input
					type="radio"
					name="timeframe"
					value="Not Soon"
					id="notSoon"
					checked={timeframe === 'Not Soon'}
					onChange={onTimeChange}
				/>
				<label htmlFor="notSoon">Not Soon</label>
			</fieldset>
			<button type="submit">Add Item</button>
			{message && <p>{message}</p>}
		</form>
	);
}
