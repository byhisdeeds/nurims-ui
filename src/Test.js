import {useAuth0, withAuthenticationRequired} from '@auth0/auth0-react'
import React, {useRef} from "react";
// import PdfViewer from "./components/PdfViewer";
import PDFViewer from "./components/PDFViewer";
import PDFJSBackend from './components/PDFJs';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function Test() {
  const {user} = useAuth0()
  console.log(user)
  return (
    <div style={{ height: "720px" }}>
      <PDFViewer
        backend={PDFJSBackend}
        src='/test.pdf'
      />
    </div>
  );
}

export default withAuthenticationRequired(Test, {
  onRedirecting: () => <div>Loading ...</div>,
});