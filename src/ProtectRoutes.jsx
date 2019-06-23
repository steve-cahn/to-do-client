import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const LogoutProtectRoute = props => {
	const { component: Component, user } = props;

	if (user && user.name) {
		return <Redirect to='/' />;
	} else {
		return <Component {...props} />;
	}
};

const LoginProtectRoute = ({ Component, user }) => {
	if (!user && !user.name) {
		return <Redirect to='/' />;
	} else {
		return <Component />;
	}
};

function mapStateToProps(state) {
	return { user: state.user };
}

export default {
	LogoutProtectRoute: connect(mapStateToProps)(LogoutProtectRoute),
	LoginProtectRoute: connect(mapStateToProps)(LoginProtectRoute)
};
