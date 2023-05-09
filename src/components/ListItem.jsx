import { useState } from 'react';
import { updateItem, deleteItem } from '../api/firebase';
import { isWithinLastDay } from '../utils/dates';
import './ListItem.css';
import { ListItemDetails } from './ListItemDetails';

export function ListItem({ item, listId }) {
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
		if (window.confirm('Are you sure you want to delete this item?')) {
			const result = await deleteItem(listId, id);
			if (result) {
				alert(`${name} has successfully been deleted!`);
			} else alert(`Error deleting ${name}, please try again.`);
		}
	};

	return (
		<>
			<li className="ListItem">
				<input
					type="checkbox"
					id={`mark-${name}-purchased-id-${id}`}
					onChange={handlePurchase}
					checked={isWithinLastDay(item.dateLastPurchased)}
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
			</li>
			{showDetails && (
				<ListItemDetails
					totalPurchases={totalPurchases}
					lastPurchasedDate={lastPurchasedDate}
					nextPurchasedDate={nextPurchasedDate}
				/>
			)}
		</>
	);
}
