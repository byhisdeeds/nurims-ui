import dayjs from "dayjs";

export function between(x, a, b, precision) {
  const _precision = precision | 4;
  const _x = parseFloat(Math.round((x * _precision) / _precision));
  return _x >= a && _x <= b;
}

export function normalizeUnits(units) {
  return units.replace("°", "").replace("μ", "u");
}

export function scaleFontSize(factor, fontSize) {
  const nFontSize = parseFloat(fontSize.replace("em", ""));
  return `${(nFontSize * (factor > 1 ? 1 : factor).toFixed(2))}em`;
}

// export function initStepChartOptions(props) {
//   let ymin = 0;
//   let ymax = 0;
//   for (const limit of props.limits) {
//     ymin = Math.min(ymin, limit.from);
//     ymax = Math.max(ymax, limit.to);
//   }
//   const yaxis = [{
//     y: ymax/2,
//     borderColor: '#151515',
//     opacity: 1.0,
//     label: {
//       text: undefined,
//       textAnchor: "middle",
//       position: "center",
//       offsetY: 0,
//       borderColor: props.valueBorderColor,
//       borderRadius: props.valueBorderRadius,
//       style: {
//         color: props.valueColor,
//         background: props.valueBackgroundColor,
//         fontFamily: props.valueFontFamily,
//         fontSize: props.valueFontSize,
//         padding: {
//           left: 30,
//           right: 30,
//           top: 10,
//           bottom: 10
//         }
//       },
//     },
//   },
//   {
//     y: 0,
//     borderColor: "#ff0000",
//     opacity: 0.5,
//     label: {
//       text: undefined,
//       textAnchor: "end",
//       position: "right",
//       offsetX: 0,
//       borderColor: 'transparent',
//       borderRadius: 4,
//       style: {
//         fontSize: props.averageFontSize,
//         color: "#c4c4c4",
//         background: 'transparent',
//       },
//     }
//   }];
//   for (const limit of props.limits) {
//     if (limit.hasOwnProperty("label")) {
//       yaxis.push({
//         y: limit.from,
//         borderColor: limit.color,
//         opacity: 0.5,
//         label: {
//           text: limit.label,
//           textAnchor: "start",
//           position: "left",
//           offsetX: 5,
//           borderColor: '#000000',
//           style: {
//             color: limit.color,
//             background: '#000000',
//           },
//         }
//       });
//     }
//   }
//   return {
//     theme: {
//       mode: 'dark',
//     },
//     chart: {
//       animations: {
//         enabled: false,
//       },
//       height: props.height,
//       zoom: {
//         enabled: false,
//       },
//       toolbar: {
//         show: false,
//       },
//     },
//     stroke: {
//       curve: 'stepline',
//       width: props.lineWidth,
//       colors: [props.valueColor]
//     },
//     fill: {
//       colors: [props.valueColor],
//       gradient: {
//         shade: 'light',
//         type: "horizontal",
//         shadeIntensity: 0.5,
//         gradientToColors: undefined,
//         inverseColors: true,
//         opacityFrom: 1,
//         opacityTo: 1,
//         stops: [0, 50, 100],
//         colorStops: []
//       },
//     },
//     tooltip: {
//       enabled: false,
//     },
//     dataLabels: {
//       enabled: false
//     },
//     title: {
//       text: props.title,
//       offsetY: 30,
//       align: "center",
//       style: {
//         fontSize:  props.titleFontSize,
//         fontWeight:  props.titleFontWeight,
//         fontFamily:  props.titleFontFamily,
//         color:  props.titleColor,
//       },
//     },
//     xaxis: {
//       labels: {
//         show: false,
//       },
//       axisTicks: {
//         show: false
//       }
//     },
//     grid: {
//       show: props.showGrid,
//       borderColor: props.gridColor,
//       strokeDashArray: props.gridStroke,
//       position: 'back',
//       xaxis: {
//         lines: {
//           show: false
//         }
//       },
//       yaxis: {
//         lines: {
//           show: true
//         }
//       },
//     },
//     annotations: {
//       yaxis: yaxis,
//     },
//     noData: {
//       text: "NO DATA",
//       align: 'center',
//       verticalAlign: 'middle',
//       offsetX: 35,
//       offsetY: 0,
//       style: {
//         color: "#ffcd8f",
//         fontSize: '1.5em',
//         fontFamily: "RobotoSlabRegular"
//       }
//     },
//     yaxis: {
//       show: true,
//       showAlways: true,
//       forceNiceScale: true,
//       min: ymin,
//       max: ymax,
//       axisTicks: {
//         show: false,
//       },
//       title: {
//         text: props.units,
//         style: {
//           fontSize: props.unitsFontSize,
//           fontFamily: props.unitsFontFamily
//         }
//       },
//       labels: {
//         show: true,
//         style: {
//           color: props.labelsColor,
//           fontSize: props.labelsFontSize,
//           fontFamily: props.labelsFontFamily
//         }
//       }
//     }
//   }
// }

