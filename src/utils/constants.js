module.exports = Object.freeze({
  MY_ACCOUNT: 'myaccount',
  SETTINGS: 'settings',
  HR_ADD_EDIT_PERSONNEL: 'hr.add.edit.personnel',
  HR_VIEW_PERSONNEL_RECORDS: 'hr.view.person.records',
  HR_UPDATE_MONITORING_STATUS: 'hr.update.personnel.monitoring.status',
  RP_ADD_DOSIMETRY_MEASUREMENT: 'rp.add.dosimetry.measurement',
  CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER: 'cm.register.update.material.manufacturer',
  CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION: 'cm.register.update.material.storage.location',
  CM_REGISTER_CONTROLLED_MATERIAL: 'cm.register.update.material',
  CM_GENERATE_MATERIAL_SURVEILLANCE_SHEET: 'cm.generate.material.surveillance.sheet',
  CM_VIEW_CONTROLLED_MATERIALS_LIST: 'cm.view.controlled.materials.list',
  SSC_ADD_EDIT_SSC: 'ssc.add.edit.ssc',
  SSC_ADD_EDIT_SSC_AMP: 'ssc.add.edit.ssc.amp',
  SSC_VIEW_SSC_RECORDS: 'ssc.view.ssc.records',
  RO_ADD_EDIT_REACTOR_OPERATING_RUN_DATA: 'ro.add.edit.reactor.operating.run.data',

  SYSADMIN_MANAGE_USERS: 'sysadmin.manage.users',

  BASIC_RP_ADD_EDIT_MONITORS: "rp.add.edit.monitors",

  PRO_IMPORT_ICENS_PERSONNEL: 'sysadmin.import.icens.personnel',
  PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_MANUFACTURERS: 'sysadmin.import.icens.controlled.material.manufacturers',
  PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_STORAGE_LOCATIONS: 'sysadmin.import.icens.controlled.material.storage.locations',
  PRO_IMPORT_ICENS_CONTROLLED_MATERIALS: 'sysadmin.import.icens.controlled.materials',
  PRO_IMPORT_ICENS_MONITORS: 'sysadmin.import.icens.monitors',

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

  CMD_GET_MATERIAL_RECORDS: "get_material_records",
  CMD_UPDATE_MATERIAL_RECORD: "update_material_record",
  CMD_DELETE_MATERIAL_RECORD: "delete_material_record",

  CMD_GET_ORGANISATION: "get_organisation",
  CMD_GET_SYSTEM_PROPERTIES: "get_system_properties",
  CMD_SET_SYSTEM_PROPERTIES: "set_system_properties",

  CMD_GET_USER_RECORDS: "get_user_records",
  CMD_UPDATE_USER_RECORD: "update_user_record",
  CMD_DELETE_USER_RECORD: "delete_user_record",

  CMD_GENERATE_PERSONNEL_RECORDS_PDF: "generate_personnel_records_pdf",
  CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF: "generate_controlled_materials_list_pdf",
  CMD_GENERATE_CONTROLLED_MATERIALS_SURVEILLANCE_SHEET_PDF: "generate_controlled_materials_surveillance_sheet_pdf",

  CMD_DELETE_STORAGE_LOCATION_RECORD: "delete_storage_location_record",
  CMD_UPDATE_STORAGE_LOCATION_RECORD: "update_storage_location_record",
  CMD_GET_STORAGE_LOCATION_RECORDS: "get_storage_location_records",

  CMD_GET_SSC_RECORDS: "get_ssc_records",
  CMD_UPDATE_SSC_RECORD: "update_ssc_record",
  CMD_DELETE_SSC_RECORD: "delete_ssc_record",

  CMD_GENERATE_SSC_RECORDS_PDF: "generate_ssc_records_pdf",

  METADATA: 'metadata',
  INCLUDE_METADATA: 'include.metadata',
  ITEM_ID: "item_id",

  NURIMS_TITLE: 'nurims.title',
  NURIMS_SOURCE: 'nurims.source',
  NURIMS_WITHDRAWN: 'nurims.withdrawn',
  NURIMS_DESCRIPTION: 'nurims.description',
  NURIMS_SURVEILLANCE_FREQUENCY: 'nurims.surveillancefrequency',
  NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY: 'nurims.inventorysurveillancefrequency',
  NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY: 'nurims.leaktestsurveillancefrequency',
  NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY: 'nurims.activitysurveillancefrequency',
  NURIMS_COVERAGE_LOCATION: "nurims.coverage.location",

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

  NURIMS_MATERIAL_DOCUMENTS: 'nurims.material.documents',
  NURIMS_MATERIAL_IMAGE: 'nurims.material.image',
  NURIMS_MATERIAL_TYPE: 'nurims.material.type',
  NURIMS_MATERIAL_CLASSIFICATION: 'nurims.material.classification',
  NURIMS_MATERIAL_INVENTORY_STATUS: 'nurims.material.inventorystatus',
  NURIMS_MATERIAL_PHYSICAL_FORM: 'nurims.material.physicalform',
  NURIMS_MATERIAL_ID: 'nurims.material.id',
  NURIMS_MATERIAL_REGISTRATION_DATE: 'nurims.material.registrationdate',
  NURIMS_MATERIAL_MANUFACTURER_RECORD: 'nurims.material.manufacturerrecord',
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
  NURIMS_SSC_CLASSIFICATION: "nurims.ssc.classification",
  NURIMS_SSC_SAFETY_CATEGORY: "nurims.ssc.safetycategory",
  NURIMS_SSC_SAFETY_FUNCTION: "nurims.ssc.safetyfunction",
  NURIMS_SSC_MAINTAINABILITY: "nurims.ssc.maintainability",
  NURIMS_SSC_SURVEILLANCE_FREQUENCY: "nurims.ssc.surveillancefrequency",
  NURIMS_SSC_MAINTENANCE_TASK: "nurims.ssc.maintenancetask",
  NURIMS_SSC_MAINTENANCE_SCOPE: "nurims.ssc.maintenancescope",
  NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA: "nurims.ssc.maintenanceacceptancecriteria",

  NURIMS_AMP_AGEING_MECHANISM: "nurims.amp.ageingmechanism",
  NURIMS_AMP_AGEING_EFFECT: "nurims.amp.ageingeffect",
  NURIMS_AMP_AGEING_DETECTION_METHOD: "nurims.amp.ageingdetectionmethod",
  NURIMS_AMP_AGEING_DEGRADATION: "nurims.amp.ageingdegradation",
  NURIMS_AMP_MATERIALS: "nurims.amp.materials",
  NURIMS_AMP_ACCEPTANCE_CRITERIA: "nurims.amp.acceptancecriteria",
  NURIMS_AMP_MITIGATION_STEPS: "nurims.amp.mitigationsteps",
  NURIMS_AMP_SURVEILLANCE_FREQUENCY: "nurims.amp.surveillancefrequency",

  BLANK_PDF: 'data:application/pdf;base64,JVBERi0xLjQKJb/3ov4KMSAwIG9iago8PCAvUGFnZXMgMiAwIFIgL1R5cGUgL0NhdGFsb2cgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL0NvdW50IDEgL0tpZHMgWyAzIDAgUiBdIC9UeXBlIC9QYWdlcyA+PgplbmRvYmoKMyAwIG9iago8PCAvQ29udGVudHMgNCAwIFIgL0dyb3VwIDw8IC9DUyAvRGV2aWNlUkdCIC9JIHRydWUgL1MgL1RyYW5zcGFyZW5jeSAvVHlwZSAvR3JvdXAgPj4gL01lZGlhQm94IFsgMCAwIDYxMiA3OTEuMjUgXSAvUGFyZW50IDIgMCBSIC9SZXNvdXJjZXMgNSAwIFIgL1R5cGUgL1BhZ2UgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0ZpbHRlciAvRmxhdGVEZWNvZGUgL0xlbmd0aCAzMCA+PgpzdHJlYW0KeJwzVDAAQl1DIGFuaahnZKqQnMtVyBXIBQA6LATGZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8ID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NCAwMDAwMCBuIAowMDAwMDAwMTIzIDAwMDAwIG4gCjAwMDAwMDAyOTggMDAwMDAgbiAKMDAwMDAwMDM5OCAwMDAwMCBuIAp0cmFpbGVyIDw8IC9Sb290IDEgMCBSIC9TaXplIDYgL0lEIFs8YzhjZDFmYzFhMWNiODBlZTgyNzI1ZjIyMTYyMTU2NDE+PGM4Y2QxZmMxYTFjYjgwZWU4MjcyNWYyMjE2MjE1NjQxPl0gPj4Kc3RhcnR4cmVmCjQxOQolJUVPRgo=',

  BLANK_IMAGE_OBJECT: {file: '', url: ''},
});
