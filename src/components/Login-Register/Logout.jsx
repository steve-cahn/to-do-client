import { useEffect } from 'react';
import auth from '../../services/authService';

const Logout = () => {
	useEffect(() => {
		async function logoutHandler() {
			try {
				await auth.logout();
				window.location = '/';
			} catch (error) {
				console.error(error);
			}
		}
		logoutHandler();
	}, []);

	return null;
};

export default Logout;
