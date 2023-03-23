import {lazy} from "react";
// import ManageUsers from "./sysadmin/ManageUsers";
// import AddEditPersonnel from "./personnel/AddEditPersonnel";
// import UpdateMonitoringStatus from "./personnel/UpdateMonitoringStatus";
// import ViewPersonnelRecords from "./personnel/ViewPersonnelRecords";
// import ViewMaterialsList from "./controlledmaterials/ViewMaterialsList";
// import Material from "./controlledmaterials/Material";
// import Manufacturer from "./controlledmaterials/Manufacturer";
// import GenerateMaterialSurveillanceSheet from "./controlledmaterials/GenerateMaterialSurveillanceSheet";
// import ViewSSCRecords from "./maintenance/ViewSSCRecords";
// import AddEditAMP from "./maintenance/AddEditAMP";
// import AddEditSSC from "./maintenance/AddEditSSC";
// import AddEditCorrectiveMaintenanceIssueRecord from "./maintenance/AddEditCorrectiveMaintenanceIssueRecord";
// import GenerateSSCMaintenanceReport from "./maintenance/GenerateSSCMaintenanceReport";
// import AddEditMonitors from "./radiationprotection/AddEditMonitors";
// import PersonnelDosimetryMeasurement from "./radiationprotection/PersonnelDosimetryMeasurement";
// import MonitorDosimetryMeasurement from "./radiationprotection/MonitorDosimetryMeasurement";
// import PersonnelDosimetryEvaluation from "./radiationprotection/PersonnelDosimetryEvaluation";
// import PersonnelDosimetryReport from "./radiationprotection/PersonnelDosimetryReport";
// import ImportICENSPersonnel from "./packages/icens/ImportICENSPersonnel";
// import ImportICENSControlledMaterialManufacturers from "./packages/icens/ImportICENSControlledMaterialManufacturers";
// import ImportICENSControlledMaterialStorageLocations
//   from "./packages/icens/ImportICENSControlledMaterialStorageLocations";
// import ImportICENSControlledMaterials from "./packages/icens/ImportICENSControlledMaterials";
// import ImportICENSMonitors from "./packages/icens/ImportICENSMonitors";
// import AddEditReactorOperatingRuns from "./packages/icens/AddEditReactorOperatingRuns";
// import AddEditIrradiatedSamples from "./packages/icens/AddEditIrradiatedSamples";
// import ReactorOperationsReport from "./packages/icens/ReactorOperationsReport";
// import AddEditReactorWaterSamples from "./packages/icens/AddEditReactorWaterSamples";
// import AddEditReactorSampleIrradiationAuthorization
//   from "./packages/icens/AddEditReactorSampleIrradiationAuthorization";
// import GenerateReactorSampleIrradiationAuthorizationPdf
//   from "./packages/icens/GenerateReactorSampleIrradiationAuthorizationPdf";
// import {lazy} from "react";
// import TermsAndDefinitions from "./support/TermsAndDefinitions";

const Constants = require("../utils/constants");
const {MANAGEUSERS_REF} = require("./sysadmin/ManageUsers");
const {ADDEDITPERSONNEL_REF} = require("./personnel/AddEditPersonnel");
const {UPDATEMONITORINGSTATUS_REF} = require("./personnel/UpdateMonitoringStatus");
const {VIEWPERSONNELRECORDS_REF} = require("./personnel/ViewPersonnelRecords");
const {VIEWMATERIALSLIST_REF} = require("./controlledmaterials/ViewMaterialsList");
const {MATERIAL_REF} = require("./controlledmaterials/Material");
const {STORAGE_REF} = require("./controlledmaterials/Storage");
const {MANUFACTURER_REF} = require("./controlledmaterials/Manufacturer");
const {GENERATEMATERIALSURVEILLANCESHEET_REF} = require("./controlledmaterials/GenerateMaterialSurveillanceSheet");
const {VIEWSSCRECORDS_REF} = require("./maintenance/ViewSSCRecords");
const {ADDEDITAMP_REF} = require("./maintenance/AddEditAMP");
const {ADDEDITSSC_REF} = require("./maintenance/AddEditSSC");
const {ADD_EDIT_CORRECTIVE_MAINTENANCE_ISSUE_RECORD_REF} = require("./maintenance/AddEditCorrectiveMaintenanceIssueRecord");
const {GENERATESSCMAINTENANCEREPORT_REF} = require("./maintenance/GenerateSSCMaintenanceReport");
const {ADDEDITMONITORS_REF} = require("./radiationprotection/AddEditMonitors");
const {PERSONNELDOSIMETRYMEASUREMENT_REF} = require("./radiationprotection/PersonnelDosimetryMeasurement");
const {MONITORDOSIMETRYMEASUREMENT_REF} = require("./radiationprotection/MonitorDosimetryMeasurement");
const {PERSONNELDOSIMETRYEVALUATION_REF} = require("./radiationprotection/PersonnelDosimetryEvaluation");
const {PERSONNELDOSIMETRYREPORT_REF} = require("./radiationprotection/PersonnelDosimetryReport");
const {ADDEDITREACTOROPERATINGRUNS_REF} = require("./packages/icens/AddEditReactorOperatingRuns");
const {ADDEDITIRRADIATEDSAMPLES_REF} = require("./packages/icens/AddEditIrradiatedSamples");
const {REACTOROPERATIONSREPORT_REF} = require("./packages/icens/ReactorOperationsReport");
const {ADDEDITREACTORWATERSAMPLES_REF} = require("./packages/icens/AddEditReactorWaterSamples");
const {ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF} = require("./packages/icens/AddEditReactorSampleIrradiationAuthorization");
const {GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF} = require("./packages/icens/GenerateReactorSampleIrradiationAuthorizationPdf");
const {TERMSANDDEFINITIONS_REF} = require("./support/TermsAndDefinitions");

