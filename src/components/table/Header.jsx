import React from 'react';

const Header = ({ titles }) => {
	return (
		<thead>
			<tr>
				{titles.map(title => {
					return <th key={title}>{title}</th>;
				})}
			</tr>
		</thead>
	);
};

export default Header;
