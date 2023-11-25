import dayjs from 'dayjs';


export function runidAsTitle(runid) {
  if (runid) {
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
  return "";
}