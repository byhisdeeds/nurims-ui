import React from "react";
import ReactDOM from "react-dom";
import {Routes, Route, Router, Navigate, BrowserRouter} from 'react-router-dom';
import App from "./App";
import Login from "./components/Login";
// import { Auth0Provider } from "@auth0/auth0-react";

const AuthService = {
  isAuthenticated: false,
  from: '',
  profile: {},
  users: [],
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

const ProtectedRoute = ({ authService, path, children }) => {
  authService.from = path;
  return authService.isAuthenticated ? children : <Navigate to={'/login'} replace={false}/>
}

const routing = (
  <BrowserRouter basename={"/nurims"}>
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            authService={AuthService}
            wsep={`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}/nurimsws`}
          />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute path="/" authService={AuthService}>
            <App
              authService={AuthService}
              wsep={`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}/nurimsws`}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
