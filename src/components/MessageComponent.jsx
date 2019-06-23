import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { withRouter } from 'react-router';

import auth from '../services/authService';

const MessageComponent = props => {
	const [response, setResponse] = useState({});

	useEffect(() => {
		async function verifyHanlder() {
			try {
				await auth.verify(
					props.match.params.userId,
					props.match.params.hash
				);

				props.setMessage({});
				setResponse({ success: true });
			} catch (error) {
				setResponse({ errorMessage: error.response.data });
			}
		}

		verifyHanlder();
	}, []);

	return (
		<div className='main-full-message' style={{ padding: '100px 0' }}>
			{response.success && <SuccessComponent />}
			{response.errorMessage && (
				<ErrorComponent
					message={response.errorMessage}
					setHeaderMessage={props.setMessage}
					_id={props.match.params.userId}
				/>
			)}
		</div>
	);
};

const ErrorComponent = ({ message, _id, setHeaderMessage }) => {
	async function resendEmailHandler() {
		await auth.resendVerification(_id);

		setHeaderMessage({
			text: 'Email verification has been sent.',
			type: 'warn'
		});
	}

	return (
		<>
			<h3>Your account cannot be verified. {message}</h3>
			<h4>
				<button onClick={resendEmailHandler}>
					Resend Email Verification
				</button>
			</h4>
		</>
	);
};

const SuccessComponent = () => {
	useEffect(() => {
		setTimeout(() => {
			window.location = '/';
		}, 5000);
	});

	return (
		<>
			<h3>Congragulations! Your account has been verified!</h3>
			<h4>
				You are being redirected to the home page. Alternatively, you
				can <a href='/'>click here</a> to be redirected.
			</h4>
		</>
	);
};

const RouterMessageComponent = withRouter(MessageComponent);

function mapDispatchtoProps(dispatch) {
	return {
		setMessage: article => dispatch(actions.setMessage(article)),
		setUser: article => dispatch(actions.setUser(article))
	};
}

export default connect(
	null,
	mapDispatchtoProps
)(RouterMessageComponent);
