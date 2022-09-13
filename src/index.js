import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
    domain="dev-43mavuar.us.auth0.com"
    clientId="s8Oz6WLIJkje52XZt2hKWFnpT3FvpEKH"
    redirectUri={window.location.origin}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
  , document.getElementById("root")
);
