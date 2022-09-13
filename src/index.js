import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch, Router, Navigate} from 'react-router-dom';
import App from "./App";
import Login from "./components/Login";
// import { Auth0Provider } from "@auth0/auth0-react";

const AuthService = {
  isAuthenticated: false,
  profile: {},
  authenticate(valid, profile) {
    this.isAuthenticated = valid;
    if (valid && profile) {
      this.profile = profile;
    }
  },
  logout() {
    this.isAuthenticated = false;
  }
};

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthService.isAuthenticated === true
      ? <Component authService={AuthService} {...props} />
      : <Navigate to='/nurims/login' />
  )} />
);

const routing = (
  <Router>
    <div>
      <Route
        exact
        path="/nurims/login"
        render={props => <Login
                         wsep={`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}/nurimsws`}
                         authService={AuthService}
                         {...props} />
               }
      />
      <ProtectedRoute path="/nurims" exact component={App} />
      {/*<ProtectedRoute path="/onaa/spc" exact component={SpectrumAnalysis} />*/}
      {/*<ProtectedRoute path="/onaa/nuclib" component={NuclideLibrary} />*/}
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

// ReactDOM.render(
//   // <Auth0Provider
//   //   domain="dev-43mavuar.us.auth0.com"
//   //   clientId="s8Oz6WLIJkje52XZt2hKWFnpT3FvpEKH"
//   //   redirectUri={window.location.origin}
//   // >
//   //   <React.StrictMode>
//   //     <App />
//   //   </React.StrictMode>
//   // </Auth0Provider>
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>  , document.getElementById("root")
// );
