import React from 'react';

import { NavLink } from 'react-router-dom';

import {
	FormatListBulleted,
	FormatListNumbered,
	PlaylistAdd
} from '@material-ui/icons';

import AddList from '../images/icons/add-list.jsx';

import './sidebar.scss';

const SideBar = () => {
	return (
		<div className='side-bar'>
			<ul>
				<li>
					<NavLink exact to='/'>
						<FormatListBulleted />
						<span>To Do List</span>
					</NavLink>
				</li>
				<li className='selected'>
					<NavLink to='/add'>
						<PlaylistAdd />
						<span>Add To Do Item</span>
					</NavLink>
				</li>
				<li>
					<NavLink to='/completed'>
						<AddList />
						<span>Competed List</span>
					</NavLink>
				</li>
				<li>
					<NavLink to='/all'>
						<FormatListNumbered />
						<span>List Overview</span>
					</NavLink>
				</li>
			</ul>
		</div>
	);
};

export default SideBar;
