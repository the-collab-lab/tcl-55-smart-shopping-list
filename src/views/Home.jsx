import { useEffect } from 'react';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import './Home.css';
import { useState } from 'react';
import { streamListItems } from '../api';

export function Home({ handleListTokenState }) {
	const [userEnteredToken, setUserEnteredToken] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			setMessage(null);
		}, 3000);

		return () => clearTimeout(timer);
	}, [message]);

	const handleCreateList = () => {
		const newToken = generateToken();
		handleListTokenState(newToken);
	};

	const handleChange = (e) => setUserEnteredToken(e.target.value);
	const handleFormSubmit = (e) => {
		e.preventDefault();
		streamListItems(userEnteredToken, (snapshot) => {
			if (snapshot.empty) {
				setMessage('List not found. Please try another token.');
			} else {
				handleListTokenState(userEnteredToken);
			}
		});
	};

	return (
		<div
			className="Home"
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '1rem',
			}}
		>
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={handleCreateList}>Create a new list</button>
			<p>or</p>
			<form
				onSubmit={handleFormSubmit}
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '1rem',
				}}
			>
				<label htmlFor="join-list">Join an existing list</label>
				<input
					type="text"
					id="join-list"
					value={userEnteredToken}
					onChange={handleChange}
				/>
				<button>Join</button>
				{message && <p>{message}</p>}
			</form>
		</div>
	);
}
