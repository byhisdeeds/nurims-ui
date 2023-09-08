import {
  getRecordMetadataValue,
  setDoseRecordMetadataValue
} from "./MetadataUtils";
import {enqueueWarningSnackbar} from "./SnackbarVariants";

const DOSE_TRANSFORM_TABLE = {
  "mr-mr": 1.0,
  "msv-msv": 1.0,
  "usv-msv": 0.001,
  "usv-ur": 100,
  "usv-mr": 0.1,
  "usv-r": 0.0001,
  "msv-ur": 100000,
  "msv-mr": 100,
  "msv-r": 0.1,
  "sv-ur": 100000000,
  "sv-mr": 100000,
  "sv-r": 100,
  "ur-usv": 0.01,
  "ur-msv": 0.00001,
  "ur-sv": 0.00000001,
  "mr-usv": 10,
  "mr-msv": 0.01,
  "mr-sv": 0.00001,
  "r-usv": 10000,
  "r-msv": 10,
  "r-sv": 0.01,
}


export function isIcensDoseReport (data) {
  return (data.hasOwnProperty("dosereport"));
}

export function importIcensDoseReport (data, persons, doseUnit) {
  const dr = data.dosereport;
  if (dr.hasOwnProperty("badges")) {
    const badges = dr.badges;
    if (typeof badges === "object") {
      if (badges.hasOwnProperty("badge")) {
        const badge = badges.badge;
        if (Array.isArray(badge)) {
          for (const b of badge) {
            const name = b["tld.employee.name"];
            const id = b["tld.dosimeter.employee"].split("/")[1];
            const batchid = b["tld.dosimeter.distributionbatchid"];
            const timestamp = b["tld.dosimeter.timestamp"];
            const monitorPeriod = b["tld.dosimeter.monitorperiod"].replace(" to ", "|");
            const status = b["tld.dosimeter.status"];
            // const hasNoControl = b["outofsyncwithcontrol"];
            const responseUnits = b["tld.dosimeter.responseunit"].toLowerCase();
            console.log("EMPLOYEE", name, b["tld.dosimeter.employee"], id);
            // find person
            for (const person of persons) {
              const doseProvider = getRecordMetadataValue(person, "nurims.entity.doseproviderid", "|").split("|");
              const wholeBodyMonitor = getRecordMetadataValue(person, "nurims.entity.iswholebodymonitored", "false");
              const extremityMonitor = getRecordMetadataValue(person, "nurims.entity.isextremitymonitored", "false");
              const wristMonitor = getRecordMetadataValue(person, "nurims.entity.iswristmonitored", "false");
              if (doseProvider.length === 2) {
                const doseProviderId = doseProvider[1];
                if (id === doseProviderId) {
                  // found match
                  const dosimeter = b["dc.title"];
                  const fac = (doseUnit) ? transformDoseFactor(responseUnits, doseUnit) : 1;
                  if (status === "read") {
                    if (wholeBodyMonitor === "true" && b["dc.type"] === "Whole Body Dose Record") {
                      const r3 = b["tld.dosimeter.r3"];
                      const r2 = b["tld.dosimeter.r2"];
                      setDoseRecordMetadataValue(person, dosimeter, "WholeBody", "nurims.dosimeter.batchid", batchid);
                      setDoseRecordMetadataValue(person, dosimeter, "WholeBody", "nurims.dosimeter.timestamp", timestamp);
                      setDoseRecordMetadataValue(person, dosimeter, "WholeBody", "nurims.dosimeter.units", doseUnit);
                      setDoseRecordMetadataValue(person, dosimeter, "WholeBody", "nurims.dosimeter.monitorperiod", monitorPeriod);
                      setDoseRecordMetadataValue(person, dosimeter, "WholeBody", "nurims.dosimeter.shallowdose", r3*fac);
                      setDoseRecordMetadataValue(person, dosimeter, "WholeBody", "nurims.dosimeter.deepdose", r2*fac);
                    } else if (wristMonitor === "true" && b["dc.type"] === "Wrist Dose Record") {
                      const r2 = b["tld.dosimeter.r2"];
                      setDoseRecordMetadataValue(person, dosimeter, "Wrist", "nurims.dosimeter.batchid", batchid);
                      setDoseRecordMetadataValue(person, dosimeter, "Wrist", "nurims.dosimeter.timestamp", timestamp);
                      setDoseRecordMetadataValue(person, dosimeter, "Wrist", "nurims.dosimeter.units", doseUnit);
                      setDoseRecordMetadataValue(person, dosimeter, "Wrist", "nurims.dosimeter.monitorperiod", monitorPeriod);
                      setDoseRecordMetadataValue(person, dosimeter, "Wrist", "nurims.dosimeter.wristdose", r2*fac);
                    } else if (extremityMonitor === "true" && b["dc.type"] === "Extremity Dose Record") {
                      const r2 = b["tld.dosimeter.r2"];
                      setDoseRecordMetadataValue(person, dosimeter, "Extremity", "nurims.dosimeter.batchid", batchid);
                      setDoseRecordMetadataValue(person, dosimeter, "Extremity", "nurims.dosimeter.timestamp", timestamp);
                      setDoseRecordMetadataValue(person, dosimeter, "Extremity", "nurims.dosimeter.units", doseUnit);
                      setDoseRecordMetadataValue(person, dosimeter, "Extremity", "nurims.dosimeter.monitorperiod", monitorPeriod);
                      setDoseRecordMetadataValue(person, dosimeter, "Extremity", "nurims.dosimeter.extremitydose", r2*fac);
                    }
                  } else {
                    enqueueWarningSnackbar(`Ignoring dosimeter reading for ${name}(${id}) which was tagged as ${status}`);
                  }
                }
              }
            }
          }
        } else {
          enqueueWarningSnackbar(`Incorrect dosereport.badges.badge type in dose report data file. Expecting an array but found ${typeof badge}`)
        }
      }
    } else {
      enqueueWarningSnackbar(`Incorrect dosereport.badges type in dose report data file. Expecting an object but found ${typeof badges}`)
    }
  } else {
    enqueueWarningSnackbar('Missing dosereport.badges field in dose report data file')
  }
}

export function transformDoseFactor(_from, _to) {
  const transformKey = _from+"-"+_to;

  if (DOSE_TRANSFORM_TABLE.hasOwnProperty(transformKey)) {
    return DOSE_TRANSFORM_TABLE[transformKey];
  }
  return -1.0
}


export function transformDose(dose, _from, _to) {
  const transformKey = _from+"-"+_to;

  if (DOSE_TRANSFORM_TABLE.hasOwnProperty(transformKey)) {
    return dose * DOSE_TRANSFORM_TABLE[transformKey];
  }
  return -1.0 * dose;
}
