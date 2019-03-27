// parent component for app once logged in
import React from "react";

//Routing
import { Link } from "react-router-dom";

//Styling
import styled from "styled-components";

//Components
import AppBar from "../AppBar/AppBar";
import TeamMembersView from "../TeamMembers/TeamMembersView";
import TrainingSeriesView from "../TrainingSeries/TrainingSeriesView";
import { NavigationView } from "../Navigation";

//Axios
import axios from "axios";

//Auth
import { getUserProfile } from "../../Auth/Auth";
import Authenticate from "../authenticate/authenticate";

class Dashboard extends React.Component {
  state = {
    tabValue: 0,
    user: {},
    doneLoading: false,
    refreshCount: 0
  };

  componentDidMount() {
    this.getProfile();
  }

  render() {
    return (
      <>
        {this.state.doneLoading && (
          <>
            <AppBar />
            <DashboardContainer>
              <NavigationView
                tabValue={this.state.tabValue}
                changeTabValue={this.changeTabValue}
              />

              <h4>
                You are logged in! You can now view your{" "}
                <Link to="profile">profile area</Link>.
              </h4>
              <div>
                <div style={this.state.tabValue === 0 ? active : hidden}>
                  <TrainingSeriesView userData={this.state.user} />
                </div>
                <div style={this.state.tabValue === 1 ? active : hidden}>
                  <TeamMembersView userId={this.state.user.user.userID} />
                </div>
              </div>
            </DashboardContainer>
          </>
        )}
      </>
    );
  }

  // tracking the tab value in navigation.js
  changeTabValue = value => {
    this.setState({
      tabValue: value
    });
  };
  //Gets the users Profile
  getProfile = () => {
    getUserProfile(() => {
      const userData = JSON.parse(localStorage.getItem("Profile"));
      const { email, name } = userData;
      axios
        .post("https://labs11-trainingbot-dev.herokuapp.com/api/auth", {
          email,
          name
        })
        .then(res => {
          let userData = res.data;
          this.setState({ user: { ...userData }, doneLoading: true });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };
}

export default Authenticate(Dashboard);

//Styled Components
const DashboardContainer = styled.div`
  margin: 100px 0;
`;

const hidden = {
  display: "none"
};

const active = {
  display: "block"
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
