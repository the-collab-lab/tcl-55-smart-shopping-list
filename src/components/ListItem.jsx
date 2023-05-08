import { useState } from 'react';
import { updateItem } from '../api/firebase';
import { isWithinLastDay } from '../utils/dates';
import './ListItem.css';

export function ListItem({ item, listId, handleDeleteItem }) {
	const [showDetails, setShowDetails] = useState(false);
	const { id, name, totalPurchases } = item;

	//TODO: get purchase date data from firestore
	/* const lastPurchasedDate = item.dateLastPurchased.toDate();
	const nextPurchasedDate = item.dateNextPurchased.toDate(); */

	const handlePurchase = async (e) => {
		if (e.target.checked) {
			await updateItem(listId, item);
		}
	};

	const handleShowDetails = () => {
		setShowDetails(!showDetails);
		console.log(item);
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
					value={item.id}
					style={{ marginLeft: '.5rem' }}
				>
					Delete
				</button>
			</li>
			{showDetails && (
				<div>
					{/* <p>Last purchased: {dateLastPurchased}</p>
					<p>Next purchased: {dateNextPurchased}</p> */}
					<p>You have purchased this item {totalPurchases} times</p>
				</div>
			)}
		</>
	);
}
