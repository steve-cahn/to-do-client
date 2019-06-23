import http from './http';

const urlPath = 'api/users';
const tokenTitle = 'x-auth-token';

const logoutHandler = () => {
	localStorage.removeItem(tokenTitle);
};

const setJWT = token => {
	localStorage.setItem(tokenTitle, token);
};

const getJWT = () => {
	return localStorage.getItem(tokenTitle);
};

const register = newUser => {
	return http.post(urlPath, { ...newUser });
};

const login = async existingUser => {
	const { data: jwt } = await http.post(`${urlPath}/auth`, existingUser);

	setJWT(jwt);
};

const updateProfile = user => {
	return http.put(`${urlPath}/${user._id}`, user);
};

export { register, login, setJWT, getJWT, logoutHandler, updateProfile };
