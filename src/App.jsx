import { useEffect, useState } from 'react';
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	RouterProvider,
} from 'react-router-dom';

import { Home, Layout, List } from './views';
import { getItemData, streamListItems } from './api';
import { useStateWithStorage } from './utils';
import { ArchivalNoticeModal } from '@the-collab-lab/shopping-list-utils';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './utils/theme';
import '@fontsource/playfair-display';
import '@fontsource/ysabeau';

export function App() {
	const [data, setData] = useState([]);
	/**
	 * Here, we're using a custom hook to create `listToken` and a function
	 * that can be used to update `listToken` later.
	 *
	 * `listToken` is `my test list` by default so you can see the list
	 * of items that was prepopulated for this project.
	 * You'll later set it to `null` by default (since new users do not
	 * have tokens), and use `setListToken` when you allow a user
	 * to create and join a new list.
	 */
	const [listToken, setListToken] = useStateWithStorage(
		null,
		'tcl-shopping-list-token',
	);

	useEffect(() => {
		if (!listToken) return;

		/**
		 * streamListItems` takes a `listToken` so it can commuinicate
		 * with our database, then calls a callback function with
		 * a `snapshot` from the database.
		 *
		 * Refer to `api/firebase.js`.
		 */
		return streamListItems(listToken, (snapshot) => {
			/**
			 * Here, we read the documents in the snapshot and do some work
			 * on them, so we can save them in our React state.
			 *
			 * Refer to `api/firebase.js`
			 */
			const nextData = getItemData(snapshot);

			/** Finally, we update our React state. */
			setData(nextData);
		});
	}, [listToken]);

	const browserRouter = createBrowserRouter(
		createRoutesFromElements(
			<Route
				path="/"
				element={
					<>
						<ArchivalNoticeModal />
						<Layout />
					</>
				}
			>
				<Route
					index
					element={
						!listToken ? (
							<Home handleListTokenState={setListToken} />
						) : (
							<Navigate to="/list" />
						)
					}
				/>
				<Route
					path="/list"
					element={
						listToken ? (
							<List data={data} listId={listToken} />
						) : (
							<Navigate to="/" />
						)
					}
				/>
			</Route>,
		),
	);

	return (
		<ChakraProvider
			theme={theme}
			toastOptions={{ defaultOptions: { position: 'top' } }}
		>
			<RouterProvider router={browserRouter} />
		</ChakraProvider>
	);
}
