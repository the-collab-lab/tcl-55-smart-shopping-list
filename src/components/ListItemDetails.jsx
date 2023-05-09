import './ListItem.css';

export function ListItemDetails({
	totalPurchases,
	lastPurchasedDate,
	nextPurchasedDate,
}) {
	return (
		<div>
			{lastPurchasedDate ? (
				<p>You have purchased this item {totalPurchases} times</p>
			) : (
				<p>You have not yet purchased this item.</p>
			)}
			{lastPurchasedDate && <p>Last purchased: {lastPurchasedDate}</p>}
			<p>Next purchased: {nextPurchasedDate}</p>
		</div>
	);
}
