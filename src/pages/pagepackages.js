import React, {lazy} from "react";

import {TERMSANDDEFINITIONS_REF} from "./support/TermsAndDefinitions";
import {MANAGEUSERS_REF} from "./sysadmin/ManageUsers";
import {SYSTEMCONFIGURATION_REF} from "./sysadmin/SystemConfiguration";
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
import {ADDEDITROUTINEMAINTENANCERECORDS_REF} from "./maintenance/AddEditRoutineMaintenanceRecords";
import {ADDEDITAMP_REF} from "./maintenance/AddEditAMP";
import {ADDEDITSSC_REF} from "./maintenance/AddEditSSC";
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
import {OPERATINGRUNDATAMETRICS_REF} from "./operation/OperatingRunDataMetrics";
import {
  REACTOR_OPERATION_PARAMETERS_DASHBOARD_REF
} from "./operation/ReactorOperationParametersDashboard";
import {REACTOR_AREA_MONITORS_DASHBOARD_REF} from "./operation/ReactorAreaMonitorsDashboard";
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
import {ADDEDITMAINTENANCERECORD_REF} from "./maintenance/AddEditMaintenanceRecord";
import {DISCOVERORPHANEDMETADATA_REF} from "./sysadmin/DiscoverOrphanedMetadata";
import {
  BASIC_RP_ADD_EDIT_MONITORS,
  CM_GENERATE_MATERIAL_SURVEILLANCE_SHEET,
  CM_INVENTORY_LIST,
  CM_RADIATION_PROTECTION_SCHEDULE,
  CM_REGISTER_CONTROLLED_MATERIAL,
  CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER,
  CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION,
  CM_UPDATE_MATERIAL_OWNER,
  CM_UPDATE_MATERIAL_SURVEILLANCE,
  CM_VIEW_CONTROLLED_MATERIALS_LIST,
  EP_ADD_EDIT_EMERGENCY_SCENARIOS,
  EP_CONCEPT_OF_OPERATION,
  HR_ADD_EDIT_PERSONNEL,
  HR_ADD_EDIT_TRAINING_PROGRAMME,
  HR_SSPI,
  HR_TPI,
  HR_UPDATE_MONITORING_STATUS,
  HR_UPDATE_TRAINING_RECORD,
  HR_VIEW_PERSONNEL_RECORDS,
  ORG_EDIT_DETAILS,
  ORG_MAINTAIN_ORGANISATION_DOCUMENTS,
  ORG_STATUTORY_REQUIREMENTS,
  PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_MANUFACTURERS,
  PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_STORAGE_LOCATIONS,
  PRO_IMPORT_ICENS_CONTROLLED_MATERIALS,
  PRO_IMPORT_ICENS_MONITORS,
  PRO_IMPORT_ICENS_PERSONNEL,
  RO_ADD_EDIT_IRRADIATED_SAMPLES_DATA,
  RO_ADD_EDIT_REACTOR_OPERATING_RUN_RECORDS,
  RO_ADD_EDIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION,
  RO_ADD_EDIT_REACTOR_WATER_SAMPLES, RO_AREA_MONITORS_DASHBOARD,
  RO_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF,
  RO_OPERATING_RUN_DATA_METRICS, RO_REACTOR_OPERATION_PARAMETERS_DASHBOARD, RO_REACTOR_OPERATIONS_DASHBOARD,
  RO_REACTOR_OPERATIONS_REPORT,
  RP_ADD_EDIT_MONITOR_DOSIMETRY_MEASUREMENTS,
  RP_ADD_EDIT_PERSONNEL_DOSIMETRY_MEASUREMENTS,
  RP_MONITOR_DATA,
  RP_MONITOR_LIST,
  RP_PERSONNEL_DOSIMETRY_EVALUATION,
  RP_PERSONNEL_DOSIMETRY_REPORT,
  SSC_ADD_EDIT_ROUTINE_MAINTENANCE_RECORDS,
  SSC_ADD_EDIT_SSC,
  SSC_ADD_EDIT_SSC_AMP,
  SSC_ADD_EDIT_SSC_MAINTENANCE_RECORD,
  SSC_ADD_EDIT_SSC_MODIFICATION_RECORD,
  SSC_GENERATE_AMP_SCHEDULE,
  SSC_GENERATE_SSC_MAINTENANCE_REPORT,
  SSC_GENERATE_SSC_MAINTENANCE_SCHEDULE,
  SSC_VIEW_AMP_SSC_LIST,
  SSC_VIEW_SSC_LIST,
  SUPPORT_TERMS_AND_DEFINITIONS,
  SYSADMIN_CLEANUP_LARGE_OBJECT_STORE,
  SYSADMIN_DISCOVER_ORPHANED_METADATA,
  SYSADMIN_MANAGE_USERS,
  SYSADMIN_SYSTEM_CONFIGURATION
} from "../utils/constants";


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
const AddEditRoutineMaintenanceRecords = lazy(() => import('./maintenance/AddEditRoutineMaintenanceRecords'));
const AddEditMonitors = lazy(() => import('./radiationprotection/AddEditMonitors'));
const SystemConfiguration = lazy(() => import('./sysadmin/SystemConfiguration'));
const ManageUsers = lazy(() => import('./sysadmin/ManageUsers'));
const CleanupLargeObjectStore = lazy(() => import('./sysadmin/CleanupLargeObjectStore'));
const DiscoverOrphanedMetadata = lazy(() => import('./sysadmin/DiscoverOrphanedMetadata'));
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
const OperatingRunDataMetrics = lazy(() => import('./operation/OperatingRunDataMetrics'));
const ReactorOperationParametersDashboard = lazy(() => import('./operation/ReactorOperationParametersDashboard'));
const ReactorAreaMonitorsDashboard = lazy(() => import('./operation/ReactorAreaMonitorsDashboard'));
const TermsAndDefinitions = lazy(() => import('./support/TermsAndDefinitions'));
const UnderDevelopment = lazy(() => import('../components/UnderDevelopment'));


