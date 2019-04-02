// parent component for app once logged in
import React from 'react';

//Styling
import styled from 'styled-components';

//Components
import TeamMembersView from '../TeamMembers/TeamMembersView';
import TrainingSeriesView from '../TrainingSeries/TrainingSeriesView';
import { NavigationView } from '../Navigation';
import ProgressCircle from '../Progress/ProgressCircle';

//Auth
import { getUserProfile } from '../../Auth/Auth';
import Authenticate from '../authenticate/authenticate';

//State Management
import { connect } from 'react-redux';
import { getUser } from '../../store/actions/userActions';

class Dashboard extends React.Component {
  state = {
    tabValue: 0,
  };

  componentDidMount() {
    getUserProfile(() => {
      this.props.getUser();
    });
  }

  render() {
    const { user } = this.props.userProfile;
    console.log(this.props);
    return (
      <>
        {this.props.doneLoading ? (
          <>
            <DashboardContainer>
              {/* <NavigationView
                tabValue={this.state.tabValue}
                changeTabValue={this.changeTabValue}
              /> */}
              <TeamMembersView userId={user.userID} />
              <TrainingSeriesView
                userId={user.userID}
                match={this.props.match}
              />
            </DashboardContainer>
          </>
        ) : (
            <ProgressCircle />
          )}
      </>
    );
  }

  // tracking the tab value in navigation.js
  changeTabValue = value => {
    this.setState({
      tabValue: value,
    });
  };
}

const mapStateToProps = state => {
  return {
    userProfile: state.userReducer.userProfile,
    doneLoading: state.userReducer.doneLoading,
  };
};

export default connect(
  mapStateToProps,
  {
    getUser,
  }
)(Authenticate(Dashboard));

//Styled Components
const DashboardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 100px 0;
  border: 1px solid red;
`;

const hidden = {
  display: 'none',
};

const active = {
  display: 'block',
};

// const toggleTrainingSeries = tabValue => {

//   return tabValue === 0 ? active : hidden;
// };

// const toggleTeamMembers = tabValue => {
//   const hidden = {
//     display: "none"
//   };

//   const active = {
//     display: "block"
//   };

//   return tabValue === 1 ? active : hidden;
// };
