module.exports = Object.freeze({
  ROLE_CONTROLLED_MATERIAL_DATA_ENTRY: "controlled_material_data_entry",
  ROLE_CONTROLLED_MATERIAL_SYSADMIN: "controlled_material_sysadmin",
  ROLE_MAINTENANCE_DATA_ENTRY: "maintenance_data_entry",
  ROLE_MAINTENANCE_DATA_EXPORT: "maintenance_data_export",
  ROLE_MAINTENANCE_SYSADMIN: "maintenance_sysadmin",
  ROLE_RADIATION_PROTECTION_DATA_ENTRY: "radiation_protection_data_entry",
  ROLE_RADIATION_PROTECTION_SYSADMIN: "radiation_protection_sysadmin",
  ROLE_IRRADIATION_REQUEST_DATA_ENTRY: "irradiation_request_data_entry",
  ROLE_IRRADIATION_REQUEST_SYSADMIN: "irradiation_request_sysadmin",
  ROLE_IRRADIATION_AUTHORIZER: "irradiation_authorizer",
  ROLE_PERSONNEL_DATA_ENTRY: "personnel_data_entry",
  ROLE_PERSONNEL_DATA_SYSADMIN: "personnel_data_sysadmin",
  ROLE_REACTOR_OPERATIONS_DATA_ENTRY: "reactor_operations_data_entry",
  ROLE_REACTOR_OPERATIONS_DATA_EXPORT: "reactor_operations_data_export",
  ROLE_REACTOR_OPERATIONS_SYSADMIN: "reactor_operations_sysadmin",
  ROLE_SYSADMIN: "sysadmin",
  ROLE_USER: "user",

  MY_ACCOUNT: 'myaccount',
  SETTINGS: 'settings',

  HR_ADD_EDIT_PERSONNEL: 'hr.add.edit.personnel',
  HR_VIEW_PERSONNEL_RECORDS: 'hr.view.person.records',
  HR_UPDATE_MONITORING_STATUS: 'hr.update.personnel.monitoring.status',
  HR_UPDATE_TRAINING_RECORD: 'hr.update.person.training.record',
  HR_ADD_EDIT_TRAINING_PROGRAMME: 'hr.add.edit.training.programme',
  HR_SSPI: 'hr.sspi',
  HR_TPI: 'hr.tpi',

  RP_ADD_EDIT_PERSONNEL_DOSIMETRY_MEASUREMENTS: 'rp.add.edit.personnel.dosimetry.measurements',
  RP_ADD_EDIT_MONITOR_DOSIMETRY_MEASUREMENTS: 'rp.add.edit.monitor.dosimetry.measurements',
  RP_PERSONNEL_DOSIMETRY_EVALUATION: 'rp.personnel.dosimetry.evaluation',
  RP_PERSONNEL_DOSIMETRY_REPORT: 'rp.personnel.dosimetry.report',
  RP_MONITOR_LIST: 'rp.monitors.list',
  RP_MONITOR_DATA: 'rp.monitors.data',
  BASIC_RP_ADD_EDIT_MONITORS: "rp.add.edit.monitors",

  CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER: 'cm.register.update.material.manufacturer',
  CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION: 'cm.register.update.material.storage.location',
  CM_REGISTER_CONTROLLED_MATERIAL: 'cm.register.update.material',
  CM_GENERATE_MATERIAL_SURVEILLANCE_SHEET: 'cm.generate.material.surveillance.sheet',
  CM_VIEW_CONTROLLED_MATERIALS_LIST: 'cm.view.controlled.materials.list',
  CM_UPDATE_MATERIAL_OWNER: 'cm.update.material.owner',
  CM_UPDATE_MATERIAL_SURVEILLANCE: 'cm.update.material.surveillance',
  CM_RADIATION_PROTECTION_SCHEDULE: 'cm.radiation.protection.schedule',
  CM_INVENTORY_LIST: 'cm.inventory.list',

  SSC_ADD_EDIT_SSC: 'ssc.add.edit.ssc',
  SSC_ADD_EDIT_SSC_MAINTENANCE_RECORD: 'ssc.add.edit.ssc.corrective.maintenance.issue.record',
  SSC_ADD_EDIT_SSC_AMP: 'ssc.add.edit.ssc.amp',
  SSC_VIEW_SSC_LIST: 'ssc.view.ssc.list',
  SSC_VIEW_AMP_SSC_LIST: 'ssc.amp.list',
  SSC_GENERATE_SSC_MAINTENANCE_REPORT: 'ssc.generate.ssc.maintenance.report',
  SSC_GENERATE_SSC_MAINTENANCE_SCHEDULE: 'ssc.generate.ssc.maintenance.schedule',
  SSC_GENERATE_AMP_SCHEDULE: 'ssc.generate.amp.schedule',
  SSC_ADD_EDIT_SSC_MODIFICATION_RECORD: 'ssc.add.edit.ssc.modification.record',
  SSC_ADD_EDIT_ROUTINE_MAINTENANCE_RECORDS: 'ssc.add.edit.reactor.routine.maintenance.records',

  RO_ADD_EDIT_REACTOR_OPERATING_RUN_RECORDS: 'ro.add.edit.reactor.operating.run.records',
  RO_ADD_EDIT_IRRADIATED_SAMPLES_DATA: 'ro.add.edit.irradiated.samples',
  RO_REACTOR_OPERATIONS_REPORT: 'ro.reactor.operations.report',
  RO_ADD_EDIT_REACTOR_WATER_SAMPLES: 'ro.add.edit.reactor.water.samples',
  RO_ADD_EDIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION: 'ro.add.edit.reactor.sample.irradiation.records',
  RO_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF: 'ro.generate.reactor.sample.irradiation.authorization.pdf',
  RO_OPERATING_RUN_DATA_METRICS: 'ro.operating.datastream.metrics',

  ORG_EDIT_DETAILS: 'org.edit.details',
  ORG_STATUTORY_REQUIREMENTS: 'org.statutory.requirements',
  ORG_MAINTAIN_ORGANISATION_DOCUMENTS: 'org.maintain.organisation.documents',

  EP_ADD_EDIT_EMERGENCY_SCENARIOS: 'ep.add.edit.emergency.scenarios',
  EP_CONCEPT_OF_OPERATION: 'ep.',

  SYSADMIN_MANAGE_USERS: 'sysadmin.manage.users',
  SYSADMIN_CLEANUP_LARGE_OBJECT_STORE: 'sysadmin.cleanup.large.object.store',
  SYSADMIN_DISCOVER_ORPHANED_METADATA: 'sysadmin.discover.orphaned.metadata',
  SYSADMIN_SYSTEM_CONFIGURATION: 'sysadmin.systemconfiguration',

  SUPPORT_TERMS_AND_DEFINITIONS: 'support.terms.and.definitions',

  RASA_CHATBOT: 'chat.bot',


  PRO_IMPORT_ICENS_PERSONNEL: 'sysadmin.import.icens.personnel',
  PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_MANUFACTURERS: 'sysadmin.import.icens.controlled.material.manufacturers',
  PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_STORAGE_LOCATIONS: 'sysadmin.import.icens.controlled.material.storage.locations',
  PRO_IMPORT_ICENS_CONTROLLED_MATERIALS: 'sysadmin.import.icens.controlled.materials',
  PRO_IMPORT_ICENS_MONITORS: 'sysadmin.import.icens.monitors',

  CMD_GET_CONFIG_PROPERTIES: "get_config_properties",
  CMD_SET_LOGGING_LEVEL: "set_logging_level",
  CMD_PING: "ping",
  CMD_GET_SERVER_INFO: "get_server_info",
  CMD_GET_PUBLIC_KEY: 'get_public_key',
  CMD_VERIFY_USER_PASSWORD: 'verify_user_password',

  CMD_GET_MONITOR_RECORDS: "get_monitor_records",
  CMD_DELETE_MONITOR_RECORD: "delete_monitor_record",
  CMD_UPDATE_MONITOR_RECORD: "update_monitor_record",

  CMD_DELETE_PERSONNEL_RECORD: "delete_personnel_record",
  CMD_UPDATE_PERSONNEL_RECORD: "update_personnel_record",
  CMD_GET_PERSONNEL_RECORDS: "get_personnel_records",

  CMD_GET_GLOSSARY_TERMS: "get_glossary_terms",

  CMD_GET_MANUFACTURER_RECORDS: "get_manufacturer_records",
  CMD_UPDATE_MANUFACTURER_RECORD: "update_manufacturer_record",
  CMD_DELETE_MANUFACTURER_RECORD: "delete_manufacturer_record",

  CMD_GET_OWNER_RECORDS: "get_owner_records",
  CMD_UPDATE_OWNER_RECORD: "update_owner_record",
  CMD_DELETE_OWNER_RECORD: "delete_owner_record",

  CMD_GET_MATERIAL_RECORDS: "get_material_records",
  CMD_UPDATE_MATERIAL_RECORD: "update_material_record",
  CMD_DELETE_MATERIAL_RECORD: "delete_material_record",

  CMD_DELETE_STORAGE_LOCATION_RECORD: "delete_storage_location_record",
  CMD_UPDATE_STORAGE_LOCATION_RECORD: "update_storage_location_record",
  CMD_GET_STORAGE_LOCATION_RECORDS: "get_storage_location_records",

  CMD_GET_SSC_RECORDS: "get_ssc_records",
  CMD_UPDATE_SSC_RECORD: "update_ssc_record",
  CMD_DELETE_SSC_RECORD: "delete_ssc_record",
  CMD_GET_SSC_MAINTENANCE_RECORDS: "get_ssc_modification_records",
  CMD_GET_SSC_MODIFICATION_RECORDS: "get_ssc_modification_records",
  CMD_UPDATE_SSC_MODIFICATION_RECORD: "update_ssc_modification_record",
  CMD_DELETE_SSC_MODIFICATION_RECORD: "delete_ssc_modification_record",

  CMD_GET_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORDS: "get_reactor_sample_irradiation_authorization_records",
  CMD_UPDATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD: "update_reactor_sample_irradiation_authorization_record",
  CMD_SUBMIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD: "submit_reactor_sample_irradiation_authorization_record",
  CMD_DELETE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD: "delete_reactor_sample_irradiation_authorization_record",

  CMD_GET_ORGANISATION: "get_organisation",
  CMD_GET_SYSTEM_PROPERTIES: "get_system_properties",
  CMD_SET_SYSTEM_PROPERTIES: "set_system_properties",

  CMD_BACKGROUND_TASKS: "background_tasks",
  CMD_CLEANUP_UNREFERENCED_LARGE_OBJECT_STORE_FILES: "cleanup_unreferenced_large_object_store_files",
  CMD_DISCOVER_ORPHANED_METADATA: "discover_orphaned_metadata",

  CMD_GET_USER_RECORDS: "get_user_records",
  CMD_UPDATE_USER_RECORD: "update_user_record",
  CMD_DELETE_USER_RECORD: "delete_user_record",

  CMD_EXPORT_REACTOR_OPERATION_RUNS_DATA: "export_reactor_operation_runs_data",
  CMD_DISCOVER_REACTOR_OPERATION_RUNS: "discover_reactor_operation_runs",
  CMD_GET_REACTOR_OPERATING_REPORT_RECORDS: "get_reactor_operating_report_records",
  CMD_DELETE_REACTOR_OPERATING_REPORT_RECORD: "delete_reactor_operating_report_record",
  CMD_GET_REACTOR_OPERATION_RUN_RECORDS: "get_reactor_operation_run_records",

  CMD_EXPORT_ROUTINE_MAINTENANCE_DATA: "export_routine_maintenance_data",
  CMD_DISCOVER_ROUTINE_MAINTENANCE_DATA: "discover_routine_maintenance_data",
  CMD_GET_ROUTINE_MAINTENANCE_RECORDS: "get_routine_maintenance_records",
  CMD_DELETE_ROUTINE_MAINTENANCE_RECORD: "delete_routine_maintenance_record",

  CMD_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF: "generate_reactor_sample_irradiation_authorization_pdf",
  CMD_GENERATE_REACTOR_OPERATION_REPORT_PDF: "generate_reactor_operation_report_pdf",
  CMD_GET_REACTOR_WATER_SAMPLE_RECORDS: "get_reactor_water_sample_records",
  CMD_UPDATE_REACTOR_WATER_SAMPLE_RECORD: "update_reactor_water_sample_record",
  CMD_GET_SAMPLE_IRRADIATION_LOG_RECORD_FOR_YEAR: "get_sample_irradiation_log_record_for_year",
  CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS: "get_sample_irradiation_log_records",
  CMD_UPDATE_SAMPLE_IRRADIATION_LOG_RECORD: "update_sample_irradiation_log_record",

  CMD_GENERATE_PERSONNEL_RECORDS_PDF: "generate_personnel_records_pdf",
  CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF: "generate_controlled_materials_list_pdf",
  CMD_GENERATE_CONTROLLED_MATERIALS_SURVEILLANCE_SHEET_PDF: "generate_controlled_materials_surveillance_sheet_pdf",

  CMD_GENERATE_SSC_RECORDS_PDF: "generate_ssc_records_pdf",
  CMD_GENERATE_SSC_AMP_RECORDS_PDF: "generate_ssc_amp_records_pdf",
  CMD_GENERATE_SSC_MAINTENANCE_REPORT_PDF: "generate_ssc_maintenance_report_pdf",

  CMD_GENERATE_PERSONNEL_DOSE_EVALUATION_PDF: "generate_personnel_dose_evaluation_pdf",

  CMD_GENERATE_SSC_MAINTENANCE_SCHEDULE_PDF: "generate_ssc_maintenance_schedule_pdf",

  CMD_SUGGEST_ANALYSIS_JOBS: "suggest_analysis_jobs",
  CMD_SUGGEST_SUPPORT_SEARCH_TERMS: "suggest_support_search_terms",
  CMD_GET_SEARCH_TERM_CONTENT: "get_search_term_content",

  CMD_GET_PROVENANCE_RECORDS: "get_provenance_records",

  CMD_GET_USER_NOTIFICATION_MESSAGES: "get_user_notification_messages",
  CMD_DELETE_USER_NOTIFICATION_MESSAGE: "delete_user_notification_message",

  CMD_BOT_MESSAGE_SEND: "bot_message_send",

  CMD_GET_ITEM_RECORDS: "get_item_records",
  CMD_GET_REFERRED_TO_ITEM_RECORDS: "get_referred_to_item_records",
  CMD_UPDATE_ITEM_RECORD: "update_item_record",
  CMD_DELETE_ITEM_RECORD: "delete_item_record",

  CMD_GET_SESSION_INFO: "get_session_info",
  CMD_INTERRUPT_BACKGROUND_TASK: "interrupt_background_task",

  CMD_GET_DATA_STREAM_METRICS_RECORDS: "get_data_stream_metrics_records",
  CMD_DISCOVER_DATA_STREAM_METRICS: "discover_data_stream_metrics",

  METADATA: 'metadata',
  INCLUDE_METADATA: 'include.metadata',
  ITEM_ID: "item_id",
  RECORD_KEY: "record_key",
  RECORD_TYPE: "record_type",

  NURIMS_TITLE: 'nurims.title',
  NURIMS_CREATED_BY: 'nurims.createdby',
  NURIMS_CREATION_DATE: 'nurims.creationdate',
  NURIMS_TITLE_SUBTITLE: 'nurims.title.subtitle',
  NURIMS_SOURCE: 'nurims.source',
  NURIMS_WITHDRAWN: 'nurims.withdrawn',
  NURIMS_DESCRIPTION: 'nurims.description',
  NURIMS_AVAILABLE: 'nurims.available',
  NURIMS_RELATED_ITEM_ID: "nurims.related.item_id",
  NURIMS_SAMPLEDATE: 'nurims.sampledate',
  NURIMS_SURVEILLANCE_FREQUENCY: 'nurims.surveillancefrequency',
  NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY: 'nurims.inventorysurveillancefrequency',
  NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY: 'nurims.leaktestsurveillancefrequency',
  NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY: 'nurims.activitysurveillancefrequency',
  NURIMS_COVERAGE_LOCATION: "nurims.coverage.location",
  NURIMS_ENTITY_TYPE: 'nurims.entity.type',
  NURIMS_ENTITY_ASSIGNED_ROLE: 'nurims.entity.assignedrole',
  NURIMS_ENTITY_DATE_OF_BIRTH: 'nurims.entity.dob',
  NURIMS_ENTITY_NATIONAL_ID: 'nurims.entity.nid',
  NURIMS_ENTITY_SEX: 'nurims.entity.sex',
  NURIMS_ENTITY_CONTACT: 'nurims.entity.contact',
  NURIMS_ENTITY_ADDRESS: 'nurims.entity.address',
  NURIMS_ENTITY_AVATAR: 'nurims.entity.avatar',
  NURIMS_ENTITY_WORK_DETAILS: 'nurims.entity.workdetails',
  NURIMS_ENTITY_DOSE_PROVIDER_ID: 'nurims.entity.doseproviderid',
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED: 'nurims.entity.iswholebodymonitored',
  NURIMS_ENTITY_IS_EXTREMITY_MONITORED: 'nurims.entity.isextremitymonitored',
  NURIMS_ENTITY_IS_WRIST_MONITORED: 'nurims.entity.iswristmonitored',

  NURIMS_DOSIMETRY_MEASUREMENTS: "nurims.dosimetry.measurements",
  NURIMS_DOSIMETRY_BATCH_ID: "nurims.dosimetry.batchid",
  NURIMS_DOSIMETRY_ID: "nurims.dosimetry.id",
  NURIMS_DOSIMETRY_TYPE: "nurims.dosimetry.type",
  NURIMS_DOSIMETRY_DEVICE_TYPE: "nurims.dosimetry.devicetype",
  NURIMS_DOSIMETRY_TIMESTAMP: "nurims.dosimetry.timestamp",
  NURIMS_DOSIMETRY_UNITS: "nurims.dosimetry.units",
  NURIMS_DOSIMETRY_MONITOR_PERIOD: "nurims.dosimetry.monitorperiod",
  NURIMS_DOSIMETRY_SHALLOW_DOSE: "nurims.dosimetry.shallowdose",
  NURIMS_DOSIMETRY_DEEP_DOSE: "nurims.dosimetry.deepdose",
  NURIMS_DOSIMETRY_EXTREMITY_DOSE: "nurims.dosimetry.extremitydose",
  NURIMS_DOSIMETRY_WRIST_DOSE: "nurims.dosimetry.wristdose",
  NURIMS_DOSIMETRY_INTERNAL_DOSE: "nurims.dosimetry.internaldose",

  NURIMS_MATERIAL_DOCUMENTS: 'nurims.material.documents',
  NURIMS_MATERIAL_IMAGE: 'nurims.material.image',
  NURIMS_MATERIAL_TYPE: 'nurims.material.type',
  NURIMS_MATERIAL_CLASSIFICATION: 'nurims.material.classification',
  NURIMS_MATERIAL_INVENTORY_STATUS: 'nurims.material.inventorystatus',
  NURIMS_MATERIAL_PHYSICAL_FORM: 'nurims.material.physicalform',
  NURIMS_MATERIAL_ID: 'nurims.material.id',
  NURIMS_MATERIAL_REGISTRATION_DATE: 'nurims.material.registrationdate',
  NURIMS_MATERIAL_MANUFACTURER_RECORD: 'nurims.material.manufacturerrecord',
  NURIMS_MATERIAL_OWNER_RECORD: 'nurims.material.ownerrecord',
  NURIMS_MATERIAL_STORAGE_LOCATION: 'nurims.material.storagelocation',
  NURIMS_MATERIAL_STORAGE_LOCATION_RECORD: 'nurims.material.storagelocationrecord',
  NURIMS_MATERIAL_STORAGE_LOCATION_MARKERS: 'nurims.material.storagelocationmarkers',
  NURIMS_MATERIAL_STORAGE_IMAGE: 'nurims.material.storageimage',
  NURIMS_MATERIAL_STORAGE_MAP_IMAGE: 'nurims.material.storagemapimage',
  NURIMS_MATERIAL_NUCLIDES: 'nurims.material.nuclides',
  NURIMS_MATERIAL_QUANTITY_UNITS: 'nurims.material.quantityunits',

  NURIMS_SSC_ID: "nurims.ssc.id",
  NURIMS_SSC_COMMISSIONING_DATE: "nurims.ssc.commissioningdate",
  NURIMS_SSC_TYPE: "nurims.ssc.type",
  NURIMS_SSC_FUNCTION: "nurims.ssc.function",
  NURIMS_SSC_CLASSIFICATION: "nurims.ssc.classification",
  NURIMS_SSC_REACTOR_SAFETY_CATEGORY: "nurims.ssc.reactorsafetycategory",
  NURIMS_SSC_SAFETY_CATEGORY: "nurims.ssc.safetycategory",
  NURIMS_SSC_REACTOR_SAFETY_FUNCTION: "nurims.ssc.reactorsafetyfunction",
  NURIMS_SSC_SAFETY_FUNCTION: "nurims.ssc.safetyfunction",
  NURIMS_SSC_MAINTAINABILITY: "nurims.ssc.maintainability",
  NURIMS_SSC_SURVEILLANCE_FREQUENCY: "nurims.ssc.surveillancefrequency",
  NURIMS_SSC_MAINTENANCE_RECORDS: "nurims.ssc.maintenancerecords",
  NURIMS_SSC_MODIFICATION_RECORDS: "nurims.ssc.modificationrecords",

  NURIMS_SSC_MAINTENANCE_TASK: "nurims.ssc.maintenance.task",
  NURIMS_SSC_MAINTENANCE_SCOPE: "nurims.ssc.maintenance.scope",
  NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA: "nurims.ssc.maintenance.acceptancecriteria",
  NURIMS_SSC_MAINTENANCE_ISSUE: "nurims.ssc.maintenance.issue",
  NURIMS_SSC_MAINTENANCE_REMOVED_FROM_SERVICE: "nurims.ssc.maintenance.removedfromservice",
  NURIMS_SSC_MAINTENANCE_RETURNED_TO_SERVICE: "nurims.ssc.maintenance.returnedtoservice",
  NURIMS_SSC_MAINTENANCE_CORRECTIVE_ACTIONS: "nurims.ssc.maintenance.correctiveactions",
  NURIMS_SSC_MAINTENANCE_DOCUMENTS: "nurims.ssc.maintenance.documents",
  NURIMS_SSC_MAINTENANCE_IMPACT_REACTOR_USAGE: "nurims.ssc.maintenance.impactreactorusage",
  NURIMS_SSC_MAINTENANCE_OBSOLESCENCE_ISSUE: "nurims.ssc.maintenance.obsolescenceissue",
  NURIMS_SSC_MAINTENANCE_PREVENTIVE_MAINTENANCE: "nurims.ssc.maintenance.preventivemaintenance",
  NURIMS_SSC_MAINTENANCE_CORRECTIVE_MAINTENANCE: "nurims.ssc.maintenance.correctivemaintenance",
  NURIMS_SSC_MAINTENANCE_PERSONNEL: "nurims.ssc.maintenance.personnel",

  NURIMS_SSC_ROUTINE_MAINTENANCE_DATA_STATS: "nurims.ssc.routinemaintenance.data.stats",

  NURIMS_SSC_MODIFICATION_ACTIONS: "nurims.ssc.modification.actions",
  NURIMS_SSC_MODIFICATION_STARTDATE: "nurims.ssc.modification.startdate",
  NURIMS_SSC_MODIFICATION_ENDDATE: "nurims.ssc.modification.enddate",
  NURIMS_SSC_MODIFICATION_COMMISSIONED_DATE: "nurims.ssc.modification.commissioneddate",
  NURIMS_SSC_MODIFICATION_OBSOLESCENCE_ISSUE: "nurims.ssc.modification.obsolescenceissue",
  NURIMS_SSC_MODIFICATION_IMPACT_REACTOR_USAGE: "nurims.ssc.modification.impactreactorusage",
  NURIMS_SSC_MODIFICATION_PERSONNEL: "nurims.ssc.modification.personnel",
  NURIMS_SSC_MODIFICATION_ACCEPTANCE_CRITERIA: "nurims.ssc.modification.acceptancecriteria",
  NURIMS_SSC_MODIFICATION_DOCUMENTS: "nurims.ssc.modification.documents",

  NURIMS_AMP_AGEING_MECHANISM: "nurims.amp.ageingmechanism",
  NURIMS_AMP_AGEING_EFFECT: "nurims.amp.ageingeffect",
  NURIMS_AMP_AGEING_DETECTION_METHOD: "nurims.amp.ageingdetectionmethod",
  NURIMS_AMP_AGEING_DEGRADATION: "nurims.amp.ageingdegradation",
  NURIMS_AMP_MATERIALS: "nurims.amp.materials",
  NURIMS_AMP_ACCEPTANCE_CRITERIA: "nurims.amp.acceptancecriteria",
  NURIMS_AMP_MITIGATION_STEPS: "nurims.amp.mitigationsteps",
  NURIMS_AMP_SURVEILLANCE_FREQUENCY: "nurims.amp.surveillancefrequency",

  NURIMS_OPERATION_REPORT: "nurims.operation.report",
  NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES: "nurims.operation.data.irradiationsampletypes",
  NURIMS_OPERATION_DATA_IRRADIATIONDURATION: "nurims.operation.data.irradiationduration",
  NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE: "nurims.operation.data.proposedirradiationdate",
  NURIMS_OPERATION_DATA_NEUTRONFLUX: "nurims.operation.data.neutronflux",
  NURIMS_OPERATION_DATA_CONTROLRODPOSITION: "nurims.operation.data.controlrodposition",
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDES: "nurims.operation.data.reactorwaterchemistry.nuclides",
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDEUNITS: "nurims.operation.data.reactorwaterchemistry.nuclideunits",
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS: "nurims.operation.data.reactorwaterchemistry.analysis",
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_REPORTFILE: "nurims.operation.data.reactorwaterchemistry.reportfile",
  NURIMS_OPERATION_DATA_STATS: "nurims.operation.data.stats",
  NURIMS_OPERATION_DATA_STREAM_METRICS: "nurims.operation.datastream.metrics",
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB: "nurims.operation.data.irradiatedsample.job",
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST: "nurims.operation.data.irradiatedsample.list",
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER: "nurims.operation.data.irradiationauthorization.approver",
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVAL_DATE: "nurims.operation.data.irradiationauthorization.approvaldate",
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE: "nurims.operation.data.irradiationauthorization.submissiondate",
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_ENTITY: "nurims.operation.data.irradiationauthorization.submissionentity",

  EMPLOYEE_RECORD_TYPE: "employee_record",
  MANUFACTURER_RECORD_TYPE: "manufacturer_record",
  STORAGE_RECORD_TYPE:  "storage_record",
  SSC_RECORD_TYPE:  "ssc_record",
  MATERIAL_RECORD_TYPE: "material_record",
  DOSIMETRY_RECORD_TYPE: "dosimetry_record",
  REACTOR_OPERATING_RUN_RECORD_TYPE: "reactor_operating_run_record",
  MONITOR_RECORD_TYPE: "monitor_record",
  IRRADIATED_SAMPLE_LOG_RECORD_TYPE: "irradiated_sample_log_record",
  REACTOR_WATER_CHEMISTRY_RECORD_TYPE: "reactor_water_chemistry_record",
  REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD_TYPE: "reactor_sample_irradiation_authorization_record",
  EMPLOYEE_RECORD: "employee_record",
  FIXED_LOCATION_MONITOR_RECORD: "fixed_location_monitor_record",
  SSC_MODIFICATION_RECORD: "ssc_modification_record",
  SSC_MAINTENANCE_RECORD: "ssc_maintenance_record",
  SSC_ROUTINE_MAINTENANCE_RECORD_TYPE: "ssc_routine_maintenance_record",

  PERSONNEL_TOPIC: "personnel",
  MONITOR_TOPIC: "monitor",
  MANUFACTURER_TOPIC: "manufacturer",
  OWNER_TOPIC: "owner",
  MATERIAL_TOPIC: "material",
  MEASUREMENT_TOPIC: "measurement",
  STORAGE_LOCATION_TOPIC: "storage_location",
  SSC_TOPIC: "structures_systems_components",
  OPERATION_TOPIC: "operation",
  REACTOR_IRRADIATION_AUTHORIZATION_TOPIC: "reactor_irradiation_authorization",
  EMERGENCY_PREPAREDNESS_AND_RESPONSE_TOPIC: "emergency_preparedness_and_response",

  BLANK_PDF: "blank.pdf",

  BLANK_IMAGE_OBJECT: {file: '', uri: ''},

  WHOLE_BODY: "wholebody",
  EXTREMITY: "extremity",
  WRIST: "wrist",

  BOOL_TRUE_STR: "true",
  BOOL_FALSE_STR: "false",

  UNDEFINED_DATE_STRING: "1970-01-01T00:00:00",

  DELETE_METADATA_TAG: "___delete___",

  CURRENT_USER: "**current_user**",
});
