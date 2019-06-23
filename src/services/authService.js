import http from './http';
import jwtDecode from 'jwt-decode';

const apiUrl = '/api/users';

function login(email, password) {
	return http.post(`${apiUrl}/auth`, { email, password });
}

function logout() {
	http.get(`${apiUrl}/logout`);
}

function verify(id, hash) {
	return http.get(`${apiUrl}/${id}/verify/${hash}`);
}

function resendVerification(_id) {
	return http.post(`${apiUrl}/verify/resend`, { _id });
}

const sendResetPasswordEmail = email => {
	return http.post(`/api/reset-password/send-email`, { email });
};

const resetPassword = (email, hash, password) => {
	return http.put(`/api/reset-password/reset`, { email, hash, password });
};

function decodeJWT(token) {
	if (!token) return null;

	return jwtDecode(token);
}

async function getCurrentUser() {
	const { data: jwt } = await http.get(`${apiUrl}/me`);
	return decodeJWT(jwt);
}

export default {
	login,
	logout,
	verify,
	resendVerification,
	sendResetPasswordEmail,
	resetPassword,
	decodeJWT,
	getCurrentUser
};
