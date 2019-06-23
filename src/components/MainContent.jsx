import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import actions from '../store/actions';

import SideBar from './SideBar';
import { getAllToDos, getCompleted, getIncompleted } from '../services/routes';
import Table from './table/Table';

const MainContent = props => {
	const [toDoListData, setToDoListData] = useState(['initial']);
	const [tableData, setTableData] = useState('initial');

	const [isMounted, setMounted] = useState(false);

	const urlPath = props.location.pathname.split('/')[1];

	const searchOptions = {
		shouldSort: true,
		threshold: 0.3,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: ['name']
	};
	const fuse = new Fuse(toDoListData, searchOptions);

	useEffect(() => {
		const searchResults = fuse.search(props.searchQuery);

		if (!props.searchQuery || props.searchQuery === '') {
			setTableData(toDoListData);
		} else {
			setTableData(searchResults);
		}
	}, [props.searchQuery]);

	useEffect(() => {
		setMounted(true);

		return () => {
			setMounted(false);
		};
	}, []);

	useEffect(() => {
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });

		if (!props.user || props.user.name === '') return;

		const fetchData = async () => {
			try {
				let result;
				switch (urlPath) {
					case 'completed':
						result = await getCompleted();
						break;
					case 'all':
						result = await getAllToDos();
						break;
					default:
						result = await getIncompleted();
						break;
				}

				if (isMounted) setToDoListData(result.data);
			} catch (error) {}
		};

		fetchData();
	}, [urlPath, isMounted, props.user]);

	useEffect(() => setTableData(toDoListData), [toDoListData]);

	const renderMain = () => {
		if (!props.user) {
			return <NotLoggedIn />;
		} else if (!toDoListData.length && urlPath !== 'add') {
			return (
				<div className='main-full-message'>
					<h3>You don't have any items.</h3>
					<h4>
						Let's change that by{' '}
						<Link to='/add'>adding an item</Link>
					</h4>
				</div>
			);
		}

		return (
			<>
				<Table
					location={props.location}
					_userId={props.user._id}
					toDoListData={toDoListData}
					setToDoListData={setToDoListData}
					tableData={tableData}
					urlPath={urlPath}
				/>
			</>
		);
	};

	return (
		<div className='to-do'>
			<SideBar />
			{renderMain()}
		</div>
	);
};

const NotLoggedIn = () => {
	return (
		<div className='main-full-message'>
			<h3>
				Please <Link to='/login'>login here</Link> to view your to do
				lists.
			</h3>
			<h4>
				If you don't have an account with us, you can{' '}
				<Link to='/register'>register</Link> here.
			</h4>
		</div>
	);
};

function mapStateToProps(state) {
	return {
		user: state.user,
		searchQuery: state.searchQuery
	};
}

function mapDispatchtoProps(dispatch) {
	return {
		setMessage: article => dispatch(actions.setMessage(article))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchtoProps
)(MainContent);
