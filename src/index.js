import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App
  wsep={`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}:${window.location.port === ''?'80':window.location.port}/nurimsws`}
/>);
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
