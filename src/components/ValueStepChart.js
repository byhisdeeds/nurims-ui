import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import PropTypes from "prop-types";
import {between, normalizeUnits} from "../utils/Helpers";
import { effectiveDoseRate, temperature } from '../utils/units-converter';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

import {nanoid} from "nanoid";

// https://www.amcharts.com/docs/v5/tutorials/using-axis-ranges-to-place-labels-at-arbitrary-values-or-dates/


class ValueStepChart extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
    };
    this.Module = "ValueStepChart";
    this.chartid = nanoid();
    this.root = null;
    this.chart = null;
    this.chartValueLabel = null;
    this.series = null;
  }

  componentDidMount() {
    this.root = am5.Root.new(this.chartid);
    this.root._logo.dispose();

    const theme = am5.Theme.new(this.root);
    // create theme which hides all the grid axis zero lines
    theme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0
    });
    this.root.setThemes([
      theme,
      am5themes_Dark.new(this.root),
    ]);
    this.chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panY: false,
        panX: false,
        focusable: false,
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
        paddingBottom: 10,
        wheelY: "none",
        layout: this.root.verticalLayout,
        tooltip: am5.Tooltip.new(this.root, {
          forceHidden: true,
        })
      })
    );
    // Set this.chart title
    this.chart.children.unshift(am5.Label.new(this.root, {
      text: this.props.title,
      fontSize: this.props.titleFontSize,
      fontFamily:  this.props.titleFontFamily,
      color:  this.props.titleColor,
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 10
    }));
    // Initialise the value label
    this.chartValueLabel = this.chart.plotContainer.children.push(am5.Label.new(this.root, {
      text: "0.00",
      fontSize: this.props.valueFontSize,
      fontFamily:  this.props.valueFontFamily,
      fill:  am5.color("#fff"),
      fillOpacity: 1.0,
      background: am5.RoundedRectangle.new(this.root, {
        fill: am5.color(this.props.valueBackgroundColor),
        fillOpacity: this.props.valueBackgroundOpacity,
        stroke: am5.color(this.props.valueBorderColor)
      }),
      textAlign: "center",
      x: am5.p50,
      centerX: am5.p50,
      dx: -10,
      y: am5.p50,
      centerY: am5.p50
    }));
    // Create Y-axis
    let ymin = this.props.limits === 0 ? 1 : Number.MAX_VALUE;
    let ymax = this.props.limits === 0 ? 1 : Number.MIN_VALUE;
    for (const limit of this.props.limits) {
      ymin = Math.min(ymin, limit.from);
      ymax = Math.max(ymax, limit.to);
    }
    let yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: ymin,
        max: ymax,
        zoomY: false,
        renderer: am5xy.AxisRendererY.new(this.root, {
          // minGridDistance: 20,
          strokeOpacity: 0,
          strokeWidth: 0,
        })
      })
    );
    // Set yAxis title
    yAxis.children.unshift(
      am5.Label.new(this.root, {
        rotation: -90,
        text: this.props.units,
        fontSize: this.props.unitsFontSize,
        fontFamily: this.props.unitsFontFamily,
        fill: am5.color(this.props.labelsColor),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        y: am5.p50,
        centerX: am5.p50
      })
    );
    // Disable default Y axis grid and interval labels
    // yAxis.get("renderer").grid.template.setAll({
    //   stroke: am5.color(this.props.gridColor),
    //   strokeWidth: this.props.gridLineWidth,
    //   strokeOpacity: 0.5,
    //   strokeDasharray: [8, 4],
    // });
    //
    // yAxis.get("renderer").labels.template.setAll({
    //   fontSize: this.props.labelsFontSize,
    //   fontFamily: this.props.labelsFontFamily,
    //   fill: am5.color(this.props.labelsColor),
    //   textAlign: "center"
    // });
    const rendererY = yAxis.get("renderer");
    rendererY.grid.template.set("forceHidden", true);
    rendererY.labels.template.set("forceHidden", true);

    // Create custom Y axis grid and intervals
    for (const interval of this.props.yAxisIntervals) {
      this.createRange(interval, yAxis, interval.toFixed(this.props.yAxisIntervalPrecision));
    }
    // this.createRange(ymin, yAxis, ""+ymin);
    // this.createRange((ymax-ymin)/2, yAxis, ((ymax-ymin)/2).toFixed(0));
    // this.createRange(ymax, yAxis, ""+ymax);

    for (const limit of this.props.limits) {
      if (limit.hasOwnProperty("label")) {
        this.createLimitRange(yAxis, limit.from, limit.to, false, limit.background, limit.label);
      }
    }
    // Create X-Axis
    const xAxis = this.chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        baseInterval: { timeUnit: "millisecond", count: 1 },
        zoomX: false,
        renderer: am5xy.AxisRendererX.new(this.root, {
        }),
      })
    );
    let rangeDataItem = xAxis.makeDataItem({
      value: 0,
      endValue: this.props.datasize + 1,
      affectsMinMax: true
    });
    xAxis.createAxisRange(rangeDataItem)
    // Hide xaxis
    xAxis.hide();

    // Create series
    this.series = this.chart.series.push(
      am5xy.StepLineSeries.new(this.root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "index",
        stroke: am5.color('#ccc'),
        fill: am5.color('#ccc'),
        noRisers: false,
        stepWidth: am5.percent(50),
        locationX: 0.25,
      })
    );
    this.series.data.setAll([]);
    this.series.fills.template.setAll({
      fillOpacity: this.props.fillOpacity,
      visible: this.props.fillStep
    });

    this.chart.appear()
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  createRange(value, axis, label) {
    const rangeDataItem = axis.makeDataItem({
      value: value
    });

    const range = axis.createAxisRange(rangeDataItem);

    range.get("label").setAll({
      forceHidden: false,
      text: label
    });

    range.get("grid").setAll({
      forceHidden: false,
      // location: 0.5
      strokeOpacity: 0.5,
      strokeDasharray: [8, 4],
    });
  }

  // Create axis ranges
  createLimitRange(axis, from, to, fill, color, label) {
    const rangeDataItem = axis.makeDataItem({
      value: from,
      endValue: to
    });
    const range = axis.createAxisRange(rangeDataItem);

    if (fill) {
      range.get("axisFill").setAll({
        fill: color,
        opacity: .2,
        visible: true
      });
    }
    range.get("label").setAll({
      fill: am5.color(color),
      text: label,
      location: 0,
      fontSize: 10,
      fontFamily: this.props.labelsFontFamily,
      centerX: am5.percent(0),
      dx: -5,
      dy: -8,
      isMeasured: false,
      forceHidden: false,
    });

    range.get("grid").setAll({
      stroke: am5.color(color),
      forceHidden: false,

      strokeOpacity: 1,
      location: 0
    });
  }

  update = (data) => {
    // get data value and find rendering colors
    console.log("VAlLUE_STEP_CHART", data )
    let dataValue = data.value;
    if (effectiveDoseRate().hasUnit(normalizeUnits(data.units))) {
      dataValue = effectiveDoseRate(data.value).from(normalizeUnits(data.units)).to(normalizeUnits(this.props.units)).value;
    } else if (temperature().hasUnit(normalizeUnits(data.units))) {
      dataValue = temperature(data.value).from(normalizeUnits(data.units)).to(normalizeUnits(this.props.units)).value;
    }
    let strokeColor = this.props.limits.length === 0 ? "#ccc" : this.props.limits[0].stroke;
    let valueColor = this.props.limits.length === 0 ? "#fff" : this.props.limits[0].color;
    let backgroundColor = this.props.limits.length === 0 ? "#000" : this.props.limits[0].background;
    for (const limit of this.props.limits) {
      if (between(dataValue, limit.from, limit.to)) {
        strokeColor = limit.stroke;
        valueColor = limit.color;
        backgroundColor = limit.background;
        break;
      }
    }
    // clear all bullets then remake them
    this.series.bullets.clear();
    this.series.bullets.push(function(root, series, dataItem) {
      if (dataItem.dataContext.mostRecentValue) { //dataItem.dataContext.showBullets == true) {
        return am5.Bullet.new(root, {
          sprite: am5.Triangle.new(root, {
            height: 10,
            width: 10,
            rotation: -90,
            fill: am5.color(strokeColor),
            location: 1,
          }),
        });
      }
    });
    // Set stroke rendering color
    this.series.set("stroke", am5.color(strokeColor));
    this.series.set("fill", am5.color(strokeColor));
    this.series.data.push({
      index: this.series.data.length,
      value: dataValue,
    });
    // Set value label
    this.chartValueLabel.set("text", dataValue.toFixed(this.props.precision).padStart(
      this.props.valueDigitsWidth, this.props.valuePaddingChar));
    this.chartValueLabel.get("background").set("fill", am5.color(backgroundColor));
    this.chartValueLabel.set("fill", am5.color(valueColor));
    // trim series data size
    if (this.series.data.length > this.props.datasize) {
      this.series.data.removeIndex(0);
    }
    for (let i=0; i<this.series.data.length; i++) {
      this.series.data.setIndex(i, {
        ...this.series.data.getIndex(i),
        index: i,
        mostRecentValue: i === this.series.data.length - 1
      })
    }
  }

  render() {
    const { height } = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render");
    }
    return (
      <div id={this.chartid} style={{ width: "100%", height: height }}></div>
    );
  }
}

