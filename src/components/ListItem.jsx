import { useState } from 'react';
import { updateItem, deleteItem } from '../api/firebase';
import { isWithinLastDay } from '../utils/dates';
import { ListItemDetails } from './ListItemDetails';

export function ListItem({ item, listId, handleDeleteConfirmation, urgency }) {
	const [showDetails, setShowDetails] = useState(false);
	const { id, name, dateLastPurchased, dateNextPurchased, totalPurchases } =
		item;

	const lastPurchasedDate = dateLastPurchased?.toDate().toDateString();
	const nextPurchasedDate = dateNextPurchased?.toDate().toDateString();

	const handlePurchase = async (e) => {
		if (e.target.checked) {
			await updateItem(listId, item);
		}
	};

	const handleShowDetails = () => {
		setShowDetails(!showDetails);
	};

	const handleDeleteItem = async () => {
		if (window.confirm(`Are you sure you want to delete ${name}?`)) {
			const result = await deleteItem(listId, id);
			handleDeleteConfirmation(result, name);
		}
	};

	const urgencyColors = {
		Overdue: 'purple',
		Soon: 'red',
		'Kind Of Soon': 'orange',
		'Not Soon': 'yellow',
		Inactive: 'gray',
	};

	return (
		<>
			<li className="ListItem" style={{ display: 'block' }}>
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
				<button
					type="button"
					name="details"
					onClick={handleShowDetails}
					style={{ marginLeft: '.5rem' }}
				>
					Details
				</button>
				<button
					type="button"
					name="delete"
					onClick={handleDeleteItem}
					style={{ marginLeft: '.5rem' }}
				>
					Delete
				</button>
				{showDetails && (
					<ListItemDetails
						totalPurchases={totalPurchases}
						lastPurchasedDate={lastPurchasedDate}
						nextPurchasedDate={nextPurchasedDate}
					/>
				)}
			</li>
		</>
	);
}
