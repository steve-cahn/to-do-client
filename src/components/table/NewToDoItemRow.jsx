import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addToDoItem } from '../../services/routes';
import actions from '../../store/actions';

const NewToDoItemRow = ({
	setToDoListData,
	toDoListData,
	_userId,
	windowWidth,
	setMessage
}) => {
	// State
	const [nameInput, setNameInput] = useState('');

	const addItemToListHandler = async name => {
		const prevToDoList = { ...toDoListData };
		const newItem = {
			_userId,
			name,
			isCompleted: false,
			dateAdded: new Date().toISOString()
		};

		setNameInput('');
		setToDoListData([newItem, ...toDoListData]);

		try {
			await addToDoItem(newItem);
		} catch (error) {
			setMessage({
				text:
					'There was a problem adding your tasks. Please reload the page and try again.',
				type: 'error'
			});
			setToDoListData(prevToDoList);
			console.error(error);
		}
	};

	const addToDoItemHandler = async e => {
		// Check if the enter key was click on, or if the button was clicked
		if (e.keyCode === 13 || e.target.type === 'submit') {
			nameInput && addItemToListHandler(nameInput);
		}
	};

	return (
		<tr className='new-to-do-item-row'>
			<td
				className='cell'
				{...windowWidth <= 1100 && windowWidth > 767 && { colSpan: 2 }}
			>
				<input
					type='text'
					placeholder='To Do Item'
					onKeyDown={addToDoItemHandler}
					onChange={e => setNameInput(e.target.value)}
					value={nameInput}
				/>
			</td>
			{windowWidth > 1100 && <td className='cell'>Now</td>}
			<td className='cell'>
				<button className='button' onClick={addToDoItemHandler}>
					Add Item
				</button>
			</td>
		</tr>
	);
};

function mapStateToProps(state) {
	return {
		windowWidth: state.windowWidth
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setMessage: article => dispatch(actions.setMessage(article))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewToDoItemRow);
