import { createStore } from 'redux';
import constants from '../constants/action-types';

const initialState = {
	message: {},
	user: {},
	searchQuery: '',
	windowWidth: window.innerWidth
};
const store = createStore(reducer);

function reducer(state = initialState, action) {
	if (action.type === constants.MESSAGE) {
		return { ...state, message: action.message };
	} else if (action.type === constants.USER) {
		return { ...state, user: action.user };
	} else if (action.type === constants.SEARCH_QUERY) {
		return { ...state, searchQuery: action.searchQuery };
	} else if (action.type === constants.WINDOW_WIDTH) {
		return { ...state, windowWidth: action.windowWidth };
	}

	return state;
}

export default store;
