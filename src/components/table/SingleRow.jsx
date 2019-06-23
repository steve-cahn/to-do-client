import React from 'react';
import moment from 'moment';
import cloneDeep from 'clone-deep';
import { connect } from 'react-redux';
import actions from '../../store/actions';

import { updateToDoItem, deleteToDoItem } from '../../services/routes';

const SingleRow = props => {
	const { currentRowData, setToDoListData, tableData } = props;

	/**
	 * If it's less than 12 hours, it shows the time it was created.
	 * else if it was more than 12 hours, it displays the date
	 */
	const formatDate = selectedDate => {
		// Converts the selected date to a moment format
		const mSelectedDate = moment(selectedDate);
		// Gets current date and goes back 12 hours
		const currentBefore12H = moment().subtract(12, 'hours');
		// bolean value of whether the selected date is before 12 hours or not
		const isBefore12H = mSelectedDate.isBefore(currentBefore12H);
		// Kind of time/date format
		const momentFormat = isBefore12H ? 'MMMM DD, YYYY' : 'h:mm A';

		return mSelectedDate.format(momentFormat);
	};

	const updateRowDataHandler = async currentRowData => {
		const _tableData = cloneDeep(tableData);
		const originalDoToListData = cloneDeep(tableData);
		const index = tableData.indexOf(currentRowData);

		currentRowData.isCompleted = true;

		_tableData[index] = { ...currentRowData };

		setToDoListData([..._tableData]);

		if (props.urlPath !== 'all') {
			setTimeout(() => {
				_tableData.splice(index, 1);
				setToDoListData([..._tableData]);
			}, 1000);
		}
		try {
			await updateToDoItem(currentRowData);
		} catch (error) {
			props.setMessage({
				text:
					'There was a problem marking your task as complete. Please reload the page and try again.',
				type: 'error'
			});
			setToDoListData([...originalDoToListData]);
			console.log(error);
		}
	};

	const deleteHandler = async currentRowData => {
		const _tableData = cloneDeep(tableData);
		const originalDoToListData = cloneDeep(tableData);
		const index = tableData.indexOf(currentRowData);

		_tableData.splice(index, 1);
		setToDoListData([..._tableData]);
		try {
			await deleteToDoItem(currentRowData._id);
		} catch (error) {
			props.setMessage({
				text:
					'There was a problem deleting your task. Please reload the page and try again.',
				type: 'error'
			});
			setToDoListData([...originalDoToListData]);
			console.log(error);
		}
	};

	const IsCompleteHandler = isCompleted => {
		if (isCompleted) {
			return <span>Complete</span>;
		} else {
			return (
				<button onClick={() => updateRowDataHandler(currentRowData)}>
					Mark as Completed
				</button>
			);
		}
	};

	const DesktopRowComponent = () => {
		return (
			<>
				<td className='cell'>{formatDate(currentRowData.dateAdded)}</td>
				<td className='cell'>
					{IsCompleteHandler(currentRowData.isCompleted)}
				</td>
				<td className='cell'>
					<button onClick={() => deleteHandler(currentRowData)}>
						Delete
					</button>
				</td>
			</>
		);
	};

	const TabletRowComponent = () => {
		return (
			<>
				<td className='cell'>
					{IsCompleteHandler(currentRowData.isCompleted)}
				</td>
				<td className='cell'>
					<button onClick={() => deleteHandler(currentRowData)}>
						Delete
					</button>
				</td>
			</>
		);
	};

	const MobileRowComponent = () => {
		return (
			<>
				<td className='cell'>
					{IsCompleteHandler(currentRowData.isCompleted)}
					<button onClick={() => deleteHandler(currentRowData)}>
						Delete
					</button>
				</td>
			</>
		);
	};

	const RowComponent = () => {
		if (props.windowWidth > 900) return DesktopRowComponent();
		else if (props.windowWidth > 767) return TabletRowComponent();
		else return MobileRowComponent();
	};

	return (
		<tr>
			<td className='cell'>{currentRowData.name}</td>
			<RowComponent />
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
)(SingleRow);
