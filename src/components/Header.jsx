import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import actions from '../store/actions';
import auth from '../services/authService';
import { NavLink, Link } from 'react-router-dom';
import avatar from '../images/profile.svg';
import { Search } from '@material-ui/icons';

import './header.scss';

const Header = props => {
	const { user, message, setMessage } = props;

	const [shouldShowDropDown, setShouldShowDropDown] = useState(false);
	const [imgAvatarSrc, setimgAvatarSrc] = useState();
	const [spacingHeight, setSpacingHeight] = useState('70');
	const inputRef = useRef(null);
	let hideDropdownTimer = null;

	// Mobile States

	useEffect(() => {
		if (user === null) setimgAvatarSrc(avatar);

		if (user && user.name !== '') {
			setimgAvatarSrc(user.imgURL);

			if (user.verified === false) {
				const _message = {
					text: (
						<span>
							Please verify acount by clicking on the link sent to
							your email.{' '}
							<button onClick={resendEmailHandler}>
								Resend Verification
							</button>
						</span>
					),
					type: 'warn'
				};
				setMessage(_message);
			}
		}
	}, [user]);

	useEffect(() => {
		headerHeightHandler();
	}, [message, props.windowWidth]);

	useEffect(() => {
		setShouldShowDropDown(false);
	}, [props.location]);

	const headerHeightHandler = () => {
		let spacingAmount = 70;
		if (message && message.text) spacingAmount += 42;
		if (props.windowWidth <= 500) spacingAmount += 60;

		setSpacingHeight(spacingAmount);
	};

	const resendEmailHandler = async () => {
		await auth.resendVerification(user._id);
		setMessage({ text: 'Email verification has been sent.', type: 'warn' });
	};

	const profileDropdownClassName = () => {
		return shouldShowDropDown ? 'dropdown open' : 'dropdown';
	};

	const showDropdown = () => {
		clearTimeout(hideDropdownTimer);
		setShouldShowDropDown(true);
	};

	const hideDropdown = () => {
		hideDropdownTimer = setTimeout(() => setShouldShowDropDown(false), 300);
	};

	const dropdownHandler = () => {
		if (user && user.name !== '') {
			return <LoggedInMenu name={user.name} />;
		} else {
			return <LoggedOutMenu />;
		}
	};

	const mobileEvents = () => {};

	return (
		<>
			<div className='header'>
				<div className='header-innerwrapper'>
					<h3 className='title'>
						<NavLink to='/'>To Do List</NavLink>
					</h3>

					<div className='search-container'>
						<input
							className='search-field'
							type='text'
							placeholder='Search for a Task'
							value={props.searchQuery}
							ref={inputRef}
							onChange={e => {
								if (
									props.location !== '/' &&
									props.location !== '/add' &&
									props.location !== '/completed' &&
									props.location !== '/all'
								) {
									props.history.push('/');
								}

								props.setSearchQuery(e.target.value);
							}}
						/>
						<Search />
					</div>

					<div
						className='profile-container'
						onMouseEnter={showDropdown}
						onMouseLeave={hideDropdown}
					>
						<div className='avatar-wrapper'>
							{imgAvatarSrc && (
								<img src={imgAvatarSrc} alt='Profile' />
							)}
						</div>
						<div className='arrow-down' />

						<div className={profileDropdownClassName()}>
							<div className='arrow-up' />
							<ul>{dropdownHandler()}</ul>
						</div>
					</div>
				</div>

				{message && message.text && (
					<div className={`message-container ${message.type}`}>
						<span className='message'>{message.text}</span>
						<button
							className='close'
							onClick={() => setMessage({})}
						>
							X
						</button>
					</div>
				)}
			</div>

			<div style={{ height: spacingHeight + 'px' }} />
		</>
	);
};

const LoggedInMenu = ({ name }) => {
	return (
		<>
			<li>
				<NavLink exact to='/'>
					To Do
				</NavLink>
			</li>
			<li>
				<NavLink to='/profile'>{name}'s Profile</NavLink>
			</li>
			<li>
				<Link to='/logout'>Logout</Link>
			</li>
		</>
	);
};

const LoggedOutMenu = () => {
	return (
		<>
			<li>
				<NavLink to='/register'>Register</NavLink>
			</li>
			<li>
				<NavLink to='/login'>Login</NavLink>
			</li>
		</>
	);
};

function mapStateToProps(state) {
	return {
		message: state.message,
		user: state.user,
		windowWidth: state.windowWidth
	};
}

function mapDispatchtoProps(dispatch) {
	return {
		setMessage: article => dispatch(actions.setMessage(article)),
		setUser: article => dispatch(actions.setUser(article)),
		setSearchQuery: article => dispatch(actions.setSearchQuery(article))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchtoProps
)(withRouter(Header));
