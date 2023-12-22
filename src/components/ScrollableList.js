import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  withTheme
} from "@mui/styles";
import {
  UserContext
} from "../utils/UserContext";
import Highlight from "react-highlight";
import 'react-highlight/node_modules/highlight.js/styles/agate.css'


const SCROLLABLELIST_REF = "ScrollableList";

class ScrollableList extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = SCROLLABLELIST_REF;
  }

  render() {
    const {theme, forceScroll, className, items, highlight, height, maxItems} = this.props;
    // trim messages array size to maximum
    if (items.length > maxItems) {
      items.splice(0, items.length - maxItems);
    }
    return (
      <div
        data-color-mode={theme.palette.mode}
        style={{
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.light,
          overflowY: "auto",
          width: "100%",
          height: height
        }}
      >
        <Highlight className='accesslog' language="logger">
          {`[2023-12-21 00:29:04] Websocket connection to server (GETTTTT) (GETTTTTTT) (GETT) established for client chrome-p6qD-7zzq1JkaS-OXR2Yn
[2023-12-20 19:29:04] Re-connecting client {'chrome-p6qD-7zzq1JkaS-OXR2Yn (::1)'}
[2023-12-20 19:29:22] Scan of 001570_SLOWPOKE190424_144159.GTE took 20 seconds
[2023-12-20 19:29:22] Continuing scan in 001571_SLOWPOKE190425_144159.GTE for operating data. Control rod position was not 0 at the end of the last scan ...
[2023-12-20 19:29:42] Scan of 001571_SLOWPOKE190425_144159.GTE took 20 seconds
[2023-12-20 19:30:04] 1 run(s) found in ['001570_SLOWPOKE190424_144159.GTE', '001571_SLOWPOKE190425_144159.GTE']. Search took 21 seconds
[2023-12-20 19:30:04] Reading drm-971073-2019-04-25.json for radiation monitoring data ...
[2023-12-20 19:30:04] Reading drm-971098-2019-04-25.json for radiation monitoring data ...
[2023-12-20 19:30:05] Found 4670 reactor monitor records and 4695 ceiling monitor records.
[2023-12-20 19:30:17] Found 37797 control rod movement data.
[2023-12-20 19:30:17] Found 37797 neutron flux data.
[2023-12-20 19:30:17] Found 37797 inlet temperature data.
[2023-12-20 19:30:17] Found 37797 outlet temperature data.
[2023-12-20 19:30:17] Found 3775 reactor pool radiation data.
[2023-12-20 19:30:17] Found 3797 ceiling radmon data.
[2023-12-20 19:30:18] k-excess for run '20190425-1150' 2.82 with period 12.62 [12.6,2.826 - 12.65,2.82]
[2023-12-20 19:30:18] Temperature adjusted k-excess for run '20190425-1150' 3.04 @ 21.6, [21.5,0.223 - 22.0,0.203]
[2023-12-20 19:30:18] Run summary: start: 2019-04-25T11:50:32.500, end: 2019-04-25T16:05:30.000, data_start: 2019-04-25T11:20:32, data_end: 2019-04-25T16:35:30, id: 20190425-1150, rod_events: [{timestamp: 2019-04-25T11:50:33, reading: 0.020, state: rod_moving_out}, {timestamp: 2019-04-25T11:50:55, reading: 8.010, state: rod_out}, {timestamp: 2019-04-25T11:53:15, reading: 8.010, state: rod_moving_in}, {timestamp: 2019-04-25T11:53:57.500000, reading: 4.090, state: rod_stable}, {timestamp: 2019-04-25T11:54:13, reading: 3.920, state: rod_moving_in}, {timestamp: 2019-04-25T11:54:14, reading: 3.890, state: rod_stable} ...] 176 item(s), duration: 15297.5, rod_out_time: 1823.0, rod_out_speed: 0.36, rod_out_speed_r: 1.0, flux: [{flux: 10.000, n: 27919, std: 0.015, variance: 0.000, min: 9.990, p50: 10.020, max: 10.040}] 1 item(s), flux_hours: 168.681, excess_reactivity: 3.04, excess_reactivity_correction: 0.219, reactivity_period_40_80: 12.62, irrad_log_count: 0, inlet_temp_startup: 21.4, inlet_temp_shutdown: 29.4, inlet_temp_min: 21.4, inlet_temp_max: 37.3, inlet_temp_mean: 31.81, inlet_temp_range: 15.9, outlet_temp_startup: 21.5, outlet_temp_shutdown: 31.5, outlet_temp_min: 21.5, outlet_temp_max: 56.8, outlet_temp_mean: 47.75, outlet_temp_range: 35.3, reactor_radmon_startup: 0.1, reactor_radmon_shutdown: 33.7, reactor_radmon_min: 0.1, reactor_radmon_max: 38.2, reactor_radmon_mean: 31.78, reactor_radmon_range: 38.1, reactor_radmon_dose: 134.97, reactor_radmon_dose_units: usv/hr, ceiling_radmon_startup: 0.2, ceiling_radmon_shutdown: 9.7, ceiling_radmon_min: 0.1, ceiling_radmon_max: 12.2, ceiling_radmon_mean: 9.74, ceiling_radmon_range: 12.1, ceiling_radmon_dose: 41.38, ceiling_radmon_dose_units: usv/hr
[2023-12-20 19:30:21] Stored operating run record (6618) in database.
64.23.136.190 - - [17/Dec/2023:00:14:40 -0500] "BET / HTTP/1.1" 200 12 "-" "Mozilla/5.0 infrawatch/0.1"
64.23.136.190 - - [17/Dec/2023:00:14:40 -0500] "POST /systembc/password.php HTTP/1.1" 404 196 "-" "Mozilla/5.0 infrawatch/0.1"
64.23.136.190 - - [17/Dec/2023:00:14:41 -0500] "GET /Ep1v HTTP/1.1" 404 196 "-" "Mozilla/5.0 infrawatch/0.1"
64.23.136.190 - - [17/Dec/2023:00:14:41 -0500] "GET /GWqN HTTP/1.1" 404 196 "-" "Mozilla/5.0 infrawatch/0.1"
2.56.247.167 - - [17/Dec/2023:00:16:11 -0500] "RET / HTTP/1.1" 200 12 "-" "-"
42.83.147.53 - - [17/Dec/2023:00:28:46 -0500] "GET / HTTP/1.1" 200 12 "-" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)Chrome/74.0.3729.169 Safari/537.36"
185.224.128.191 - - [17/Dec/2023:00:30:58 -0500] "GET / HTTP/1.1" 200 12 "-" "-"
35.203.210.185 - - [17/Dec/2023:00:42:07 -0500] "GET / HTTP/1.1" 200 12 "-" "Expanse, a Palo Alto Networks company, searches across the global IPv4 space multiple times per day to identify customers&#39; presences on the Internet. If you would like to be excluded from our scans, please send IP addresses/domains to: scaninfo@paloaltonetworks.com"
91.92.243.232 - - [17/Dec/2023:00:47:21 -0500] "GET / HTTP/1.1" 200 12 "-" "-"
91.92.243.232 - - [17/Dec/2023:00:47:39 -0500] "GET ../../proc/ HTTP" 400 226 "-" "-"
222.230.118.45 - - [17/Dec/2023:01:18:53 -0500] "GET / HTTP/1.1" 200 12 "-" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
179.43.183.170 - - [17/Dec/2023:01:43:04 -0500] "GET /web/cgi-bin/hi3510/param.cgi?cmd=getuser HTTP/1.1" 404 196 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
36.41.75.167 - - [17/Dec/2023:01:43:29 -0500] "GET / HTTP/1.1" 200 12 "-" "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
109.205.213.94 - - [17/Dec/2023:01:44:16 -0500] "GET / HTTP/1.1" 200 12 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46"
45.142.182.77 - - [17/Dec/2023:02:05:38 -0500] "GET / HTTP/1.1" 200 12 "-" "-"
45.142.182.77 - - [17/Dec/2023:02:05:45 -0500] "GET ../../proc/ HTTP" 400 226 "-" "-"
103.99.0.154 - - [17/Dec/2023:02:12:39 -0500] "GET /.env HTTP/1.1" 404 196 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
103.99.0.154 - - [17/Dec/2023:02:12:40 -0500] "POST / HTTP/1.1" 200 12 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
185.134.22.149 - - [17/Dec/2023:02:43:09 -0500] "GET / HTTP/1.1" 200 12 "-" "Mozilla/5.0 infrawatch/0.1"
185.134.22.149 - - [17/Dec/2023:02:43:10 -0500] "GET /systembc/password.php HTTP/1.1" 404 196 "-" "Mozilla/5.0 infrawatch/0.1"
185.134.22.149 - - [17/Dec/2023:02:43:12 -0500] "GET /Ep1v HTTP/1.1" 404 196 "-" "Mozilla/5.0 infrawatch/0.1"
185.134.22.149 - - [17/Dec/2023:02:43:13 -0500] "GET /GWqN HTTP/1.1" 404 196 "-" "Mozilla/5.0 infrawatch/0.1"
`}
        </Highlight>
      </div>
    )
  }
}

ScrollableList.propTypes = {
  height: PropTypes.string,
  highlight: PropTypes.func,
  theme: PropTypes.object.isRequired,
  logs: PropTypes.array.isRequired,
  forceScroll: PropTypes.bool,
  classname: PropTypes.string.isRequired,
  items: PropTypes.array,
  maxItems: PropTypes.number,
}

ScrollableList.defaultProps = {
  highlight: () => {},
  forceScroll: false,
  className: "",
  items: [],
  maxItems: 100,
  height: "calc(100% - 0px)",
}

export default withTheme(ScrollableList)
