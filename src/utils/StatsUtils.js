import * as ss from "simple-statistics";
import {
  EXTREMITY,
  NURIMS_DOSIMETRY_DEEP_DOSE,
  NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_MONITOR_PERIOD,
  NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_WRIST_DOSE,
  WHOLE_BODY,
  WRIST
} from "./constants";
import {getDateRangeAsDays} from "./MetadataUtils";
import dayjs from 'dayjs';


export function doseProfileStats(rows, dosimetryType, groupDataRange) {
  if (rows.length === 0) return [];
  // sort by dosimetry timestamp
  rows.sort((a,b) => (a[NURIMS_DOSIMETRY_TIMESTAMP] > b[NURIMS_DOSIMETRY_TIMESTAMP]) ? 1 :
    ((b[NURIMS_DOSIMETRY_TIMESTAMP] > a[NURIMS_DOSIMETRY_TIMESTAMP]) ? -1 : 0))
  console.log("DOSE-PROFILE", "YEAR-RANGE", groupDataRange, "ROWS", rows)
  // dataset year range
  const year0 = parseInt(rows[0][NURIMS_DOSIMETRY_TIMESTAMP].substring(0, 4));
  const year1 = parseInt(rows[rows.length-1][NURIMS_DOSIMETRY_TIMESTAMP].substring(0, 4));
  const series = [];
  for (let i=year0; i<=year1; i+=groupDataRange) {
    series.push({
      d0: [],
      d1: [],
      min: i,
      max: i+groupDataRange-1,
      name:groupDataRange === 1 ? `${i}` : `${i}-${i+groupDataRange-1}`
    });
  }
  for (const row of rows) {
    if (row.use) {
      const year = row[NURIMS_DOSIMETRY_TIMESTAMP].substring(0, 4);
      for (const s of series) {
        if (s.min <= year && year <= s.max) {
          const {d0, d1} = getDosimetryValue(row, dosimetryType);
          if (d0) {
            s.d0.push(d0);
          }
          if (d1) {
            s.d1.push(d1);
          }
        }
      }
    }
  }
  // prepare box and whiskers series
  const profile_series = [
    {
      name: "shallow",
      data: [],
    },
    {
      name: "deep",
      data: [],
    }
  ];
  for (const s of series) {
    const q0 = s.d0.length > 4 ? ss.quantile(s.d0, [0, 0.25, 0.5, 0.75, 1]) : [0, 0, 0, 0, 0];
    const q1 = s.d1.length > 4 ? ss.quantile(s.d1, [0, 0.25, 0.5, 0.75, 1]) : [0, 0, 0, 0, 0];
    profile_series[0].data.push({
      x: s.name,
      y: [parseFloat(q0[0].toFixed(2)),
        parseFloat(q0[1].toFixed(2)),
        parseFloat(q0[2].toFixed(2)),
        parseFloat(q0[3].toFixed(2)),
        parseFloat(q0[4].toFixed(2))],
    });
    profile_series[1].data.push({
      x: s.name,
      y: [parseFloat(q1[0].toFixed(2)),
        parseFloat(q1[1].toFixed(2)),
        parseFloat(q1[2].toFixed(2)),
        parseFloat(q1[3].toFixed(2)),
        parseFloat(q1[4].toFixed(2))],
    });
  }
  console.log("DOSE-PROFILE", "PROFILE_SERIES", profile_series)
  return profile_series;
}

export function getDosimetryValue(row, dosimetryType) {
  let d0 = null;
  let d1 = null;
  if (row[NURIMS_DOSIMETRY_TYPE] === WHOLE_BODY && dosimetryType === WHOLE_BODY) {
    d0 = row[NURIMS_DOSIMETRY_SHALLOW_DOSE];
    d1 = row[NURIMS_DOSIMETRY_DEEP_DOSE];
  } else if (row[NURIMS_DOSIMETRY_TYPE] === EXTREMITY && dosimetryType === EXTREMITY) {
    d0 = row[NURIMS_DOSIMETRY_EXTREMITY_DOSE];
  } else if (row[NURIMS_DOSIMETRY_TYPE] === WRIST && dosimetryType === WRIST) {
    d0 = row[NURIMS_DOSIMETRY_WRIST_DOSE];
  }
  return {d0, d1}
}

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
  // calculate QA stats
  qaStats(rows, dosimetryType);
  descriptiveStats(rows, dosimetryType)

  // Return descriptive stats
  return descriptiveStats(rows, dosimetryType);
}

