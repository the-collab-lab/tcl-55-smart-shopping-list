import {
	addDoc,
	collection,
	doc,
	increment,
	onSnapshot,
	updateDoc,
	deleteDoc,
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

function compareItemUrgency(item1, item2) {
	if (item1.daysUntilPurchase < item2.daysUntilPurchase) {
		return -1;
	} else if (item1.daysUntilPurchase > item2.daysUntilPurchase) {
		return 1;
	}
	if (item1.name.toLowerCase() < item2.name.toLowerCase()) {
		return -1;
	}
	return 0;
}

export function comparePurchaseUrgency(data) {
	const today = new Date();
	const categorizedItems = data.reduce(
		(acc, item) => {
			const { dateCreated, dateNextPurchased, dateLastPurchased } = item;
			const daysUntilNextPurchase = getDaysBetweenDates(
				today,
				dateNextPurchased.toDate(),
			);
			const daysSinceLastPurchase = getDaysBetweenDates(
				today,
				dateLastPurchased?.toDate() ?? dateCreated.toDate(),
			);
			item.daysUntilPurchase = daysUntilNextPurchase;
			if (dateNextPurchased.toDate().getTime() < today.getTime()) {
				item.daysUntilPurchase *= -1;
			}

			let category;
			if (daysSinceLastPurchase > 60) {
				category = 'Inactive';
			} else if (today.getTime() > dateNextPurchased.toDate().getTime()) {
				category = 'Overdue';
			} else if (daysUntilNextPurchase <= 7) {
				category = 'Soon';
			} else if (daysUntilNextPurchase < 30) {
				category = 'Kind Of Soon';
			} else if (daysUntilNextPurchase >= 30) {
				category = 'Not Soon';
			}

			acc[category].push(item);
			return acc;
		},
		{
			Overdue: [],
			Soon: [],
			'Kind Of Soon': [],
			'Not Soon': [],
			Inactive: [],
		},
	);

	const sortedCategorizedItems = Object.entries(categorizedItems).reduce(
		(acc, [category, items]) => {
			acc[category] = [...items].sort(compareItemUrgency);
			return acc;
		},
		{},
	);

	return sortedCategorizedItems;
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

export async function updateItem(listId, item) {
	const {
		id,
		dateCreated,
		dateLastPurchased,
		dateNextPurchased,
		totalPurchases,
	} = item;
	const docRef = doc(db, listId, id);
	// We need to use some data from the document for our future purchase estimates.
	const today = new Date();
	const newTotalPurchases = totalPurchases + 1;

	// If the user has never purchased this item before, we'll use the date
	// it was created as the date of the last purchase.
	const daysBetweenPurchases = getDaysBetweenDates(
		dateLastPurchased?.toDate() ?? dateCreated.toDate(),
		today,
	);

	// If the user has never purchased this item before then we will pass
	// in an undefined value and previousEstimate will return undefined,
	// which calculateEstimate will change to 14.
	const previousEstimate = getDaysBetweenDates(
		dateLastPurchased?.toDate(),
		dateNextPurchased.toDate(),
	);
	const newEstimateDate = getFutureDate(
		calculateEstimate(
			previousEstimate,
			daysBetweenPurchases,
			newTotalPurchases,
		),
	);
	await updateDoc(docRef, {
		dateLastPurchased: today,
		dateNextPurchased: newEstimateDate,
		totalPurchases: increment(1),
	});
}

export async function deleteItem(listId, item) {
	try {
		await deleteDoc(doc(db, listId, item));
	} catch (error) {
		return false;
	}
	return true;
}
