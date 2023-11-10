import React, {lazy} from "react";

import {CHATBOT_REF} from "./rasa/ChatBot";
import {TERMSANDDEFINITIONS_REF} from "./support/TermsAndDefinitions";
import {MANAGEUSERS_REF} from "./sysadmin/ManageUsers";
import {ADDEDITPERSONNEL_REF} from "./personnel/AddEditPersonnel";
import {UPDATEMONITORINGSTATUS_REF} from "./personnel/UpdateMonitoringStatus";
import {VIEWPERSONNELRECORDS_REF} from "./personnel/ViewPersonnelRecords";
import {VIEWMATERIALSLIST_REF} from "./controlledmaterials/ViewMaterialsList";
import {MATERIAL_REF} from "./controlledmaterials/Material";
import {STORAGE_REF} from "./controlledmaterials/Storage";
import {MANUFACTURER_REF} from "./controlledmaterials/Manufacturer";
import {GENERATEMATERIALSURVEILLANCESHEET_REF} from "./controlledmaterials/GenerateMaterialSurveillanceSheet";
import {VIEWSSCRECORDS_REF} from "./maintenance/ViewSSCRecords";
import {VIEWAMPRECORDS_REF} from "./maintenance/ViewAMPRecords";
import {ADDEDITAMP_REF} from "./maintenance/AddEditAMP";
import {ADDEDITSSC_REF} from "./maintenance/AddEditSSC";
import {ADD_EDIT_CORRECTIVE_MAINTENANCE_ISSUE_RECORD_REF} from "./maintenance/AddEditCorrectiveMaintenanceIssueRecord";
import {GENERATESSCMAINTENANCEREPORT_REF} from "./maintenance/GenerateSSCMaintenanceReport";
import {ADDEDITMONITORS_REF} from "./radiationprotection/AddEditMonitors";
import {PERSONNELDOSIMETRYMEASUREMENT_REF} from "./radiationprotection/PersonnelDosimetryMeasurement";
import {MONITORDOSIMETRYMEASUREMENT_REF} from "./radiationprotection/MonitorDosimetryMeasurement";
import {PERSONNELDOSIMETRYEVALUATION_REF} from "./radiationprotection/PersonnelDosimetryEvaluation";
import {PERSONNELDOSIMETRYREPORT_REF} from "./radiationprotection/PersonnelDosimetryReport";
import {ADDEDITREACTOROPERATINGRUNS_REF} from "./operation/AddEditReactorOperatingRuns";
import {ADDEDITIRRADIATEDSAMPLES_REF} from "./operation/AddEditIrradiatedSamples";
import {REACTOROPERATIONSREPORT_REF} from "./operation/ReactorOperationsReport";
import {ADDEDITREACTORWATERSAMPLES_REF} from "./operation/AddEditReactorWaterSamples";
import {
  ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF
} from "./operation/AddEditReactorSampleIrradiationAuthorization";
import {
  GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF
} from "./operation/GenerateReactorSampleIrradiationAuthorizationPdf";
import {OWNER_REF} from "./controlledmaterials/Owner";
import {UNDERDEVELOPMENT_REF} from "../components/UnderDevelopment";
import MaintenanceSchedule, {MAINTENANCESCHEDULE_REF} from "./maintenance/MaintenanceSchedule";
import {CLEANUPLARGEOBJECTSTORE_REF} from "./sysadmin/CleanupLargeObjectStore";
import {ADDEDITMODIFICATIONRECORD_REF} from "./maintenance/AddEditModificationRecord";

const Constants = require("../utils/constants");