ValueStepChart.propTypes = {
  height: PropTypes.number,
  datasize: PropTypes.number,
  limits: PropTypes.array,
  title: PropTypes.string,
  titleFontSize: PropTypes.number,
  titleFontFamily: PropTypes.string,
  titleColor: PropTypes.string,
  precision: PropTypes.number,
  labelsFontSize: PropTypes.number,
  labelsFontFamily: PropTypes.string,
  labelsColor: PropTypes.string,
  units: PropTypes.string,
  averageFontSize: PropTypes.string,
  unitsFontSize: PropTypes.number,
  unitsFontFamily: PropTypes.string,
  valueFontSize: PropTypes.number,
  valueFontFamily: PropTypes.string,
  valueBackgroundColor: PropTypes.string,
  valueBackgroundOpacity: PropTypes.number,
  valueBorderColor: PropTypes.string,
  valueBorderRadius: PropTypes.number,
  gridColor: PropTypes.string,
  gridLineWidth: PropTypes.number,
  lineWidth: PropTypes.number,
  fillStep: PropTypes.bool,
  fillOpacity: PropTypes.number,
  valuePaddingChar: PropTypes.string,
  valueDigitsWidth: PropTypes.number,
  yAxisIntervals: PropTypes.array,
  yAxisIntervalPrecision: PropTypes.number,
}

ValueStepChart.defaultProps = {
  height: 200,
  limits: [],
  title: undefined,
  titleFontSize: 25,
  titleFontFamily: "robotoslabregular",
  titleColor: "#d7d7d7",
  precision: 2,
  datasize: 10,
  units: "",
  labelsFontSize: 6,
  labelsFontFamily: "lucidaconsole",
  labelsColor: "#d7d7d7",
  averageFontSize: "1.3em",
  unitsFontSize: 12,
  unitsFontFamily: "jetbrains",
  valueFontSize: 40,
  valueFontFamily: "lucidaconsole",
  valueBackgroundColor: "rgba(38,38,38,0.7)",
  valueBackgroundOpacity: .7,
  valueBorderColor: "#777777",
  valueBorderRadius: 10,
  gridColor: 'rgba(215,215,215,0.50)',
  gridLineWidth: 1,
  lineWidth: 1,
  fillStep: false,
  fillOpacity: 0.3,
  valuePaddingChar: "\u00a0",
  valueDigitsWidth: 5,
  yAxisIntervals: [0,1],
  yAxisIntervalPrecision: 0,
};

export default ValueStepChart;