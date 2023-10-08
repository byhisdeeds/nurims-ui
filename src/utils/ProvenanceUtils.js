import {ConsoleLog} from "./UserDebugContext";
import {CMD_GET_PROVENANCE_RECORDS} from "./constants";


export function setProvenanceRecordsHelper(THIS, provenance) {
  if (THIS.context.debug) {
    ConsoleLog(THIS.Module, "setProvenanceRecords", "provenance", provenance);
  }
  THIS.provenanceRecords.length = 0;
  if (provenance.length > 0) {
    for (const p of provenance) {
      THIS.provenanceRecords.push(`   Timestamp: ${p.ts}\n        Text: ${p.text}\nSubmitted By: ${p.submitted_by}\n`)
    }
  } else {
    THIS.provenanceRecords.push("No records found");
  }
  THIS.forceUpdate();
}

export function showProvenanceRecordsViewHelper(THIS){
  THIS.props.send({
    cmd: CMD_GET_PROVENANCE_RECORDS,
    item_id: THIS.state.selection.item_id,
    module: THIS.Module,
  });
  if (THIS.context.debug) {
    ConsoleLog(THIS.Module, "viewProvenanceRecords", "selection", THIS.state.selection);
  }
  THIS.setState({show_provenance_view: true,});
}

