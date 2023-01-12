import {isValid, parse} from "date-fns";

const DateFormats = [
  'yyyy-MM-dd',
  'yyyy-MM-dd HH:mm:ss',
  'yyyy-MM-dd HH:mm:ss A',
  'yyyy-MM-dd HH:mm',
  'yyyy-MM-dd HH:mm A',
  'MMMM dd, yyyy',
  // 'MMMM Do, yyyy',
  'MMM dd, yyyy',
  // 'MMM Do, yyyy',
  'MMMM dd yyyy',
  // 'MMMM Do yyyy',
  'MMM dd yyyy',
  // 'MMM Do yyyy',
  'EEEE, MMMM dd yyyy, HH:mm',
  'EEEE, MMMM dd yyyy, HH:mm A',
  // 'EEEE, MMMM Do yyyy, HH:mm',
  // 'EEEE, MMMM Do yyyy, HH:mm A',
  'EEEE MMMM dd yyyy HH:mm',
  'EEEE MMMM dd yyyy HH:mm A',
  // 'EEEE MMMM Do yyyy HH:mm',
  // 'EEEE MMMM Do yyyy HH:mm A',
  'EEEE, MMMM dd yyyy, HH:mm:ss',
  'EEEE, MMMM dd yyyy, HH:mm:ss A',
  // 'EEEE, MMMM Do yyyy, HH:mm:ss',
  // 'EEEE, MMMM Do yyyy, HH:mm:ss A',
  'EEEE MMMM dd yyyy HH:mm:ss',
  'EEEE MMMM dd yyyy HH:mm:ss A',
  // 'EEEE MMMM Do yyyy HH:mm:ss',
  // 'EEEE MMMM Do yyyy HH:mm:ss A',
  'MM/dd/yyyy',
  'MM dd yyyy',
  'dd MMMM yyyy',
  // 'Do MMMM yyyy',
  'yyyy MMMM dd',
  'yyyy-MM-dd HH:mm:ss'
];

export function dateFromDateString(dateString) {
  let result;

  for (let i = 0; i < DateFormats.length; i++) {
    result = parse(dateString, DateFormats[i], new Date());
    if (isValid(result)) {
      return result;
    }
  }

  return parse("1970-01-01", 'yyyy-MM-dd', new Date());
};