// export function initValueChartOptions(props, data) {
//   let ymin = props.limits === 0 ? 1 : Number.MAX_VALUE;
//   let ymax = props.limits === 0 ? 1 : Number.MIN_VALUE;
//   for (const limit of props.limits) {
//     ymin = Math.min(ymin, limit.from);
//     ymax = Math.max(ymax, limit.to);
//   }
//   const annotations = [];
//   // value annotation
//   annotations.push({
//     draggable: "",
//     animation: false,
//     zIndex: 10,
//     labelOptions: {
//       shape: 'rect',
//     },
//     labels: [{
//       allowOverlap: true,
//       align: "left",
//       verticalAlign: "top",
//       // point: {
//       //   xAxis: 0,   // Series index
//       //   yAxis: 0,   // Series index
//       //   x: props.datasize / 2,
//       //   y: 20,
//       // },
//       point: {
//         x: 200,
//         y: 0,
//       },
//       padding: 10,
//       borderColor: props.valueBorderColor,
//       borderRadius: props.valueBorderRadius,
//       borderWidth: 2,
//       backgroundColor: props.valueBackgroundColor,
//       style: {
//         textTransform: "inherit",
//         fontFamily: props.valueFontFamily,
//         fontSize: props.valueFontSize,
//       },
//       text: "0.00"
//     }]
//   });
//   // most recent value annotation
//   annotations.push({
//     draggable: "",
//     animation: false,
//     zIndex: 11,
//     labels: [{
//       allowOverlap: true,
//       align: "left",
//       verticalAlign: "bottom",
//       point: {
//         xAxis: 0,   // Series index
//         yAxis: 0,   // Series index
//         x: 0,
//         y: 0,
//       },
//       y: 8,
//       x: 0,
//       padding: 0,
//       borderWidth: 0,
//       backgroundColor: "transparent",
//       style: {
//         color: "#ffffff",
//         fontFamily: props.labelsFontFamily,
//         fontSize: "1em",
//       },
//       text: "◀"
//     }]
//   });
//   for (const limit of props.limits) {
//     if (limit.hasOwnProperty("label")) {
//       annotations.push({
//         draggable: "",
//         animation: false,
//         zIndex: 5,
//         shapes: [{
//           type: "path",
//           dashStyle: "ShortDot",
//           strokeWidth: 1,
//           stroke: limit.color,
//           points: [{
//             xAxis: 0,   // Series index
//             yAxis: 0,   // Series index
//             x: 0,
//             y: limit.from,
//           },{
//             xAxis: 0,   // Series index
//             yAxis: 0,   // Series index
//             x: props.datasize+2,
//             y: limit.from,
//           }],
//         }],
//         labelOptions: {
//           shape: 'rect',
//         },
//         labels: [{
//           allowOverlap: true,
//           align: "right",
//           verticalAlign: "bottom",
//           point: {
//             xAxis: 0,   // Series index
//             yAxis: 0,   // Series index
//             x: 0,
//             y: limit.from,
//           },
//           y: -2,
//           padding: 2,
//           backgroundColor: undefined,
//           borderColor: undefined,
//           style: {
//             color: limit.color,
//             textTransform: "inherit",
//             fontFamily: props.labelsFontFamily,
//           },
//           text: limit.label
//         },]
//       });
//     }
//   }
//   return {
//     chart: {
//       panning: false,
//       accessibility: {
//         enabled: false
//       },
//       type: props.fillStep ? "area" : "line",
//       height: props.height,
//       zoomEnabled: false,
//       showAxis: true,
//       animation: false,
//     },
//     title: {
//       text: props.title,
//       align: "center",
//       y: 30,
//       style: {
//         fontSize:  props.titleFontSize,
//         fontWeight:  props.titleFontWeight,
//         fontFamily:  props.titleFontFamily,
//         color:  props.titleColor,
//         textTransform: "inherit"
//       },
//     },
//     plotOptions: {
//       panning: false,
//       area: {
//         stacking: 'normal',
//         step: 'right'
//       },
//       series: {
//         panning: false,
//         marker: {
//           states: {
//             hover: {
//               enabled: false
//             }
//           }
//         }
//       }
//     },
//     tooltip: {
//       enabled: false,
//     },
//     lang: {
//       noData: "NO DATA",
//     },
//     noData: {
//       position: {
//         verticalAlign: "bottom"
//       },
//       style: {
//         color: "#ffcd8f",
//         fontSize: '1.5em',
//         fontFamily: "RobotoSlabRegular"
//       }
//     },
//     legend: {
//       enabled: false,
//     },
//     series: data,
//     xAxis: {
//       visible: false,
//       min: 0,
//       max: props.datasize + 1,
//     },
//     yAxis: {
//       zoomEnabled: false,
//       type: 'linear',
//       min: ymin,
//       max: ymax,
//       tickAmount: 5,
//       gridLineColor: props.gridColor,
//       gridLineDashStyle: "LongDash",
//       gridLineWidth: props.gridLineWidth,
//       tickLength: 0,
//       title: {
//         text: props.units,
//         style: {
//           fontSize: props.unitsFontSize,
//           fontFamily: props.unitsFontFamily,
//           color: props.labelsColor,
//         }
//       },
//       labels: {
//         style: {
//           color: props.labelsColor,
//           fontSize: props.labelsFontSize,
//           fontFamily: props.labelsFontFamily
//         }
//       },
//     },
//     annotations: annotations,
//   }
// }

