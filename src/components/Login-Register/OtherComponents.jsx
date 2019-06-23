import React from 'react';
import TextField from '@material-ui/core/TextField';
import cloneDeep from 'clone-deep';
import Joi from 'joi-browser';

const TextFieldComponent = props => {
	let errorClassName = props.errorMessage ? 'error show' : 'error';

	return (
		<div className='textfild-wrapper'>
			<TextField
				id={props.id}
				label={props.label}
				type={props.type || 'text'}
				className='themed-textfield'
				value={props.value}
				onChange={e => {
					props.setter(e.target.value);
					props.deleteErrors();
				}}
				onKeyPress={e => {
					if (e.key === 'Enter') {
						e.preventDefault();
						props.onSubmitHandler();
					}
				}}
				autoComplete={props.autoComplete || props.label}
			/>

			<span className={errorClassName}>{props.errorMessage}</span>
		</div>
	);
};

const SubmitBtn = ({ onClickHandler, value }) => {
	return (
		<input
			type='button'
			value={value}
			className='button'
			onClick={onClickHandler}
		/>
	);
};

const customErrorMsg = errors => {
	if (errors[0].type === 'any.empty') {
		const name = errors[0].path[0];
		errors[0].message = `${name} is Required`;
	}
	return errors;
};

const validate = (credidentials, schema, errors) => {
	const { error: joiError } = Joi.validate(credidentials, schema);

	if (joiError) {
		const _errors = cloneDeep(errors);
		const errorMsg = joiError.details[0].message;
		const item = joiError.details[0].path[0];
		_errors[item] = errorMsg;
		return _errors;
	}

	return false;
};

const doSubmit = async (
	credidentials,
	schema,
	error,
	setErrors,
	setIsLoading,
	successCallback
) => {
	setIsLoading(true);
	const response = validate(credidentials, schema, error);

	if (response) setErrors(response);
	else {
		await successCallback(credidentials);
	}
	setIsLoading(false);
};

export { TextFieldComponent, SubmitBtn, doSubmit, customErrorMsg };
