import { updateItem } from '../api/firebase';
import { isWithinLastDay } from '../utils/dates';
import './ListItem.css';

export function ListItem({ item, listId, urgency }) {
	const { id, name } = item;

	const handlePurchase = async (e) => {
		if (e.target.checked) {
			await updateItem(listId, item);
		}
	};

	const urgencyColors = {
		overdue: 'purple',
		soon: 'red',
		kindOfSoon: 'orange',
		notSoon: 'yellow',
		inactive: 'gray',
	};

	return (
		<li className="ListItem">
			<input
				type="checkbox"
				id={`mark-${name}-purchased-id-${id}`}
				onChange={handlePurchase}
				checked={isWithinLastDay(item.dateLastPurchased)}
				style={{
					backgroundColor: urgencyColors[urgency],
				}}
			/>
			<label htmlFor={`mark-${name}-purchased-id-${id}`}>{name}</label>
		</li>
	);
}
