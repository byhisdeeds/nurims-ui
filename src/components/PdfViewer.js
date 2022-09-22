import * as React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = (props) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { width = '100%', height = '400px', marginLeft = 'auto', marginRight = 'auto', source } = props;

  return (
    <Worker workerUrl="pdf.worker.min.js">
      <div
        style={{
          height: height,
          width: width,
          marginLeft: marginLeft,
          marginRight: marginRight
        }}
      >
        <Viewer
          fileUrl={source}
          plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </Worker>
  );
};

export default PdfViewer;