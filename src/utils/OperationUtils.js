import dayjs from 'dayjs';


export function runidAsTitle(runid) {
// def get_run_data_title(start_timestamp):
//     return "{}{}{}-{}{}".format(start_timestamp[0:4], start_timestamp[5:7], start_timestamp[8:10],
//                                 start_timestamp[11:13], start_timestamp[14:16])
  try {
    const year = Number.parseInt(runid.substring(0,4));
    const month = Number.parseInt(runid.substring(4,6));
    const day = Number.parseInt(runid.substring(6,8));
    const hour = runid.substring(9,11);
    const minute = runid.substring(11,13);
    const date = dayjs(`${year}-${month}-${day}`);
    return `${date.format("dddd, MMMM D YYYY")} at ${hour}:${minute}`;
  } catch (error) {
    return runid
  }
}