const AddEditPersonnel = lazy(() => import('./personnel/AddEditPersonnel'));
const UpdateMonitoringStatus = lazy(() => import('./personnel/UpdateMonitoringStatus'));
const ViewPersonnelRecords = lazy(() => import('./personnel/ViewPersonnelRecords'));
const PersonnelDosimetryMeasurement = lazy(() => import('./radiationprotection/PersonnelDosimetryMeasurement'));
const PersonnelDosimetryReport = lazy(() => import('./radiationprotection/PersonnelDosimetryReport'));
const MonitorDosimetryMeasurement = lazy(() => import('./radiationprotection/MonitorDosimetryMeasurement'));
const Manufacturer = lazy(() => import('./controlledmaterials/Manufacturer'));
const Storage = lazy(() => import('./controlledmaterials/Storage'));
const Material = lazy(() => import('./controlledmaterials/Material'));
const ViewMaterialsList = lazy(() => import('./controlledmaterials/ViewMaterialsList'));
const GenerateMaterialSurveillanceSheet = lazy(() => import('./controlledmaterials/GenerateMaterialSurveillanceSheet'));
const GenerateSSCMaintenanceReport = lazy(() => import('./maintenance/GenerateSSCMaintenanceReport'));
const AddEditCorrectiveMaintenanceIssueRecord = lazy(() => import('./maintenance/AddEditCorrectiveMaintenanceIssueRecord'));
const AddEditSSC = lazy(() => import('./maintenance/AddEditSSC'));
const AddEditAMP = lazy(() => import('./maintenance/AddEditAMP'));
const ViewSSCRecords = lazy(() => import('./maintenance/ViewSSCRecords'));
const AddEditMonitors = lazy(() => import('./radiationprotection/AddEditMonitors'));
const ManageUsers = lazy(() => import('./sysadmin/ManageUsers'));
const ImportICENSPersonnel = lazy(() => import('./packages/icens/ImportICENSPersonnel'));
const ImportICENSControlledMaterialManufacturers = lazy(() => import('./packages/icens/ImportICENSControlledMaterialManufacturers'));
const ImportICENSControlledMaterials = lazy(() => import('./packages/icens/ImportICENSControlledMaterials'));
const ImportICENSControlledMaterialStorageLocations = lazy(() => import('./packages/icens/ImportICENSControlledMaterialStorageLocations'));
const ImportICENSMonitors = lazy(() => import('./packages/icens/ImportICENSMonitors'));
const AddEditReactorOperatingRuns = lazy(() => import('./packages/icens/AddEditReactorOperatingRuns'));
const AddEditIrradiatedSamples = lazy(() => import('./packages/icens/AddEditIrradiatedSamples'));
const ReactorOperationsReport = lazy(() => import('./packages/icens/ReactorOperationsReport'));
const AddEditReactorWaterSamples = lazy(() => import('./packages/icens/AddEditReactorWaterSamples'));
const PersonnelDosimetryEvaluation = lazy(() => import('./radiationprotection/PersonnelDosimetryEvaluation'));
const AddEditReactorSampleIrradiationAuthorization = lazy(() => import('./packages/icens/AddEditReactorSampleIrradiationAuthorization'));
const GenerateReactorSampleIrradiationAuthorizationPdf = lazy(() => import('./packages/icens/GenerateReactorSampleIrradiationAuthorizationPdf'));
const TermsAndDefinitions = lazy(() => import('./support/TermsAndDefinitions'));


