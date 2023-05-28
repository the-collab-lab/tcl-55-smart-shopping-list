import { Outlet } from 'react-router-dom';

export function Layout() {
	return (
		<>
			<div className="Layout">
				<main className="Layout-main">
					<Outlet />
				</main>
			</div>
		</>
	);
}
