const ONE_DAY_IN_MILLISECONDS = 86400000;

export function getDaysBetweenDates(date1, date2) {
	// If either date is not a date, return undefined.
	if (date1?.getTime() === undefined || date2?.getTime() === undefined) {
		return undefined;
	}
	const date1Milliseconds = date1.getTime();
	const date2Milliseconds = date2.getTime();
	const diff = Math.abs(date1Milliseconds - date2Milliseconds);

	return Math.ceil(diff / ONE_DAY_IN_MILLISECONDS);
}

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 * @example
 * // Returns a Date 3 days in the future
 * getFutureDate(3)
 * @param {number} offset
 */
export function getFutureDate(offset) {
	return new Date(Date.now() + offset * ONE_DAY_IN_MILLISECONDS);
}

export function isWithinLastDay(date) {
	if (!date) return false;
	const oneDayAgoInSeconds = (Date.now() - ONE_DAY_IN_MILLISECONDS) / 1000;
	const datePurchasedSeconds = date.seconds;

	return datePurchasedSeconds > oneDayAgoInSeconds;
}