export const SupportPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === SUPPORT_TERMS_AND_DEFINITIONS) {
    return (<TermsAndDefinitions
      ref={crefs[TERMSANDDEFINITIONS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const SysAdminResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === SYSADMIN_MANAGE_USERS) {
    return (<ManageUsers
      ref={crefs[MANAGEUSERS_REF]}
      title={menuTitle}
      user={user}
      puk={puk}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SYSADMIN_CLEANUP_LARGE_OBJECT_STORE) {
    return (<CleanupLargeObjectStore
      ref={crefs[CLEANUPLARGEOBJECTSTORE_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SYSADMIN_DISCOVER_ORPHANED_METADATA) {
    return (<DiscoverOrphanedMetadata
      ref={crefs[DISCOVERORPHANEDMETADATA_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SYSADMIN_SYSTEM_CONFIGURATION) {
    return (<SystemConfiguration
      ref={crefs[SYSTEMCONFIGURATION_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const HumanResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === HR_ADD_EDIT_PERSONNEL) {
    return (<AddEditPersonnel
      ref={crefs[ADDEDITPERSONNEL_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === HR_UPDATE_MONITORING_STATUS) {
    return (<UpdateMonitoringStatus
      ref={crefs[UPDATEMONITORINGSTATUS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === HR_VIEW_PERSONNEL_RECORDS) {
    return (<ViewPersonnelRecords
      ref={crefs[VIEWPERSONNELRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === HR_UPDATE_TRAINING_RECORD) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === HR_ADD_EDIT_TRAINING_PROGRAMME) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === HR_SSPI) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === HR_TPI) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const ControlledMaterialPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === CM_VIEW_CONTROLLED_MATERIALS_LIST) {
    return (<ViewMaterialsList
      ref={crefs[VIEWMATERIALSLIST_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_REGISTER_CONTROLLED_MATERIAL) {
    return (<Material
      ref={crefs[MATERIAL_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION) {
    return (<Storage
      ref={crefs[STORAGE_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER) {
    return (<Manufacturer
      ref={crefs[MANUFACTURER_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_GENERATE_MATERIAL_SURVEILLANCE_SHEET) {
    return (<GenerateMaterialSurveillanceSheet
      ref={crefs[GENERATEMATERIALSURVEILLANCESHEET_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_UPDATE_MATERIAL_OWNER) {
    return (<Owner
      ref={crefs[OWNER_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_UPDATE_MATERIAL_SURVEILLANCE) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_RADIATION_PROTECTION_SCHEDULE) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === CM_INVENTORY_LIST) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const SSCPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === SSC_VIEW_SSC_LIST) {
    return (<ViewSSCRecords
      ref={crefs[VIEWSSCRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_ADD_EDIT_SSC_MODIFICATION_RECORD) {
    return (<AddEditModificationRecord
      ref={crefs[ADDEDITMODIFICATIONRECORD_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_ADD_EDIT_ROUTINE_MAINTENANCE_RECORDS) {
    return (<AddEditRoutineMaintenanceRecords
      ref={crefs[ADDEDITROUTINEMAINTENANCERECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_ADD_EDIT_SSC_AMP) {
    return (<AddEditAMP
      ref={crefs[ADDEDITAMP_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_VIEW_AMP_SSC_LIST) {
    return (<ViewAMPRecords
      ref={crefs[VIEWAMPRECORDS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_ADD_EDIT_SSC) {
    return (<AddEditSSC
      ref={crefs[ADDEDITSSC_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_ADD_EDIT_SSC_MAINTENANCE_RECORD) {
    return (<AddEditMaintenanceRecord
      ref={crefs[ADDEDITMAINTENANCERECORD_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_GENERATE_SSC_MAINTENANCE_REPORT) {
    return (<GenerateSSCMaintenanceReport
      ref={crefs[GENERATESSCMAINTENANCEREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_GENERATE_AMP_SCHEDULE) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_ADD_EDIT_SSC_MODIFICATION_RECORD) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === SSC_GENERATE_SSC_MAINTENANCE_SCHEDULE) {
    return (<MaintenanceSchedule
      ref={crefs[MAINTENANCESCHEDULE_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const RadiationProtectionPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === BASIC_RP_ADD_EDIT_MONITORS) {
    return (<AddEditMonitors
      ref={crefs[ADDEDITMONITORS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RP_ADD_EDIT_PERSONNEL_DOSIMETRY_MEASUREMENTS) {
    return (<PersonnelDosimetryMeasurement
      ref={crefs[PERSONNELDOSIMETRYMEASUREMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RP_ADD_EDIT_MONITOR_DOSIMETRY_MEASUREMENTS) {
    return (<MonitorDosimetryMeasurement
      ref={crefs[MONITORDOSIMETRYMEASUREMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RP_PERSONNEL_DOSIMETRY_EVALUATION) {
    return (<PersonnelDosimetryEvaluation
      ref={crefs[PERSONNELDOSIMETRYEVALUATION_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RP_PERSONNEL_DOSIMETRY_REPORT) {
    return (<PersonnelDosimetryReport
      ref={crefs[PERSONNELDOSIMETRYREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RP_MONITOR_LIST) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RP_MONITOR_DATA) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const IcensPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === PRO_IMPORT_ICENS_PERSONNEL) {
    return (<ImportICENSPersonnel
      ref={crefs["ImportICENSPersonnel"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_MANUFACTURERS) {
    return (<ImportICENSControlledMaterialManufacturers
      ref={crefs["ImportICENSControlledMaterialManufacturers"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_STORAGE_LOCATIONS) {
    return (<ImportICENSControlledMaterialStorageLocations
      ref={crefs["ImportICENSControlledMaterialStorageLocations"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === PRO_IMPORT_ICENS_CONTROLLED_MATERIALS) {
    return (<ImportICENSControlledMaterials
      ref={crefs["ImportICENSControlledMaterials"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === PRO_IMPORT_ICENS_MONITORS) {
    return (<ImportICENSMonitors
      ref={crefs["ImportICENSMonitors"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_ADD_EDIT_REACTOR_OPERATING_RUN_RECORDS) {
    return (<AddEditReactorOperatingRuns
      ref={crefs[ADDEDITREACTOROPERATINGRUNS_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_ADD_EDIT_IRRADIATED_SAMPLES_DATA) {
    return (<AddEditIrradiatedSamples
      ref={crefs[ADDEDITIRRADIATEDSAMPLES_REF]}
      title={menuTitle}
      user={user}
      // onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_REACTOR_OPERATIONS_REPORT) {
    return (<ReactorOperationsReport
      ref={crefs[REACTOROPERATIONSREPORT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_ADD_EDIT_REACTOR_WATER_SAMPLES) {
    return (<AddEditReactorWaterSamples
      ref={crefs[ADDEDITREACTORWATERSAMPLES_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_ADD_EDIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION) {
    return (<AddEditReactorSampleIrradiationAuthorization
      ref={crefs[ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF) {
    return (<GenerateReactorSampleIrradiationAuthorizationPdf
      ref={crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_OPERATING_RUN_DATA_METRICS) {
    return (<OperatingRunDataMetrics
      ref={crefs[OPERATINGRUNDATAMETRICS_REF]}
      title={menuTitle}
      user={user}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_REACTOR_OPERATION_PARAMETERS_DASHBOARD) {
    return (<ReactorOperationParametersDashboard
      ref={crefs[REACTOR_OPERATION_PARAMETERS_DASHBOARD_REF]}
      title={menuTitle}
      user={user}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === RO_AREA_MONITORS_DASHBOARD) {
    return (<ReactorAreaMonitorsDashboard
      ref={crefs[REACTOR_AREA_MONITORS_DASHBOARD_REF]}
      title={menuTitle}
      user={user}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const OrgPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === ORG_EDIT_DETAILS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === ORG_STATUTORY_REQUIREMENTS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === ORG_MAINTAIN_ORGANISATION_DOCUMENTS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}

export const EmergencyPreparednessPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties, glossary, puk) => {
  if (actionid === EP_CONCEPT_OF_OPERATION) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  } else if (actionid === EP_ADD_EDIT_EMERGENCY_SCENARIOS) {
    return (<UnderDevelopment
      ref={crefs[UNDERDEVELOPMENT_REF]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
      glossary={glossary}
    />)
  }
}
