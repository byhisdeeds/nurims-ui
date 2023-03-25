import * as React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const FormattedTextViewer = (props) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { width = '100%', height = '400px', paddingLeft = 0, paddingRight = 0, source } = props;

  return (
    <Worker workerUrl="/nurims/pdf.worker.min.js">
      <div
        style={{
          height: height,
          width: width,
          paddingLeft: paddingLeft,
          paddingRight: paddingRight
        }}
      >
        <Viewer
          theme={"dark"}
          defaultScale={"PageWidth"}
          fileUrl={source}
          // plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </Worker>
  );
};

export default FormattedTextViewer;