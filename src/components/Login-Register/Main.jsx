import React from 'react';
import { connect } from 'react-redux';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import registerLoginImg from '../../images/registerLogin.svg';
import './registerLogin.scss';

const RegisterLogin = props => {
	const urlPath = props.location.pathname.split('/')[1];
	const isRegisterPage = urlPath === 'register';
	return (
		<div className='register-login'>
			{props.windowWidth > 991 && <SideImg urlPath={urlPath} />}
			<Form
				isRegisterPage={isRegisterPage}
				urlPath={urlPath}
				setMessage={props.setMessage}
				setUser={props.setUser}
				pathName={props.location.pathname}
			/>
		</div>
	);
};

const SideImg = ({ urlPath }) => {
	return (
		<div className='img-wrapper'>
			<img src={registerLoginImg} alt={urlPath} />
		</div>
	);
};

const Form = ({ isRegisterPage, urlPath, setMessage, setUser, pathName }) => {
	return (
		<form>
			<h2 className='page-title'>{urlPath}</h2>

			{isRegisterPage && <RegisterForm setMessage={setMessage} />}
			{!isRegisterPage && (
				<LoginForm setUser={setUser} urlPath={pathName} />
			)}
		</form>
	);
};

function mapStateToProps(state) {
	return { windowWidth: state.windowWidth };
}

export default connect(mapStateToProps)(RegisterLogin);