export function simulateMessages(corePanelRef, auxPanelRef, topbarRef, data, interval) {
  return setInterval(()=> {
    data.inlet = data.inlet > 40 ? 9.9 : data.inlet + 0.1;
    data.outlet = data.outlet > 60 ? 19.9 : data.outlet + 0.1;
    data.rod = data.rod > 9.0 ? 0.0 : data.rod + .1;
    data.flux = data.flux > 10 ? 0.0 : data.flux + 0.1;
    const ts = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const message = [
      {
        "timestamp": ts,
        "id": "Inlet_Temp",
        "value": data.inlet,
        "units": "°C"
      },
      {
        "timestamp": ts,
        "id": "Outlet_Temp",
        "value": data.outlet,
        "units": "°C"
      },
      {
        "timestamp": ts,
        "id": "Control_Rod_Position",
        "value": data.rod,
        "units": "in"
      },
      {
        "timestamp": ts,
        "id": "Neutron_Flux",
        "value": data.flux,
        "units": "10^11 n/cm2/s"
      },
      {
        "timestamp": ts,
        "id": "971073",
        "value": 1 + Math.floor(Math.random() * 8),
        "units": "mR/hr"
      },
      {
        "timestamp": ts,
        "id": "971098",
        "value":1 + Math.floor(Math.random() * 4),
        "units": "mR/hr"
      },
      {
        "timestamp": ts,
        "id": "973014",
        "value": 2 + Math.floor(Math.random() * 5),
        "units": "mR/hr"
      },
      {
        "timestamp": ts,
        "id": "971070",
        "value": 2 + Math.floor(Math.random() * 5),
        "units": "mR/hr"
      },
      {
        "timestamp": ts,
        "id": "Pool_Chiller_Temp",
        "value": 14 + Math.floor(Math.random() * 5),
        "units": "°C"
      },
      {
        "timestamp": ts,
        "id": "server.timestamp"
      },
    ];
    if (corePanelRef.current) {
      corePanelRef.current.ws_message(message);
    }
    if (auxPanelRef.current) {
      auxPanelRef.current.ws_message(message);
    }
    if (topbarRef.current) {
      topbarRef.current.ws_message(message);
    }
  }, interval || 4000);
}

export function configureRippleParameters(x0, x1, xinc, y, radius, strength, inlet, outlet) {
  const ripples = [];
  if (outlet > 25) {
    for (let x=x0; x<=x1; x+=xinc) {
      ripples.push({
        x: x,
        y: y,
        radius: radius,
        strength: strength
      });
    }
  }
  return ripples;
}