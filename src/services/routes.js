import http from './http';

const urlPath = '/api/ToDos';

const testRoute = () => {
	return http.get(`${urlPath}/test`);
};

const getAllToDos = () => {
	return http.get(urlPath);
};

const getCompleted = () => {
	return http.get(`${urlPath}/filter/completed`);
};

const getIncompleted = () => {
	return http.get(`${urlPath}/filter/incompleted`);
};

const addToDoItem = newItem => {
	return http.post(urlPath, { ...newItem });
};

const updateToDoItem = updatedItem => {
	const toDoId = updatedItem._id;
	delete updatedItem._id;
	return http.put(`${urlPath}/${toDoId}`, updatedItem);
};

const deleteToDoItem = rowID => {
	return http.delete(`${urlPath}/${rowID}`);
};

const uploadImage = fileName => {
	return http.post('/api/aws/upload-image', fileName);
};

export {
	testRoute,
	getAllToDos,
	getCompleted,
	getIncompleted,
	addToDoItem,
	updateToDoItem,
	deleteToDoItem,
	uploadImage
};
