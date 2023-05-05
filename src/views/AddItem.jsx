import { useEffect, useState } from 'react';
import { addItem } from '../api/firebase';

export function AddItem({ data, listId }) {
	const [timeframe, setTimeframe] = useState('7');
	const [itemName, setItemName] = useState('');
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setMessages([]);
		}, 3000);

		return () => clearTimeout(timer);
	}, [messages]);

	const onTimeChange = (e) => setTimeframe(e.target.value);
	const onItemChange = (e) => setItemName(e.target.value);

	// function to validate itemName input that returns error messages if any - called onFormSubmit
	function validateItemInput(data, trimmedItemName) {
		// 1- checks for empty inputs

		if (!trimmedItemName) {
			return ['Please enter an item name.'];
		}

		const errArray = [];

		// 2- checks for invalid characters

		if (trimmedItemName.search(/[^a-z0-9'&-\s]/i) !== -1) {
			errArray.push(
				`Please enter an item name that is alphanumeric or includes ', -, and &.`,
			);
		}

		const normalizedItemName = trimmedItemName
			.replace(/[^a-z0-9'&-]/gi, '')
			.toLowerCase();

		const potentialMatch = data.find(
			(item) =>
				item.name.replaceAll(' ', '').toLowerCase() === normalizedItemName,
		);

		// 3- checks for potential match including exact match and match after removing special characters and spaces

		if (potentialMatch) {
			errArray.push(
				`${trimmedItemName} is already on your list as ${potentialMatch.name}.`,
			);
		}

		return errArray;
	}

	const onFormSubmit = async (e) => {
		e.preventDefault();
		const trimmedItemName = itemName.trim();

		const errArray = validateItemInput(data, trimmedItemName);
		if (errArray.length) {
			setMessages(errArray);
			return;
		}

		const result = await addItem(listId, {
			itemName: trimmedItemName,
			daysUntilNextPurchase: timeframe,
		});
		if (result) {
			setMessages([`Added ${trimmedItemName} to your list.`]);
			setItemName('');
			setTimeframe('7');
		} else {
			setMessages(['Error adding item, please try again.']);
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

			{messages.length > 0 &&
				messages.map((msg, index) => (
					<p key={`error-message-${index}`}>{msg}</p>
				))}
		</form>
	);
}
