import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userServices';
import {
	TextFieldComponent,
	SubmitBtn,
	doSubmit,
	customErrorMsg
} from './OtherComponents';
import Joi from 'joi-browser';
import cloneDeep from 'clone-deep';
import LoadingIcon from '../../images/icons/loading-icon.png';

const RegisterForm = ({ setMessage }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [error, setErrors] = useState({});

	const schema = {
		name: Joi.string()
			.required()
			.error(errors => {
				return customErrorMsg(errors);
			}),
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
			}),
		confirmPassword: Joi.string()
			.required()
			.valid(Joi.ref('password'))
			.options({
				language: {
					any: {
						allowOnly: '!!Passwords do not match'
					}
				}
			})
	};

	const deleteErrors = () => {
		setErrors({});
	};

	const onSubmit = () => {
		doSubmit(
			{ name, email, password, confirmPassword },
			schema,
			error,
			setErrors,
			setIsLoading,
			submitCallback
		);
	};

	const submitCallback = async credidentials => {
		try {
			await userService.register(credidentials);
			// const message = { text: 'Yo There!!!' };
			// setMessage(message);
			// setShouldRedirect(true);

			window.location = '/';
		} catch (ex) {
			const _errors = cloneDeep(error);
			if (ex.response.data === 'This email is already in use.') {
				_errors.email = ex.response.data;
			} else {
				_errors.otherError = ex.response.data;
			}
			setErrors(_errors);
		}
	};

	return (
		<>
			<TextFieldComponent
				id='name'
				label='Name'
				value={name}
				setter={setName}
				errorMessage={error.name}
				deleteErrors={deleteErrors}
				onSubmitHandler={onSubmit}
			/>
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
			<TextFieldComponent
				id='confirm-password'
				label='Password Confirmation'
				type='password'
				value={confirmPassword}
				setter={setConfirmPassword}
				errorMessage={error.confirmPassword}
				deleteErrors={deleteErrors}
				onSubmitHandler={onSubmit}
			/>

			{error.otherError && (
				<span className='incorrect-cred'>{error.otherError}</span>
			)}

			<SubmitBtn onClickHandler={onSubmit} value='Register' />

			{isLoading && <img className='loading-icon' src={LoadingIcon} />}

			<Link to='/login' className='have-account'>
				Already Have an Account? Log In
			</Link>
		</>
	);
};

export default RegisterForm;
