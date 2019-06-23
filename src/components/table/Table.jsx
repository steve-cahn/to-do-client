import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Body from './Body';
import Header from './Header';

import './table.scss';

const Table = props => {
	let [headerTitles, setHeaderTitles] = useState([]);

	useEffect(() => {
		let titles = ['Task'];

		if (props.windowWidth > 900) {
			titles.push('Date Created', 'Status', 'Delete');
		} else if (props.windowWidth > 767) titles.push('Status', 'Delete');
		else titles.push('Action');

		setHeaderTitles(titles);
	}, [headerTitles]);

	return (
		<table>
			<Header titles={headerTitles} />
			<TableContent
				urlPath={props.urlPath}
				setToDoListData={props.setToDoListData}
				toDoListData={props.toDoListData}
				tableData={props.tableData}
				_userId={props._userId}
			/>
		</table>
	);
};

const TableContent = props => {
	if (props.toDoListData[0] === 'initial') {
		return (
			<tbody className='empty'>
				{[...Array(7)].map((nothing, i) => {
					return <SingleRowPlaceHolder key={`tdItems${i}`} />;
				})}
			</tbody>
		);
	}

	return (
		<Body
			urlPath={props.urlPath}
			setToDoListData={props.setToDoListData}
			toDoListData={props.toDoListData}
			tableData={props.tableData}
			_userId={props._userId}
		/>
	);
};

const SingleRowPlaceHolder = () => {
	return (
		<tr>
			{[...Array(4)].map((nothing, i) => {
				return (
					<td className='cell' key={`tdItem${i}`}>
						<span />
					</td>
				);
			})}
		</tr>
	);
};

function mapStateToProps(state) {
	return { windowWidth: state.windowWidth };
}

export default connect(mapStateToProps)(Table);