export const SupportPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.SUPPORT_TERMS_AND_DEFINITIONS) {
    return (<TermsAndDefinitions
      ref={crefs[TERMSANDDEFINITIONS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const SysAdminResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.SYSADMIN_MANAGE_USERS) {
    return (<ManageUsers
      ref={crefs[MANAGEUSERS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const HumanResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.HR_ADD_EDIT_PERSONNEL) {
    return (<AddEditPersonnel
      ref={crefs[ADDEDITPERSONNEL_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.HR_UPDATE_MONITORING_STATUS) {
    return (<UpdateMonitoringStatus
      ref={crefs[UPDATEMONITORINGSTATUS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.HR_VIEW_PERSONNEL_RECORDS) {
    return (<ViewPersonnelRecords
      ref={crefs[VIEWPERSONNELRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const ControlledMaterialPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.CM_VIEW_CONTROLLED_MATERIALS_LIST) {
    return (<ViewMaterialsList
      ref={crefs[VIEWMATERIALSLIST_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL) {
    return (<Material
      ref={crefs[MATERIAL_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION) {
    return (<Storage
      ref={crefs[STORAGE_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER) {
    return (<Manufacturer
      ref={crefs[MANUFACTURER_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_GENERATE_MATERIAL_SURVEILLANCE_SHEET) {
    return (<GenerateMaterialSurveillanceSheet
      ref={crefs[GENERATEMATERIALSURVEILLANCESHEET_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const SSCPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.SSC_VIEW_SSC_RECORDS) {
    return (<ViewSSCRecords
      ref={crefs[VIEWSSCRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.SSC_ADD_EDIT_SSC_AMP) {
    return (<AddEditAMP
      ref={crefs[ADDEDITAMP_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.SSC_ADD_EDIT_SSC) {
    return (<AddEditSSC
      ref={crefs[ADDEDITSSC_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.SSC_ADD_EDIT_SSC_CORRECTIVE_MAINTENANCE_ISSUE_RECORD) {
    return (<AddEditCorrectiveMaintenanceIssueRecord
      ref={crefs[ADD_EDIT_CORRECTIVE_MAINTENANCE_ISSUE_RECORD_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.SSC_GENERATE_SSC_MAINTENANCE_REPORT) {
    return (<GenerateSSCMaintenanceReport
      ref={crefs[GENERATESSCMAINTENANCEREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const RadiationProtectionPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.BASIC_RP_ADD_EDIT_MONITORS) {
    return (<AddEditMonitors
      ref={crefs[ADDEDITMONITORS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RP_ADD_EDIT_PERSONNEL_DOSIMETRY_MEASUREMENTS) {
    return (<PersonnelDosimetryMeasurement
      ref={crefs[PERSONNELDOSIMETRYMEASUREMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RP_ADD_EDIT_MONITOR_DOSIMETRY_MEASUREMENTS) {
    return (<MonitorDosimetryMeasurement
      ref={crefs[MONITORDOSIMETRYMEASUREMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RP_PERSONNEL_DOSIMETRY_EVALUATION) {
    return (<PersonnelDosimetryEvaluation
      ref={crefs[PERSONNELDOSIMETRYEVALUATION_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RP_PERSONNEL_DOSIMETRY_REPORT) {
    return (<PersonnelDosimetryReport
      ref={crefs[PERSONNELDOSIMETRYREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const IcensPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.PRO_IMPORT_ICENS_PERSONNEL) {
    return (<ImportICENSPersonnel
      ref={crefs["ImportICENSPersonnel"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_MANUFACTURERS) {
    return (<ImportICENSControlledMaterialManufacturers
      ref={crefs["ImportICENSControlledMaterialManufacturers"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_STORAGE_LOCATIONS) {
    return (<ImportICENSControlledMaterialStorageLocations
      ref={crefs["ImportICENSControlledMaterialStorageLocations"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIALS) {
    return (<ImportICENSControlledMaterials
      ref={crefs["ImportICENSControlledMaterials"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.PRO_IMPORT_ICENS_MONITORS) {
    return (<ImportICENSMonitors
      ref={crefs["ImportICENSMonitors"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_ADD_EDIT_REACTOR_OPERATING_RUN_RECORDS) {
    return (<AddEditReactorOperatingRuns
      ref={crefs[ADDEDITREACTOROPERATINGRUNS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_ADD_EDIT_IRRADIATED_SAMPLES_DATA) {
    return (<AddEditIrradiatedSamples
      ref={crefs[ADDEDITIRRADIATEDSAMPLES_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_REACTOR_OPERATIONS_REPORT) {
    return (<ReactorOperationsReport
      ref={crefs[REACTOROPERATIONSREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_ADD_EDIT_REACTOR_WATER_SAMPLES) {
    return (<AddEditReactorWaterSamples
      ref={crefs[ADDEDITREACTORWATERSAMPLES_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_ADD_EDIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION) {
    return (<AddEditReactorSampleIrradiationAuthorization
      ref={crefs[ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF) {
    return (<GenerateReactorSampleIrradiationAuthorizationPdf
      ref={crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}
