import * as ss from "simple-statistics";
import {format, parseISO} from "date-fns";
import {
  NURIMS_DOSIMETRY_DEEP_DOSE, NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE, NURIMS_DOSIMETRY_WRIST_DOSE
} from "./constants";


export function histogram(X, nbins) {
  if (X.length < 3) {
    return [];
  }

  const bins = [];
  const extent = ss.extent(X);
  const interval = (extent[1] - extent[0]) / nbins;

  //Setup Bins
  let binCount = 0;
  for (let i = extent[0]; i < extent[1]; i += interval) {
    bins.push({
      label: (i + (interval / 2)).toFixed(2).replaceAll("0.", "."),
      min: i,
      max: i + interval,
      count: 0
    });
  }

  // Loop through data and add to bin's count
  for (const item of X) {
    for (const bin of bins) {
      if (item >= bin.min && item < bin.max) {
        bin.count += 1;
        break;
      }
    }
    // count the value of X == bin[last bin].max
    if (item === extent[1]) {
      bins[bins.length - 1].count++;
    }
  }

  return bins;
}

export function doseStats(rows, dosimetryType) {
  let ts_min = null;
  let ts_max = null;
  const d0 = [];
  const d1 = [];
  // re-calculate descriptive statistics dataset
  for (const row of rows) {
    if (row.use) {
      const ts = parseISO(row[NURIMS_DOSIMETRY_TIMESTAMP]);
      if (ts_min === null || ts_max === null) {
        ts_min = ts;
        ts_max = ts;
      } else if (ts.getTime() <= ts_min.getTime()) {
        ts_min = ts;
      } else if (ts.getTime() >= ts_max.getTime()) {
        ts_max = ts;
      }
      if (row[NURIMS_DOSIMETRY_TYPE] === "wholebody" && dosimetryType === "wholebody") {
        d0.push(row[NURIMS_DOSIMETRY_SHALLOW_DOSE]);
        d1.push(row[NURIMS_DOSIMETRY_DEEP_DOSE]);
      } else if (row[NURIMS_DOSIMETRY_TYPE] === "extremity" && dosimetryType === "extremity") {
        d0.push(row[NURIMS_DOSIMETRY_EXTREMITY_DOSE]);
      } else if (row[NURIMS_DOSIMETRY_TYPE] === "wrist" && dosimetryType === "wrist") {
        d0.push(row[NURIMS_DOSIMETRY_WRIST_DOSE]);
      }
    }
  }
  const series_data = [];
  const h_series_data = [];
  let q0 = [];
  let q1 = [];
  let b0 = [];
  let b1 = [];
  let d0_mean = 0;
  let d1_mean = 0;
  let d0_std = 0;
  let d1_std = 0;
  let d0_skewness = 0;
  let d1_skewness = 0;
  if (dosimetryType === "wholebody") {
    q0 = d0.length > 4 ? ss.quantile(d0, [0.01, 0.25, 0.5, 0.75, 0.99]) : [0, 0, 0, 0, 0];
    q1 = d1.length > 4 ? ss.quantile(d1, [0.01, 0.25, 0.5, 0.75, 0.99]) : [0, 0, 0, 0, 0];
    d0_mean = d0.length > 1 ? ss.mean(d0) : 0;
    d1_mean = d1.length > 1 ? ss.mean(d1) : 0;
    d0_std = d0.length > 4 ? ss.standardDeviation(d0) : 0;
    d1_std = d1.length > 4 ? ss.standardDeviation(d1) : 0;
    d0_skewness = d0.length > 4 ? ss.sampleSkewness(d0) : 0;
    d1_skewness = d1.length > 4 ? ss.sampleSkewness(d1) : 0;
    b0 = d0.length > 2 ? histogram(d0, 10) : [];
    b1 = d1.length > 2 ? histogram(d1, 10) : [];
    series_data.push(
      {
        x: 'Shallow',
        y: [parseFloat(q0[0].toFixed(2)),
          parseFloat(q0[1].toFixed(2)),
          parseFloat(q0[2].toFixed(2)),
          parseFloat(q0[3].toFixed(2)),
          parseFloat(q0[4].toFixed(2))]
      },
      {
        x: 'Deep',
        y: [parseFloat(q1[0].toFixed(2)),
          parseFloat(q1[1].toFixed(2)),
          parseFloat(q1[2].toFixed(2)),
          parseFloat(q1[3].toFixed(2)),
          parseFloat(q1[4].toFixed(2))]
      },
    );
    h_series_data.push(
      {
        name: "Shallow",
        data: b0.reduce((prev, obj) => {
          prev.push(obj.count);
          return prev;
        }, [])
      },
      {
        name: "Deep",
        data: b1.reduce((prev, obj) => {
          prev.push(obj.count);
          return prev;
        }, [])
      }
    );
  } else if (dosimetryType === "extremity") {
    q0 = d0.length > 4 ? ss.quantile(d0, [0.01, 0.25, 0.5, 0.75, 0.99]) : [0, 0, 0, 0, 0];
    d0_mean = d0.length > 1 ? ss.mean(d0) : 0;
    d0_std = d0.length > 4 ? ss.standardDeviation(d0) : 0;
    d0_skewness = d0.length > 4 ? ss.sampleSkewness(d0) : 0;
    series_data.push(
      {
        x: 'Extremity',
        y: [parseFloat(q0[0].toFixed(2)),
          parseFloat(q0[1].toFixed(2)),
          parseFloat(q0[2].toFixed(2)),
          parseFloat(q0[3].toFixed(2)),
          parseFloat(q0[4].toFixed(2))]
      }
    );
    h_series_data.push(
      {
        name: "Extremity",
        data: b0.reduce((prev, obj) => {
          prev.push(obj.count);
          return prev;
        }, [])
      },
    );
  } else if (dosimetryType === "wrist") {
    q0 = d0.length > 4 ? ss.quantile(d0, [0.01, 0.25, 0.5, 0.75, 0.99]) : [0, 0, 0, 0, 0];
    d0_mean = d0.length > 1 ? ss.mean(d0) : 0;
    d0_std = d0.length > 4 ? ss.standardDeviation(d0) : 0;
    d0_skewness = d0.length > 4 ? ss.sampleSkewness(d0) : 0;
    series_data.push(
      {
        x: 'Wrist',
        y: [parseFloat(q0[0].toFixed(2)),
          parseFloat(q0[1].toFixed(2)),
          parseFloat(q0[2].toFixed(2)),
          parseFloat(q0[3].toFixed(2)),
          parseFloat(q0[4].toFixed(2))]
      }
    );
    h_series_data.push(
      {
        name: "Wrist",
        data: b0.reduce((prev, obj) => {
          prev.push(obj.count);
          return prev;
        }, [])
      },
    );
  }
  console.log("FROM", ts_min, "TO", ts_max)
  console.log("MEAN0", d0_mean)
  console.log("MEAN1", d1_mean)
  console.log("QUANTILE0", q0)
  console.log("QUANTILE1", q1)
  console.log("STD0", d0_std)
  console.log("STD1", d1_std)
  console.log("SKEWNESS0", d0_skewness)
  console.log("SKEWNESS1", d1_skewness)
  console.log("BINS0", b0)
  console.log("BINS1", b1)

  return {
    d0,
    q0,
    q1,
    d0_mean,
    d1_mean,
    d0_std,
    d1_std,
    d0_skewness,
    d1_skewness,
    series_data,
    ts_min,
    ts_max,
    b0,
    h_series_data
  }
}
