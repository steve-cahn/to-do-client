import http from './http';

const apiUrl = '/api/users';

function register(user) {
	return http.post(apiUrl, {
		name: user.name,
		email: user.email,
		password: user.password
	});
}

export default { register };
