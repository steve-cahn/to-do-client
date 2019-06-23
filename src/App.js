import React, { useLayoutEffect, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import auth from './services/authService';

import { connect } from 'react-redux';
import actions from './store/actions';
import ProtectRoutes from './ProtectRoutes';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Profile from './components/Profile';
import MessageComponent from './components/MessageComponent';
import RegisterLogin from './components/Login-Register/Main';
import Logout from './components/Login-Register/Logout';

import './App.scss';
import './sass/defaultStyling.scss';
import './sass/reusableClasses.scss';

function App({ setUser, setWindowWidth }) {
	useLayoutEffect(() => {
		async function getCurrentUser() {
			const currentUser = await auth.getCurrentUser();
			setUser(currentUser);
		}

		getCurrentUser();
	}, []);

	useEffect(() => {
		window.addEventListener('resize', () => {
			setWindowWidth(window.outerWidth);
		});
	}, []);

	return (
		<div className='App'>
			<Header />

			<div id='main-site'>
				<Switch>
					<Route path='/profile' component={() => <Profile />} />
					<Route
						path='/(register|login)/'
						component={({ location }) => (
							<ProtectRoutes.LogoutProtectRoute
								location={location}
								component={RegisterLogin}
							/>
						)}
					/>

					<Route
						path='/users/:userId/verify/:hash'
						component={MessageComponent}
					/>

					<Route path='/logout' component={Logout} />

					<Route
						path='/'
						component={({ location }) => (
							<MainContent location={location} />
						)}
					/>
				</Switch>
			</div>
		</div>
	);
}

function mapDispatchtoProps(dispatch) {
	return {
		setUser: article => dispatch(actions.setUser(article)),
		setWindowWidth: article => dispatch(actions.setWindowWidth(article))
	};
}

export default connect(
	null,
	mapDispatchtoProps
)(App);
