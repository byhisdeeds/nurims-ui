import {ConsoleLog} from "./UserContext";
import {CMD_GET_PROVENANCE_RECORDS} from "./constants";


export function setProvenanceRecordsHelper(THIS, provenance) {
  if (THIS.context.debug) {
    ConsoleLog(THIS.Module, "setProvenanceRecords", "provenance", provenance);
  }
  THIS.provenanceRecords.length = 0;
  if (provenance.length > 0) {
    for (const p of provenance) {
      THIS.provenanceRecords.push(
        `[${p.ts}] Submitted by ${p.submitted_by}, ${p.authenticated?"authenticated user":"unauthenticated user"}\n${p.text}\n`)
    }
  } else {
    THIS.provenanceRecords.push("No records found");
  }
  THIS.forceUpdate();
}

export function showProvenanceRecordsViewHelper(THIS, module){
  if (THIS.context.debug) {
    ConsoleLog(THIS.Module, "showProvenanceRecordsViewHelper", "selection", THIS.state.selection);
  }
  THIS.props.send({
    cmd: CMD_GET_PROVENANCE_RECORDS,
    item_id: THIS.state.selection.item_id,
    module: (module) ? module : THIS.Module,
  });
  THIS.setState({show_provenance_view: true,});
}

