import constants from '../constants/action-types';

// Call it like this: props.setMessage({ text: 'hellos', type: 'success' });
const setMessage = message => ({
	type: constants.MESSAGE,
	message
});

const setUser = user => ({
	type: constants.USER,
	user
});

const setSearchQuery = searchQuery => ({
	type: constants.SEARCH_QUERY,
	searchQuery
});

const setWindowWidth = windowWidth => ({
	type: constants.WINDOW_WIDTH,
	windowWidth
});

export default {
	setMessage,
	setUser,
	setSearchQuery,
	setWindowWidth
};
