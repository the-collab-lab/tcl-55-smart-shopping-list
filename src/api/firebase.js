import {
	addDoc,
	collection,
	doc,
	getDoc,
	increment,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { db } from './config';
import { getDaysBetweenDates, getFutureDate } from '../utils';

/**
 * Subscribe to changes on a specific list in the Firestore database (listId), and run a callback (handleSuccess) every time a change happens.
 * @param {string} listId The user's list token
 * @param {Function} handleSuccess The callback function to call when we get a successful update from the database.
 * @returns {Function}
 *
 * @see https://firebase.google.com/docs/firestore/query-data/listen
 */
export function streamListItems(listId, handleSuccess) {
	const listCollectionRef = collection(db, listId);
	return onSnapshot(listCollectionRef, handleSuccess);
}

/**
 * Read the information from the provided snapshot and return an array
 * that can be stored in our React state.
 * @param {Object} snapshot A special Firebase document with information about the current state of the database.
 * @returns {Object[]} An array of objects representing the user's list.
 */
export function getItemData(snapshot) {
	/**
	 * Firebase document snapshots contain a `.docs` property that is an array of
	 * document references. We use `.map()` to iterate over them.
	 * @see https://firebase.google.com/docs/reference/js/firestore_.documentsnapshot
	 */
	return snapshot.docs
		.map((docRef) => {
			/**
			 * We call the `.data()` method to get the data
			 * out of the referenced document
			 */
			const data = docRef.data();

			/**
			 * The document's ID is not part of the data, but it's very useful
			 * so we get it from the document reference.
			 */
			data.id = docRef.id;

			return data;
		})
		.filter((item) => item.name !== null);
}

/**
 * Add a new item to the user's list in Firestore.
 * @param {string} listId The id of the list we're adding to.
 * @param {Object} itemData Information about the new item.
 * @param {string} itemData.itemName The name of the item.
 * @param {number} itemData.daysUntilNextPurchase The number of days until the user thinks they'll need to buy the item again.
 */
export async function addItem(listId, { itemName, daysUntilNextPurchase }) {
	try {
		const listCollectionRef = collection(db, listId);
		await addDoc(listCollectionRef, {
			dateCreated: new Date(),
			// NOTE: This is null because the item has just been created.
			// We'll use updateItem to put a Date here when the item is purchased!
			dateLastPurchased: null,
			dateNextPurchased: getFutureDate(daysUntilNextPurchase),
			name: itemName,
			totalPurchases: 0,
		});
	} catch (error) {
		return false;
	}
	return true;
}

export async function updateItem(listId, itemId) {
	const docRef = doc(db, listId, itemId);
	// We need to use some data from the document for our future purchase estimates.
	const docSnap = await getDoc(docRef);
	const today = new Date();

	if (docSnap.exists()) {
		const data = docSnap.data();
		// If the user has never purchased this item before, we'll use the date
		// it was created as the date of the last purchase.
		const daysBetweenPurchases = getDaysBetweenDates(
			data.dateLastPurchased?.toDate() ?? data.dateCreated.toDate(),
			today,
		);
		// If the user has never purchased this item before then we will pass
		// in an undefined value and previousEstimate will return 14 days, the
		// default used in calculateEstimate.
		const previousEstimate = getDaysBetweenDates(
			data.dateLastPurchased?.toDate(),
			data.dateNextPurchased.toDate(),
		);
		const newEstimateDate = getFutureDate(
			calculateEstimate(
				previousEstimate,
				daysBetweenPurchases,
				data.totalPurchases,
			),
		);
		await updateDoc(docRef, {
			dateLastPurchased: today,
			dateNextPurchased: newEstimateDate,
			totalPurchases: increment(1),
		});
	}
}

export async function deleteItem() {
	/**
	 * TODO: Fill this out so that it uses the correct Firestore function
	 * to delete an existing item. You'll need to figure out what arguments
	 * this function must accept!
	 */
}
