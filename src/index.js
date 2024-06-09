import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import "./index.css";
import {
  UserContext,
} from "./utils/UserContext";

const AuthService = {
  isAuthenticated: false,
  from: "",
  profile: {
    id: -1,
    username: "",
    fullname: "",
    authorized_module_level: "",
    role: []
  },
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
const port = window.location.port == "" ? "80" : "5040"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContext.Provider value={{debug: window.location.href.includes("debug"), user: AuthService}}>
    <React.StrictMode>
      <App
        wsep={`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${port}/nurimsws`}
      />
    </React.StrictMode>


  </UserContext.Provider>);
// const routing = (
//   // <App wsep={`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}/nurimsws`} />
//   // <App wsep={`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}/nurimsws`} />
//   <React.StrictMode>
//   <App
//     wsep={`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}:${window.location.port === ''?'80':window.location.port}/nurimsws`}
//   />
//   </React.StrictMode>
// );
//
// ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
