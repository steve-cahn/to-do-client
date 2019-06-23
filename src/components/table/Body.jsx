import React from 'react';

import NewToDoItemRow from './NewToDoItemRow';
import SingleRow from './SingleRow';

const Body = props => {
	const isAddItemPage = props.urlPath === 'add';

	return (
		<tbody>
			{isAddItemPage && (
				<NewToDoItemRow
					history={props.history}
					setToDoListData={props.setToDoListData}
					tableData={props.tableData}
					toDoListData={props.toDoListData}
					_userId={props._userId}
				/>
			)}

			{props.tableData.map((currentRowData, index) => {
				return (
					<SingleRow
						urlPath={props.urlPath}
						key={currentRowData._id || index}
						currentRowData={currentRowData}
						setToDoListData={props.setToDoListData}
						tableData={props.tableData}
					/>
				);
			})}
		</tbody>
	);
};

export default Body;
