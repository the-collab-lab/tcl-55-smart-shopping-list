export function ListItemDetails({
	totalPurchases,
	lastPurchasedDate,
	nextPurchasedDate,
}) {
	return (
		<section>
			{lastPurchasedDate ? (
				<>
					<p>
						You have purchased this item {totalPurchases} time
						{totalPurchases > 1 ? 's' : ''}
					</p>
					<p>Last purchased: {lastPurchasedDate}</p>
				</>
			) : (
				<p>You have not yet purchased this item.</p>
			)}
			<p>Next purchased: {nextPurchasedDate}</p>
		</section>
	);
}