function descriptiveStats(rows, dosimetryType) {
  let ts_min = null;
  let ts_max = null;
  const d0 = [];
  const d1 = [];
  // re-calculate descriptive statistics dataset
  for (const row of rows) {
    if (row.use) {
      const ts = dayjs(row[NURIMS_DOSIMETRY_TIMESTAMP]);
      if (ts_min === null || ts_max === null) {
        ts_min = ts;
        ts_max = ts;
      } else if (ts.unix() <= ts_min.unix()) {
        ts_min = ts;
      } else if (ts.unix() >= ts_max.unix()) {
        ts_max = ts;
      }
      if (row[NURIMS_DOSIMETRY_TYPE] === WHOLE_BODY && dosimetryType === WHOLE_BODY) {
        d0.push(row[NURIMS_DOSIMETRY_SHALLOW_DOSE]);
        d1.push(row[NURIMS_DOSIMETRY_DEEP_DOSE]);
      } else if (row[NURIMS_DOSIMETRY_TYPE] === EXTREMITY && dosimetryType === EXTREMITY) {
        d0.push(row[NURIMS_DOSIMETRY_EXTREMITY_DOSE]);
      } else if (row[NURIMS_DOSIMETRY_TYPE] === WRIST && dosimetryType === WRIST) {
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
  if (dosimetryType === WHOLE_BODY) {
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
  } else if (dosimetryType === EXTREMITY) {
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
  } else if (dosimetryType === WRIST) {
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

function qaStats(rows, dosimetryType) {
  // sort by dosimetry timestamp
  rows.sort((a,b) => (a[NURIMS_DOSIMETRY_TIMESTAMP] > b[NURIMS_DOSIMETRY_TIMESTAMP]) ? 1 :
                    ((b[NURIMS_DOSIMETRY_TIMESTAMP] > a[NURIMS_DOSIMETRY_TIMESTAMP]) ? -1 : 0))
  // console.log("QA-STATS", "ROWS", rows)
  // start calculating QA stats when you have at least 4 previous readings
  // ** remember we only use selected rows
  let count = 0;
  let timestamp = null;
  const pdata = [];
  for (const row of rows) {
    if (row.use) {
      if (count < 5) {
        pdata.push(row);
        count ++;
      } else {
        timestamp = row[NURIMS_DOSIMETRY_TIMESTAMP];
        // console.log("QA-STATS", "++++ CONSIDERING TIMESTAMP", timestamp)
        // console.log("QA-STATS", "++++ PREVIOUS DATA", pdata)
        const pd0 = [];
        const pd1 = [];
        for (const d of pdata) {
          // calculate number of days dosimetry was carried out
          const days = getDateRangeAsDays(d[NURIMS_DOSIMETRY_MONITOR_PERIOD].replaceAll(" to ", "|"), 1);
          // console.log("QA-STATS", "++++ PDATA DAYS", days)
          const {d0, d1} = getDosimetryValue(d, dosimetryType);
          // console.log("QA-STATS", "++++ PDATA", d0, d1)
          if (d0) {
            pd0.push(d0/days);
          }
          if (d1) {
            pd1.push(d1/days);
          }
        }
        if (dosimetryType === "wholebody") {
          const days = getDateRangeAsDays(row[NURIMS_DOSIMETRY_MONITOR_PERIOD].replaceAll(" to ", "|"), 1);
          const {d0, d1} = getDosimetryValue(row, dosimetryType);
          // console.log("QA-STATS", "++++ DAYS", days)
          // console.log("QA-STATS", "++++ DOSIMETRY VALUE", d0, d0/days, d1, d1/days)
          // console.log("QA-STATS", "++++ MIN", ss.min(pd0), ss.min(pd1))
          // console.log("QA-STATS", "++++ MAX", ss.max(pd0), ss.max(pd1))
          // console.log("QA-STATS", "++++ MEAN", ss.mean(pd0), ss.mean(pd1))
          // console.log("QA-STATS", "++++ STD.", ss.standardDeviation(pd0), ss.standardDeviation(pd1))
          // <1 signifies that the dose value is within 1 standard deviation of the data,
          // <2 signifies that the dose value is within 2 standard deviations of the data, and so on.
          // If the value is >2 then the dose value can be considered an outlier.
          // console.log("QA-STATS", "++++ QA-VALUE",
          //   Math.floor(Math.abs((d0/days - ss.mean(pd0)) / ss.standardDeviation(pd0))) + 1,
          //   Math.floor(Math.abs((d1/days - ss.mean(pd1)) / ss.standardDeviation(pd1))) + 1)
          const qad0 = Math.floor(Math.abs((d0/days - ss.mean(pd0)) / ss.standardDeviation(pd0))) + 1;
          const qad1 = Math.floor(Math.abs((d1/days - ss.mean(pd1)) / ss.standardDeviation(pd1))) + 1;
          row[`${NURIMS_DOSIMETRY_SHALLOW_DOSE}.qa`] = (qad0 <= 2) ? `<${qad0}` : ">2";
          row[`${NURIMS_DOSIMETRY_DEEP_DOSE}.qa`] = (qad1 <= 2) ? `<${qad1}` : ">2";
        }
        // console.log("QA-STATS", " ")
        // add this row to the previous data to be used in the next loop
        pdata.push(row);
      }
    }
  }
}
