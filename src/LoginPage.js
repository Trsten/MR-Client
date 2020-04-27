import React, { useState } from 'react';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

// @material-ui/icons
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

// core components
import GridContainer from "./creative/components/GridContainer.js";
import GridItem from "./creative/components/GridItem.js";
import Button from "./creative/components/Button.js";
import Card from "./creative/components/Card.js";
import CardBody from "./creative/components/CardBody.js";
import CardHeader from "./creative/components/CardHeader.js";
import CardFooter from "./creative/components/CardFooter.js";
import CustomInput from "./creative/components/CustomInput.js";
import TextField from '@material-ui/core/TextField';

import styles from "./creative/styles/loginPage.js";
import { red } from '@material-ui/core/colors';
import image from "./creative/images/bg7.jpg";

import { doLoginUser } from "./redux/saga/loginActions";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(styles);
const wrongPassword = "E;999;wrong password";
const wrongEmail = "E;999;Entity with entered email doesnt exist.";

function LoginPage({ loggedUser, doLoginUser, isLogged, failMessage, ...props }) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();

  const [data, setData] = useState();

  const onSubmit = () => {
    doLoginUser(data);
  }

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };

  const emailInput = () => {
    return failMessage === wrongEmail ? true : false;       
   }

   const paswdInput = () => {
      return failMessage === wrongPassword ? true : false;       
   }

  if (isLogged) {
    return <Redirect to='/home'/>
  }

  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                  <h3 style={{fontFamily: "Roboto Helvetica, Arial", fontWeight: 300 }}>Meeting report</h3>
                    <div className={classes.socialLine}>
                          <IconButton color="inherit" >
                            <TwitterIcon />
                          </IconButton>
                          <IconButton color="inherit">
                            <FacebookIcon />
                          </IconButton>
                          <IconButton color="inherit">
                            <InstagramIcon />
                          </IconButton>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div><TextField
                    error={emailInput()}
                    helperText={ emailInput() ? "Incorrect email" : "Enter email" }
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                          <InputAdornment>
                              <MailOutlineIcon style={{ color: emailInput() ? red[500] : "" }} />
                          </InputAdornment>
                        )
                      }}
        /></div>
                    <div><TextField
        error={paswdInput()}
        helperText={ paswdInput() ? "Incorrect password" : "Enter password" }
        variant="outlined"
        margin="normal"
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={handleChange}
        onKeyPress={(ev) => {
          if ( ev.key === 'Enter') {
              onSubmit()
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment>
                <LockOutlinedIcon  style={{ color: paswdInput() ? red[500] : "" }} />
            </InputAdornment>
          )
        }}
      /></div>
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple color="primary" size="lg" onClick={onSubmit} >
                      Get started
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>


  );
}
const mapStateToProps = state => ({
  loggedUser: state.userState.user,
  isLogged: state.userState.isLogged,
  failMessage: state.userState.failMessage
});
const mapDispatchToProps = {
  doLoginUser
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
