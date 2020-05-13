import React, { useState } from 'react';

import { doLoginUser } from "./redux/saga/loginActions";
import { connect } from "react-redux";

function ErrorPage() {

  return (
    <div>
      <h1>the server is not responding !</h1>
    </div>
  );
}
const mapStateToProps = state => ({
  loggedUser: state.userState.user,
  failMessage: state.userState.failMessage
});
const mapDispatchToProps = {
  doLoginUser
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorPage);
