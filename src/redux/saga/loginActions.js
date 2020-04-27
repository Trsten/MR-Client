
const LOGIN_USER = 'LOGIN_USER';
const LOGGED_USER = 'LOGGED_USER';
const IS_LOGGED = 'IS_LOGGED';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGOUT = 'LOGOUT';

const doLoginUser = (user) => ({
  type: LOGIN_USER,
  user
});

const getLoggedUser = user => ({
  type: LOGGED_USER,
  user
});

const isLogged = isLogged => ({
  type: IS_LOGGED,
  isLogged
});

const loginFailed = error => ({
  type: LOGIN_FAILED,
  error
});

const doLogout = () => ({
  type: LOGOUT,
  user:{},
});

export {
    doLoginUser,
    getLoggedUser,
    isLogged,
    loginFailed,
    doLogout,
    LOGIN_USER, LOGGED_USER, IS_LOGGED, LOGIN_FAILED, LOGOUT
};