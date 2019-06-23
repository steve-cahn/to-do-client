import React, { useState, useEffect } from 'react';
import cloneDeep from 'clone-deep';
import { updateProfile } from '../services/userRoutes';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { uploadImage } from '../services/routes';
import LoadingIcon from '../images/icons/loading-icon.png';

import avatar from '../images/profile.svg';
import TextField from '@material-ui/core/TextField';
import { PhotoCamera } from '@material-ui/icons';
import './profile.scss';

const Profile = ({ user, setUser, setMessage }) => {
	const [imgFile, setImgFile] = useState();
	const [userImg, setImage] = useState();
	const [currentUser, setCurrentUser] = useState({
		name: '',
		email: '',
		phone: '',
		imgURL: '',
		password: '',
		passwordConfirm: ''
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (user == null) {
			setImage(avatar);
			return;
		}

		if (user && user.name !== '') setImage(user.imgURL);

		setCurrentUser(user);
	}, [user]);

	const changeHandler = (property, value) => {
		const _currentUser = cloneDeep(currentUser);
		_currentUser[property] = value;
		setCurrentUser(_currentUser);
	};

	const uploadImg = async file => {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);
		const { data } = await uploadImage(formData);
		return data;
	};

	const doSumbit = async () => {
		setIsLoading(true);
		const imgURL = await uploadImg(imgFile);
		const _currentUser = cloneDeep(currentUser);
		if (imgURL) _currentUser.imgURL = imgURL;

		if (JSON.stringify(user) === JSON.stringify(_currentUser)) {
			setMessage({
				text: 'Profile Successfully Updated.',
				type: 'success'
			});

			setIsLoading(false);

			return;
		}

		delete _currentUser.passwordConfirm;
		delete _currentUser.password;
		delete _currentUser.iat;

		try {
			await updateProfile(_currentUser);
			setUser(_currentUser);
			setMessage({
				text: 'Profile Successfully Updated.',
				type: 'success'
			});
		} catch (error) {
			setMessage({
				text: 'Could not update profile. Please try again',
				type: 'error'
			});
			console.error(error);
		}
		setIsLoading(false);
	};

	return (
		<div className='profile'>
			<h2 className='page-title'>Profile</h2>

			<div className='content-container'>
				<Image
					userImg={userImg}
					setImage={setImage}
					setImgFile={setImgFile}
					setMessage={setMessage}
				/>

				<form>
					<Name
						name={currentUser.name}
						setCurrentUser={setCurrentUser}
						changeHandler={changeHandler}
					/>
					<Contact
						phone={currentUser.phone}
						email={currentUser.email}
						setCurrentUser={setCurrentUser}
						changeHandler={changeHandler}
					/>
					<Password
						setCurrentUser={setCurrentUser}
						changeHandler={changeHandler}
						password={currentUser.password}
						passwordConfirm={currentUser.passwordConfirm}
					/>

					<div className='submit-section'>
						<input
							type='button'
							className='button'
							value='Update'
							onClick={doSumbit}
							name='file'
						/>

						{isLoading && (
							<img className='loading-icon' src={LoadingIcon} />
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

const Image = ({ setImgFile, userImg, setImage, setMessage }) => {
	const imgChangeHandler = e => {
		const file = e.target.files[0];

		if (!file) return;

		const fileType = file['type'];
		const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

		if (!validImageTypes.includes(fileType)) {
			setMessage({ text: 'Please upload an image', type: 'error' });
			return;
		} else if (file.size > 10485760) {
			// 10mb
			setMessage({ text: 'File size is too large', type: 'error' });
			return;
		}

		setImgFile(file);

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = async () => {
			setImage([reader.result]);
		};
	};

	return (
		<div className='profile-img-wrapper'>
			{userImg && <img src={userImg} alt='Profile' />}
			<input
				type='file'
				id='profile-img-input'
				name='myImage'
				accept='image/*'
				onChange={imgChangeHandler}
			/>
			<label
				htmlFor='profile-img-input'
				className='img-label button inverted'
			>
				<span>Choose Image</span>
				<PhotoCamera />
			</label>
		</div>
	);
};

const Name = ({ name, changeHandler }) => {
	name = name || '';

	return (
		<TextField
			id='name'
			label='Name'
			className='themed-textfield'
			value={name}
			autoComplete='new-password'
			style={{ width: '100%', marginBottom: '50px' }}
			onChange={e => changeHandler('name', e.target.value)}
		/>
	);
};

const Contact = ({ phone, email, changeHandler }) => {
	const firstTextField = {
		id: 'phone',
		label: 'Phone Number',
		value: phone || ''
	};
	const secondTextfield = { id: 'email', label: 'Email', value: email || '' };

	return (
		<TwoTextFieldsPerRow
			firstTextFieldProps={firstTextField}
			secondTextfieldProps={secondTextfield}
			changeHandler={changeHandler}
		/>
	);
};

const Password = props => {
	const firstTextField = {
		id: 'password',
		label: 'New Password',
		type: 'password',
		value: props.password || ''
	};
	const secondTextfield = {
		id: 'passwordConfirm',
		label: 'Confirm Password',
		type: 'password',
		value: props.passwordConfirm || ''
	};

	return (
		<TwoTextFieldsPerRow
			firstTextFieldProps={firstTextField}
			secondTextfieldProps={secondTextfield}
			changeHandler={props.changeHandler}
		/>
	);
};

const TwoTextFieldsPerRow = ({
	firstTextFieldProps,
	secondTextfieldProps,
	changeHandler
}) => {
	return (
		<div className='two-per-row textfield-container'>
			<TextField
				id={firstTextFieldProps.id}
				label={firstTextFieldProps.label}
				type={firstTextFieldProps.type || 'text'}
				className='themed-textfield'
				value={firstTextFieldProps.value}
				autoComplete='new-password'
				onChange={e =>
					changeHandler(firstTextFieldProps.id, e.target.value)
				}
			/>
			<TextField
				id={secondTextfieldProps.id}
				label={secondTextfieldProps.label}
				type={secondTextfieldProps.type || 'text'}
				className='themed-textfield'
				value={secondTextfieldProps.value}
				autoComplete='new-password'
				onChange={e =>
					changeHandler(secondTextfieldProps.id, e.target.value)
				}
			/>
		</div>
	);
};

function mapStateToProps(state) {
	return { user: state.user };
}

function mapDispatchToProps(dispatch) {
	return {
		setUser: article => dispatch(actions.setUser(article)),
		setMessage: article => dispatch(actions.setMessage(article))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);
