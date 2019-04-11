import React from 'react';
import { connect } from 'react-redux';

//Components
// import UserModal from '../Modals/userModal';
import StripeView from '../Stripe/StripeView';
import { logout } from '../../Auth/Auth';
import Authentication from '../authenticate/authenticate';

//State Management
import { getUser, editUser, deleteUser } from '../../store/actions/userActions';

//Styling
import {
	Button,
	Card,
	CardActions,
	Typography,
	withStyles,
	Modal,
	Avatar,
	Divider
} from '@material-ui/core';


import styled from 'styled-components';
import Pricing from '../LandingPage/Pricing';

// function rand() {
// 	return Math.round(Math.random() * 20) - 10;
// }
function rand() {
	return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
	const top = 50 + rand();
	const left = 50 + rand();

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const styles = theme => ({
	paper: {
		position: 'absolute',
		margin: '0 auto',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: 'none',
		alignItems: 'center',
	},
	profileContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '30%',
		padding: 10,
	},
	pricing: {
		width: '70%',
		margin: '0px 0px 0px 10px',
		padding: 10,
		// height: 350,
	},
	cardContent: {
		backgroundColor: '#E8E9EB',
	},
	media: {
		height: 200,
		width: 200,
	},
	bigAvatar: {
		margin: 10,
		width: 150,
		height: 150,
	},
	divider: {
		width: '70%',
		backgroundColor: '#E7E8EB',
		margin: "5px 0 10px 0"
	},
	bold: {
		fontWeight: 700
	},
	bottomSpace: {
		marginBottom: 10
	}
});

const Container = styled.div`
	/* margin-top: 80px; */
	margin: 0 auto;
	box-sizing: border-box;
	display: flex;
	max-width: 1000px;
	width: 100%;
	height: 430px;
	align-items: stretch;
`;

class ProfileView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			googleProfile: [],
			open: false,
		};
	}
	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleLogout = e => {
		e.preventDefault();
		logout();
		this.props.history.push('/');
	};

	handleDelete = (id) => {
		this.props.deleteUser(id);
		this.props.history.push('/');
	};

	render() {
		//Destructure user from userProfile
		const { user } = this.props.userProfile;
		const { classes } = this.props;

		let accountType;
		let account;
		let maxCount;
		if (this.props.doneLoading) {
			let type = user.accountTypeID;
			if (type === 3) {
				accountType = <span>Pro</span>;
				account = true;
				maxCount = 1000
			} else if (type === 2) {
				accountType = <span>Premium</span>;
				account = true;
				maxCount = 200
			} else if (type === 1) {
				accountType = <span>Free</span>;
				account = false;
				maxCount = 50
			}
		}

		return (
			<Container>
				{this.props.doneLoading && (
					<>
						<Card className={classes.profileContainer}>
							<Avatar
								alt="Remy Sharp"
								src={JSON.parse(localStorage.getItem('Profile')).picture}
								className={classes.bigAvatar}
							/>
							<Typography gutterBottom variant="h5" component="h1">
								{user.name}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								{user.email}
							</Typography>
							<Typography gutterBottom variant="subtitle1" component="subtitle1">
								<div>Account Type: {accountType}</div>
							</Typography>
							<Divider variant="middle" className={classes.divider} />
							<Typography gutterBottom variant="subtitle1" component="subtitle1" className={classes.bold}>
								Messages Sent
							</Typography>
							<Typography gutterBottom variant="subtitle1" component="subtitle1">
								{/* quick fix for minor bug, newUser object doesn't have notification count */}
								{user.notificationCount ? user.notificationCount : 0} out of {maxCount}
							</Typography>
							<CardActions>
								<Button
									variant="contained"
									onClick={this.handleOpen}
									className={classes.button}>
									Delete Account
								</Button>
							</CardActions>
						</Card>

						<Card className={classes.pricing}>
							{/* <Pricing /> */}
							<StripeView user={this.state.googleProfile} />
						</Card>
					</>
				)}
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.state.open}
					onClose={this.handleClose}>
					<div style={getModalStyle()} className={classes.paper}>
						{account ? (
							<>
								<Typography variant="h6" id="modal-title">
									Active subscription
								</Typography>
								<Typography>
									Please unsubscribe from your current subscription before
									deleting your account.
								</Typography>
							</>
						) : (
								<>
									<Typography variant="h6" id="modal-title">
										Are you sure you want to delete your account?
									</Typography>
									<Typography className={classes.bottomSpace}>
										All data associated with this account will be permanently deleted.
									</Typography>
									<Button
										variant="contained"
										color="secondary"
										onClick={() => {
											this.handleDelete(user.userID);
										}}>
										Delete Account
								</Button>
								</>
							)}
					</div>
				</Modal>
			</Container>
		);
	}
}

const mapStateToProps = state => {
	return {
		userProfile: state.userReducer.userProfile,
		doneLoading: state.userReducer.doneLoading,
		isEditing: state.userReducer.isEditing,
	};
};

export default connect(
	mapStateToProps,
	{
		getUser,
		editUser,
		deleteUser,
	}
)(withStyles(styles)(Authentication(ProfileView)));
