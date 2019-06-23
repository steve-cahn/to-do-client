import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import auth from '../../services/authService';
import {
	TextFieldComponent,
	SubmitBtn,
	doSubmit,
	customErrorMsg
} from './OtherComponents';
import Joi from 'joi-browser';
import cloneDeep from 'clone-deep';
import LoadingIcon from '../../images/icons/loading-icon.png';

// REFACTOR THIS PAGE

const LoginForm = ({ urlPath }) => {
	const LoginComponent = () => {
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [error, setErrors] = useState({});
		const [isLoading, setIsLoading] = useState(false);

		const deleteErrors = () => {
			setErrors({});
		};

		const schema = {
			email: Joi.string()
				.email()
				.required()
				.error(errors => {
					return customErrorMsg(errors);
				}),
			password: Joi.string()
				.required()
				.error(errors => {
					return customErrorMsg(errors);
				})
		};

		const onSubmit = () => {
			doSubmit(
				{ email, password },
				schema,
				error,
				setErrors,
				setIsLoading,
				submitCallback
			);
		};

		const submitCallback = async credidentials => {
			try {
				const response = await auth.login(
					credidentials.email,
					credidentials.password
				);
				// const user = await auth.decodeJWT(token);
				// setUser(user);

				window.location = '/';
			} catch (ex) {
				const _errors = cloneDeep(error);
				_errors.otherError = ex.response
					? ex.response.data
					: 'Something went wrong. Please try again.';
				setErrors(_errors);
			}
		};
		return (
			<>
				<TextFieldComponent
					id='email'
					label='Email Address'
					value={email}
					setter={setEmail}
					errorMessage={error.email}
					deleteErrors={deleteErrors}
					onSubmitHandler={onSubmit}
				/>
				<TextFieldComponent
					id='password'
					label='Password'
					type='password'
					value={password}
					setter={setPassword}
					errorMessage={error.password}
					deleteErrors={deleteErrors}
					onSubmitHandler={onSubmit}
				/>
				<Link to='/login/forgot-password' className='forgot-pass'>
					Forgot Password
				</Link>

				{error.otherError && (
					<span className='incorrect-cred'>{error.otherError}</span>
				)}

				<SubmitBtn onClickHandler={onSubmit} value='Login' />

				{isLoading && (
					<img className='loading-icon' src={LoadingIcon} />
				)}

				<Link to='/register' className='have-account'>
					Don't Have an Account? Register
				</Link>
			</>
		);
	};

	const ForgotPasswordComponent = () => {
		const [email, setEmail] = useState('');
		const [error, setErrors] = useState({});
		const [message, setMessage] = useState('');
		const [isLoading, setIsLoading] = useState(false);

		const deleteErrors = () => {
			setErrors({});
		};

		const schema = {
			email: Joi.string()
				.email()
				.required()
				.error(errors => {
					return customErrorMsg(errors);
				})
		};

		const onSubmit = () => {
			doSubmit(
				{ email },
				schema,
				error,
				setErrors,
				setIsLoading,
				submitCallback
			);
		};

		const submitCallback = async () => {
			try {
				const response = await auth.sendResetPasswordEmail(email);
				setMessage(
					'Instructions regarding resetting your password have been sent to your email address.'
				);
			} catch (ex) {
				console.log(ex);
				const _errors = cloneDeep(error);
				_errors.otherError = ex.response.data;
				setErrors(_errors);
			}
		};

		if (message) return <div className="message">{message}</div>;

		return (
			<>
				<TextFieldComponent
					id='email-confirm'
					label='Email Address'
					value={email}
					setter={setEmail}
					errorMessage={error.email}
					deleteErrors={deleteErrors}
					onSubmitHandler={onSubmit}
				/>

				{error.otherError && (
					<span className='incorrect-cred'>{error.otherError}</span>
				)}

				<SubmitBtn onClickHandler={onSubmit} value='Submit' />

				{isLoading && (
					<img className='loading-icon' src={LoadingIcon} />
				)}
			</>
		);
	};

	const ResetPasword = () => {
		const [password, setPassword] = useState('');
		const [error, setErrors] = useState({});
		const [message, setMessage] = useState('');
		const [isLoading, setIsLoading] = useState(false);

		const deleteErrors = () => {
			setErrors({});
		};

		const schema = {
			password: Joi.string()
				.required()
				.error(errors => {
					return customErrorMsg(errors);
				})
		};

		const onSubmit = () => {
			doSubmit(
				{ password },
				schema,
				error,
				setErrors,
				setIsLoading,
				submitCallback
			);
		};

		const submitCallback = async () => {
			const currentEmail = urlPath.split('/')[3];
			const hash = urlPath.split('/')[4];

			try {
				const response = await auth.resetPassword(
					currentEmail,
					hash,
					password
				);

				setMessage(
					'You have successfully updated your account password. Redirecting you to home page...'
				);

				setTimeout(() => {
					window.location = '/';
				}, 3000);
			} catch (ex) {
				const _errors = cloneDeep(error);
				_errors.otherError = ex.response.data;
				setErrors(_errors);
			}
		};

		if (message) return <div className="message">{message}</div>;

		return (
			<>
				<TextFieldComponent
					id='password'
					label='Password'
					type='password'
					value={password}
					setter={setPassword}
					errorMessage={error.password}
					deleteErrors={deleteErrors}
					onSubmitHandler={onSubmit}
				/>

				{error.otherError && (
					<span className='incorrect-cred'>{error.otherError}</span>
				)}

				<SubmitBtn onClickHandler={onSubmit} value='Submit' />

				{isLoading && (
					<img className='loading-icon' src={LoadingIcon} />
				)}
			</>
		);
	};

	if (urlPath.split('/')[2] === 'forgot-password') {
		return <ForgotPasswordComponent />;
	} else if (urlPath.split('/')[2] === 'reset-password') {
		return <ResetPasword />;
	}

	return <LoginComponent />;
};

export default LoginForm;
