import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export function Home({ handleListTokenState }) {
	const navigate = useNavigate();

	const handleCreateList = () => {
		const newToken = generateToken();
		handleListTokenState(newToken);
		navigate('/list');
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={handleCreateList}>Create a new list</button>
		</div>
	);
}