const AddEditPersonnel = lazy(() => import('./personnel/AddEditPersonnel'));
const UpdateMonitoringStatus = lazy(() => import('./personnel/UpdateMonitoringStatus'));
const ViewPersonnelRecords = lazy(() => import('./personnel/ViewPersonnelRecords'));
const PersonnelDosimetryMeasurement = lazy(() => import('./radiationprotection/PersonnelDosimetryMeasurement'));
const PersonnelDosimetryReport = lazy(() => import('./radiationprotection/PersonnelDosimetryReport'));
const MonitorDosimetryMeasurement = lazy(() => import('./radiationprotection/MonitorDosimetryMeasurement'));
const Manufacturer = lazy(() => import('./controlledmaterials/Manufacturer'));
const Storage = lazy(() => import('./controlledmaterials/Storage'));
const Material = lazy(() => import('./controlledmaterials/Material'));
const Owner = lazy(() => import('./controlledmaterials/Owner'));
const ViewMaterialsList = lazy(() => import('./controlledmaterials/ViewMaterialsList'));
const GenerateMaterialSurveillanceSheet = lazy(() => import('./controlledmaterials/GenerateMaterialSurveillanceSheet'));
const GenerateSSCMaintenanceReport = lazy(() => import('./maintenance/GenerateSSCMaintenanceReport'));
const AddEditMaintenanceRecord = lazy(() => import('./maintenance/AddEditMaintenanceRecord'));
const AddEditModificationRecord = lazy(() => import('./maintenance/AddEditModificationRecord'));
const AddEditSSC = lazy(() => import('./maintenance/AddEditSSC'));
const AddEditAMP = lazy(() => import('./maintenance/AddEditAMP'));
const ViewSSCRecords = lazy(() => import('./maintenance/ViewSSCRecords'));
const ViewAMPRecords = lazy(() => import('./maintenance/ViewAMPRecords'));
const AddEditMonitors = lazy(() => import('./radiationprotection/AddEditMonitors'));
const ManageUsers = lazy(() => import('./sysadmin/ManageUsers'));
const CleanupLargeObjectStore = lazy(() => import('./sysadmin/CleanupLargeObjectStore'));
const ImportICENSPersonnel = lazy(() => import('./packages/icens/ImportICENSPersonnel'));
const ImportICENSControlledMaterialManufacturers = lazy(() => import('./packages/icens/ImportICENSControlledMaterialManufacturers'));
const ImportICENSControlledMaterials = lazy(() => import('./packages/icens/ImportICENSControlledMaterials'));
const ImportICENSControlledMaterialStorageLocations = lazy(() => import('./packages/icens/ImportICENSControlledMaterialStorageLocations'));
const ImportICENSMonitors = lazy(() => import('./packages/icens/ImportICENSMonitors'));
const AddEditReactorOperatingRuns = lazy(() => import('./operation/AddEditReactorOperatingRuns'));
const AddEditIrradiatedSamples = lazy(() => import('./operation/AddEditIrradiatedSamples'));
const ReactorOperationsReport = lazy(() => import('./operation/ReactorOperationsReport'));
const AddEditReactorWaterSamples = lazy(() => import('./operation/AddEditReactorWaterSamples'));
const PersonnelDosimetryEvaluation = lazy(() => import('./radiationprotection/PersonnelDosimetryEvaluation'));
const AddEditReactorSampleIrradiationAuthorization = lazy(() => import('./operation/AddEditReactorSampleIrradiationAuthorization'));
const GenerateReactorSampleIrradiationAuthorizationPdf = lazy(() => import('./operation/GenerateReactorSampleIrradiationAuthorizationPdf'));
const TermsAndDefinitions = lazy(() => import('./support/TermsAndDefinitions'));
const ChatBot = lazy(() => import('./rasa/ChatBot'));
const UnderDevelopment = lazy(() => import('../components/UnderDevelopment'));


