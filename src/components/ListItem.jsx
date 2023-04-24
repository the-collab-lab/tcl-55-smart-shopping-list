import './ListItem.css';

//  1. Checking off the item in the UI also updates the dateLastPurchased and
//			totalPurchases properties on the corresponding Firestore document
// 2. The item is shown as checked for 24 hours after the purchase is made
//			(i.e. we assume the user does not need to buy the item again for at least 1 day).
//			After 24 hours, the item unchecks itself so the user can buy it again.
// 3. The updateItem function in firebase.js has been filled out,
//			and sends updates to the firestore database when an item is checked or un-checked

export function ListItem({ name }) {
	return (
		<li className="ListItem">
			<input type="checkbox" id="mark-purchased" />
			<label htmlFor="mark-purchased">{name}</label>
		</li>
	);
}
