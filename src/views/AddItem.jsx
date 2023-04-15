import { useEffect, useState } from 'react';
import { addItem } from '../api/firebase';

export function AddItem({ listId }) {
	const [timeframe, setTimeframe] = useState('7');
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
	const onFormSubmit = async (e) => {
		e.preventDefault();
		// Make sure the user has entered an item name
		if (!itemName) {
			setMessage('Please enter an item name');
			return;
		}

		const result = await addItem(listId, {
			itemName,
			daysUntilNextPurchase: timeframe,
		});
		if (result) {
			setMessage(`Added ${itemName} to your list.`);
			setItemName('');
			setTimeframe(7);
		} else {
			setMessage('Error adding item, please try again.');
		}
	};

	return (
		<form onSubmit={onFormSubmit}>
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
					id="itemName"
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
				<legend
					htmlFor="timeframe"
					style={{ padding: 0, gridColumn: 'span 2' }}
				>
					How soon will you buy this again?
				</legend>

				<input
					type="radio"
					name="timeframe"
					value={7}
					id="soon"
					checked={timeframe === '7'}
					onChange={onTimeChange}
				/>

				<label htmlFor="soon">Soon</label>

				<input
					type="radio"
					name="timeframe"
					value={14}
					id="kindOfSoon"
					checked={timeframe === '14'}
					onChange={onTimeChange}
				/>

				<label htmlFor="kindOfSoon">Kind of Soon</label>

				<input
					type="radio"
					name="timeframe"
					value={30}
					id="notSoon"
					checked={timeframe === '30'}
					onChange={onTimeChange}
				/>
				<label htmlFor="notSoon">Not Soon</label>
			</fieldset>
			<button type="submit">Add Item</button>
			{message && <p>{message}</p>}
		</form>
	);
}