export const RasaPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.RASA_CHATBOT) {
    return (<ChatBot
      ref={crefs[CHATBOT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}


export const SupportPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
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

export const SysAdminResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.SYSADMIN_MANAGE_USERS) {
    return (<ManageUsers
      ref={crefs[MANAGEUSERS_REF]}
      title={menuTitle}
      user={user}
      puk={puk}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SYSADMIN_CLEANUP_LARGE_OBJECT_STORE) {
    return (<CleanupLargeObjectStore
      ref={crefs[CLEANUPLARGEOBJECTSTORE_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const HumanResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.HR_ADD_EDIT_PERSONNEL) {
    return (<AddEditPersonnel
      ref={crefs[ADDEDITPERSONNEL_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.HR_UPDATE_MONITORING_STATUS) {
    return (<UpdateMonitoringStatus
      ref={crefs[UPDATEMONITORINGSTATUS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.HR_VIEW_PERSONNEL_RECORDS) {
    return (<ViewPersonnelRecords
      ref={crefs[VIEWPERSONNELRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.HR_UPDATE_TRAINING_RECORD) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.HR_ADD_EDIT_TRAINING_PROGRAMME) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.HR_SSPI) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.HR_TPI) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const ControlledMaterialPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.CM_VIEW_CONTROLLED_MATERIALS_LIST) {
    return (<ViewMaterialsList
      ref={crefs[VIEWMATERIALSLIST_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL) {
    return (<Material
      ref={crefs[MATERIAL_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION) {
    return (<Storage
      ref={crefs[STORAGE_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER) {
    return (<Manufacturer
      ref={crefs[MANUFACTURER_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_GENERATE_MATERIAL_SURVEILLANCE_SHEET) {
    return (<GenerateMaterialSurveillanceSheet
      ref={crefs[GENERATEMATERIALSURVEILLANCESHEET_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_UPDATE_MATERIAL_OWNER) {
    return (<Owner
      ref={crefs[OWNER_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_UPDATE_MATERIAL_SURVEILLANCE) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_RADIATION_PROTECTION_SCHEDULE) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.CM_INVENTORY_LIST) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const SSCPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.SSC_VIEW_SSC_LIST) {
    return (<ViewSSCRecords
      ref={crefs[VIEWSSCRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_ADD_EDIT_SSC_TODO_RECORD) {
    return (<AddEditMaintenanceRecord
      ref={crefs[ADDEDITMODIFICATIONRECORD_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_ADD_EDIT_SSC_AMP) {
    return (<AddEditAMP
      ref={crefs[ADDEDITAMP_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_VIEW_AMP_SSC_LIST) {
    return (<ViewAMPRecords
      ref={crefs[VIEWAMPRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_ADD_EDIT_SSC) {
    return (<AddEditSSC
      ref={crefs[ADDEDITSSC_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_ADD_EDIT_SSC_CORRECTIVE_MAINTENANCE_ISSUE_RECORD) {
    return (<AddEditMaintenanceRecord
      ref={crefs[ADD_EDIT_CORRECTIVE_MAINTENANCE_ISSUE_RECORD_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_GENERATE_SSC_MAINTENANCE_REPORT) {
    return (<GenerateSSCMaintenanceReport
      ref={crefs[GENERATESSCMAINTENANCEREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_GENERATE_AMP_SCHEDULE) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_ADD_EDIT_SSC_TODO_RECORD) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.SSC_GENERATE_SSC_MAINTENANCE_SCHEDULE) {
    return (<MaintenanceSchedule
      ref={crefs[MAINTENANCESCHEDULE_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const RadiationProtectionPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.BASIC_RP_ADD_EDIT_MONITORS) {
    return (<AddEditMonitors
      ref={crefs[ADDEDITMONITORS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RP_ADD_EDIT_PERSONNEL_DOSIMETRY_MEASUREMENTS) {
    return (<PersonnelDosimetryMeasurement
      ref={crefs[PERSONNELDOSIMETRYMEASUREMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RP_ADD_EDIT_MONITOR_DOSIMETRY_MEASUREMENTS) {
    return (<MonitorDosimetryMeasurement
      ref={crefs[MONITORDOSIMETRYMEASUREMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RP_PERSONNEL_DOSIMETRY_EVALUATION) {
    return (<PersonnelDosimetryEvaluation
      ref={crefs[PERSONNELDOSIMETRYEVALUATION_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RP_PERSONNEL_DOSIMETRY_REPORT) {
    return (<PersonnelDosimetryReport
      ref={crefs[PERSONNELDOSIMETRYREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RP_MONITOR_LIST) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RP_MONITOR_DATA) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const IcensPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.PRO_IMPORT_ICENS_PERSONNEL) {
    return (<ImportICENSPersonnel
      ref={crefs["ImportICENSPersonnel"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_MANUFACTURERS) {
    return (<ImportICENSControlledMaterialManufacturers
      ref={crefs["ImportICENSControlledMaterialManufacturers"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_STORAGE_LOCATIONS) {
    return (<ImportICENSControlledMaterialStorageLocations
      ref={crefs["ImportICENSControlledMaterialStorageLocations"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIALS) {
    return (<ImportICENSControlledMaterials
      ref={crefs["ImportICENSControlledMaterials"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.PRO_IMPORT_ICENS_MONITORS) {
    return (<ImportICENSMonitors
      ref={crefs["ImportICENSMonitors"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RO_ADD_EDIT_REACTOR_OPERATING_RUN_RECORDS) {
    return (<AddEditReactorOperatingRuns
      ref={crefs[ADDEDITREACTOROPERATINGRUNS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RO_ADD_EDIT_IRRADIATED_SAMPLES_DATA) {
    return (<AddEditIrradiatedSamples
      ref={crefs[ADDEDITIRRADIATEDSAMPLES_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RO_REACTOR_OPERATIONS_REPORT) {
    return (<ReactorOperationsReport
      ref={crefs[REACTOROPERATIONSREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RO_ADD_EDIT_REACTOR_WATER_SAMPLES) {
    return (<AddEditReactorWaterSamples
      ref={crefs[ADDEDITREACTORWATERSAMPLES_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RO_ADD_EDIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION) {
    return (<AddEditReactorSampleIrradiationAuthorization
      ref={crefs[ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.RO_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF) {
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

export const OrgPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.ORG_EDIT_DETAILS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.ORG_STATUTORY_REQUIREMENTS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.ORG_MAINTAIN_ORGANISATION_DOCUMENTS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

export const EmergencyPreparednessPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, puk) => {
  if (actionid === Constants.EP_CONCEPT_OF_OPERATION) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  } else if (actionid === Constants.EP_ADD_EDIT_EMERGENCY_SCENARIOS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}
