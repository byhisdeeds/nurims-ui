import IconPeople from "@mui/icons-material/People";
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ApartmentIcon from '@mui/icons-material/Apartment';

export const MenuItems = [
  {
    label: 'Chat With NURIMS',
    value: 'chat.bot',
    icon: LockIcon,
    tooltip: 'Natural language interface to NURIMS',
    title: 'Chat With NURIMS',
    authmodlevel: 'basic',
  },
  {
    label: 'Controlled Materials',
    value: 'controlled.materials',
    icon: LockIcon,
    tooltip: 'Actions related to the management of controlled materials',
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Materials',
        tooltip: 'Actions related to the management of controlled materials',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Storage',
            value: 'cm.register.update.material.storage.location',
            title: 'Register/Update Controlled Material Storage',
            tooltip: 'Register and/or update storage location details for controlled materials.',
            authmodlevel: 'basic',
          },
          {
            label: 'Manufacturer',
            value: 'cm.register.update.material.manufacturer',
            title: 'Register/Update Controlled Material Manufacturer',
            tooltip: 'Register and/or update manufacturer details for controlled materials',
            authmodlevel: 'basic',
          },
          {
            label: 'Owner',
            value: 'cm.update.material.owner',
            title: 'Register/Update Controlled Material Owner',
            tooltip: 'Register and/or update ownership details for controlled materials',
            authmodlevel: 'basic',
          },
          {
            label: 'Material',
            value: 'cm.register.update.material',
            title: 'Register/Update Controlled Material',
            tooltip: 'Register and/or update the details for controlled materials',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Surveillance',
        tooltip: 'Actions related to the surveillance of controlled materials.',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Surveillance Sheet',
            value: 'cm.generate.material.surveillance.sheet',
            title: 'Controlled Material Surveillance Sheet',
            tooltip: 'Generate controlled material surveillance sheet',
            authmodlevel: 'basic',
          },
          {
            label: 'Update Surveillance',
            value: 'cm.update.material.surveillance',
            title: 'Update Surveillance Record',
            tooltip: 'Update the controlled material record with the results of surveillance activities.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Reports',
        value: '',
        tooltip: 'Controlled material resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'RadPro Schedule',
            value: 'cm.radiation.protection.schedule',
            title: 'sss',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            label: 'Inventory',
            value: 'cm.inventory.list',
            title: 'ssss',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: 'List of Materials',
            value: 'cm.view.controlled.materials.list',
            title: 'Controlled Materials List',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ]
      },
    ]
  },
  {
    label: 'EPR',
    value: 'emergency.preparedness.response',
    tooltip: 'Emergency Preparedness and Response actions',
    authmodlevel: 'basic',
    icon: IconPeople,
    children: [
      {
        label: '○ Concept of Operations',
        tooltip: 'A basic concept of operations describes the response process, and assigns roles and responsibilities to each group, organization or individual involved in emergency preparedness and response.',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Scenarios',
            value: 'ep.add.edit.emergency.scenarios',
            title: 'Add/Edit Emergency Scenarios',
            tooltip: 'Brief description of the response to an emergency used when planning the response. It ensures that all those involved in the development of a response capability share a common vision.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Post Event Activities',
        tooltip: 'A basic concept of operations describes the response process, and assigns roles and responsibilities to each group, organization or individual involved in emergency preparedness and response.',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Capture Datasets',
            value: 'ep.add.edit.capture.datasets',
            title: 'Add/Edit Capture Dataset',
            tooltip: 'Brief description of the response to an emergency used when planning the response. It ensures that all those involved in the development of a response capability share a common vision.',
            authmodlevel: 'basic',
          },
          {
            label: 'Discover Event Data',
            value: 'ep.discover.event.data',
            title: 'Discover Event Data',
            tooltip: 'Brief description of the response to an emergency used when planning the response. It ensures that all those involved in the development of a response capability share a common vision.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Routine Activities',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Periodic Tasks',
            value: 'ep.routine.activities.periodic.tasks',
            title: 'EPR Periodic Tasks',
            tooltip: 'Emergency preparedness and response routine tasks and activities.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Documents',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'RadPro Schedule',
            value: 'ep.',
            title: 'eeeee',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
        ]
      },
    ]
  },
  {
    label: 'Human Resource',
    value: 'human.resource',
    tooltip: 'Human resource actions',
    icon: IconPeople,
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Personnel',
        tooltip: 'Personnel action',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Personnel',
            value: 'hr.add.edit.personnel',
            title: 'Add/Edit Personnel Records',
            tooltip: 'Add/Edit organisation staff details including external contractors that interact with the nuclear or radioactive materials and need to be monitored.',
            authmodlevel: 'basic',
          },
          {
            label: 'Monitoring Status',
            value: 'hr.update.personnel.monitoring.status',
            title: 'Update Personnel Monitoring Status',
            tooltip: 'Update dosimeter types and surveillance frequency used to monitor organisation staff and external contractors',
            authmodlevel: 'basic',
          },
          {
            label:  'Update Training',
            value: 'hr.update.person.training.record',
            title: 'Update Personnel Training Record',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: 'View Records',
            value: 'hr.view.person.records',
            title: 'View Personnel Records',
            tooltip: 'View all personnel records',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Training',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Training Program',
            value: 'hr.add.edit.training.programme',
            title: 'Add/Edit Training Programs',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Assessment',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'SSPI',
            value: 'hr.sspi',
            title: 'Personnel Safety/Security Performance Indicators',
            tooltip: 'Safety and security performance indicators for personnel',
            authmodlevel: 'pro',
          },
          {
            label: 'TPI',
            value: 'hr.tpi',
            title: 'Personnel Training Performance Indicators',
            tooltip: 'Training performance indicators for personnel',
            authmodlevel: 'pro',
          },
        ]
      },
    ]
  },
  {
    label: 'Maintenance',
    value: 'maintenance',
    tooltip: 'Maintenance of Structures, Systems, & Components',
    icon: EngineeringIcon,
    authmodlevel: 'basic',
    children: [
      {
        label: '○ SSC\'s',
        tooltip: 'Structures, systems, and components means the structures, systems, or components associated with the operation of the research reactor, including portions of process systems, whose preventative or mitigative function is necessary to limit radioactive hazardous material exposure to the public, as determined from safety analyses.',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit SSC Record',
            value: 'ssc.add.edit.ssc',
            title: 'Add/Edit Structures, Systems, and Components',
            tooltip: 'Add/Edit structures systems and components.',
            authmodlevel: 'basic',
          },
          {
            label: 'View SSC List',
            value: 'ssc.view.ssc.list',
            title: 'View SSC Records',
            tooltip: 'View structures systems and components records.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Aging Management',
        tooltip: 'Aging management programme (AMP) for Structures, systems and components.',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit AMP Record',
            value: 'ssc.add.edit.ssc.amp',
            title: 'Add/Edit SSC Aging Management Program',
            tooltip: 'Add or Edit an Aging Management Program (AMP) for an SSC',
            authmodlevel: 'basic',
          },
          {
            label: 'View AMP List',
            value: 'ssc.amp.list',
            title: 'View Aging Management Program SSC List',
            tooltip: 'View Aging Management Program (AMP) SSC details',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Issues & Modifications',
        tooltip: 'Corrective maintenance issue and SSC upgrade task records.',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Issue Record',
            value: 'ssc.add.edit.ssc.corrective.maintenance.issue.record',
            title: 'Add/Edit SSC Corrective Maintenance Issue Record',
            tooltip: 'Add or edit an SSC corrective maintenance issue record.',
            authmodlevel: 'basic',
          },
          {
            label: 'Add/Edit Modification Record',
            value: 'ssc.add.edit.ssc.modification.record',
            title: 'Add/Edit SSC Modification Record',
            tooltip: 'Add or edit a new feature or upgrade modification request record for an SSC',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Routine Maintenance Data',
        tooltip: 'Data on the maintenance carried out on the reactor routinely',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Maintenance Data',
            value: 'ssc.add.edit.reactor.routine.maintenance.records',
            title: 'Add/Edit Weekly Maintenance Data',
            tooltip: 'Update the reactor weekly maintenance records from the YOKOGAWA operating parameters data files (*.GTE)',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Reports',
        tooltip: 'Reports.',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Maintenance Schedule',
            value: 'ssc.generate.ssc.maintenance.schedule',
            title: 'Generate SSC Maintenance Schedule',
            tooltip: 'Generate a preventive maintenance schedule for structures, systems and components.',
            authmodlevel: 'basic',
          },
          {
            label: 'Maintenance Report',
            value: 'ssc.generate.ssc.maintenance.report',
            title: 'Generate SSC Maintenance Report',
            tooltip: 'Generate a report on corrective or preventive maintenance carried out on structures, systems and components.',
            authmodlevel: 'basic',
          },
          {
            label: 'AMP Schedule',
            value: 'ssc.generate.amp.schedule',
            title: 'Add/Edit Structures, Systems, and Components',
            tooltip: 'Add/Edit structures systems and components.',
            authmodlevel: 'basic',
          },
        ]
      },
    ]
  },
  {
    label: 'Organisation',
    value: 'organisation',
    tooltip: 'Details on the organisation',
    icon: ApartmentIcon,
    authmodlevel: 'basic',
    children: [
      {
        label: 'Update Details',
        value: 'org.edit.details',
        title: 'Update Organisation details',
        tooltip: 'Edit details on the organisation',
        authmodlevel: 'basic',
      },
      {
        label: 'Statutory Requirements',
        value: 'org.statutory.requirements',
        title: 'Add/Edit/Print Statutory Requirements',
        tooltip: 'Statutory requirement actions',
        authmodlevel: 'basic',
      },
      {
        label: 'Documents',
        value: 'org.maintain.organisation.documents',
        title: 'Organisation Document Repository',
        tooltip: 'Add/Update documents related to the organisation and its responsibilities. These will include operating licenses, statutory requirements, organisational chart etc.',
        authmodlevel: 'basic',
      },
    ]
  },
  {
    label: 'Radiation Protection',
    value: 'radiation.protection',
    icon: HealthAndSafetyIcon,
    tooltip: 'Radiation protection resource actions',
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Monitors',
        tooltip: 'Radiation protection resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Monitors',
            value: 'rp.add.edit.monitors',
            title: 'Add/Edit Monitor Records',
            tooltip: 'Add/Edit radiation monitor details including area, contamination, waste, and other types of monitors.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Dosimetry',
        tooltip: 'Dosimetry resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Personnel Measurements',
            value: 'rp.add.edit.personnel.dosimetry.measurements',
            title: 'Add/Edit Personnel Dosimetry Measurement Record',
            tooltip: 'Add and edit dosimetry measurement for personnel monitors.',
            authmodlevel: 'basic',
          },
          {
            label: 'Monitor Measurements',
            value: 'rp.add.edit.monitor.dosimetry.measurements',
            title: 'Add/Edit Monitor Dosimetry Measurement Record',
            tooltip: 'Add and edit dosimetry measurement for area, contamination, waste and other monitors.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Reports',
        tooltip: 'Radiation protection resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Monitors List',
            value: 'rp.monitors.list',
            title: 'list',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: 'Monitor Data',
            value: 'rp.monitor.data.statistics',
            title: 'data',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            label: 'Personnel Dose Report',
            value: 'rp.personnel.dosimetry.report',
            title: 'Personnel Dosimetry Report',
            tooltip: 'Evaluation of the personnel dosimetry measurements for a period.',
            authmodlevel: 'basic',
          },
          {
            label: 'Personnel Dose Profile',
            value: 'rp.personnel.dosimetry.evaluation',
            title: 'Evaluate Personnel Dosimetry',
            tooltip: 'Evaluate personnel dosimetry measurements',
            authmodlevel: 'pro',
          },
        ]
      },
      {
        label: '○ Documents',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add Dosimetry Reports',
            value: 'rp.documents.add.dosimetry.reports',
            title: 'Add Dosimetry Reports',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: 'Monitor Data',
            value: 'rp.monitor.data.statistics',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            label: 'Personnel Dose Evaluation',
            value: 'rp.personnel.dose.evaluation.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: 'Personnel Dose Profile',
            value: 'rp.personnel.dose.profile.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
        ]
      },
    ]
  },
  {
    label: 'Reactor Operations',
    value: 'reactoroperations',
    tooltip: 'Reactor Operations',
    icon: BusinessIcon,
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Authorizations',
        tooltip: 'Authorizations for reactor utilization',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Add/Edit Irradiation Auth.',
            value: 'ro.add.edit.reactor.sample.irradiation.records',
            title: 'Add/Edit Reactor Sample Irradiation (RSI) Authorization Records',
            tooltip: 'Add or edit the irradiation request/authorization record for samples to be irradiated in the reactor.',
            authmodlevel: 'basic',
          },
          {
            label: 'Print Auth. Records',
            value: 'ro.generate.reactor.sample.irradiation.authorization.pdf',
            title: 'Print Reactor Sample Irradiation Authorization Pdf',
            tooltip: 'Generate a pdf of the irradiation authorization records for samples to be irradiated in the reactor.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Operating Data',
        tooltip: 'Data on the reactor operating runs',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Reactor Run Data',
            value: 'ro.add.edit.reactor.operating.run.records',
            title: 'Add/Edit Operating Run Records',
            tooltip: 'Update the reactor operation run records from the YOKOGAWA operating parameters data files (*.GTE)',
            authmodlevel: 'basic',
          },
          {
            label: 'Reactor Data Stream Metrics',
            value: 'ro.operating.datastream.metrics',
            title: 'View Reactor Data Stream Metrics',
            tooltip: 'Display reactor operation data stream metrics from the YOKOGAWA and DRM data files.',
            authmodlevel: 'basic',
          },
          {
            label: 'Add/Edit Irrad. Samples',
            value: 'ro.add.edit.irradiated.samples',
            title: 'Add/Edit Irradiated Sample Records',
            tooltip: 'Add and edit irradiated sample records',
            authmodlevel: 'basic',
          },
          {
            label: 'Add/Edit Water Samples',
            value: 'ro.add.edit.reactor.water.samples',
            title: 'Add/Edit Reactor Water Records',
            tooltip: 'Add and edit reactor water chemistry records',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Reports',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: 'Reactor Operations',
            value: 'ro.reactor.operations.report',
            title: 'Reactor Operation Reports',
            tooltip: 'Report on reactor operations',
            authmodlevel: 'basic',
          },
        ]
      },
    ]
  },
  {
    label: 'Safety/Security Culture',
    value: 'safety.security.culture',
    icon: HealthAndSafetyIcon,
    tooltip: 'Safety and security culture actions',
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Safety',
        tooltip: 'Safety culture programs and activities',
        authmodlevel: 'basic',
        children: [
        ]
      },
      {
        label: '○ Security',
        tooltip: 'Security culture programs and activities',
        authmodlevel: 'basic',
        children: [
        ]
      },
    ]
  },
  {
    label: 'System Admin',
    value: 'sysadmin',
    tooltip: 'System Administration',
    icon: BusinessIcon,
    authmodlevel: 'basic',
    children: [
      {
        label: 'Manage Users',
        value: 'sysadmin.manage.users',
        title: 'Manage Users',
        tooltip: 'Manage system users',
        authmodlevel: 'basic',
      },
      {
        label: 'System Configuration',
        value: 'sysadmin.systemconfiguration',
        title: 'System Configuration',
        tooltip: 'System configuration',
        authmodlevel: 'basic',
      },
      {
        label: 'Cleanup Large Object Store',
        value: 'sysadmin.cleanup.large.object.store',
        title: 'Cleanup Large Object Store',
        tooltip: 'Cleanup large object store',
        authmodlevel: 'basic',
      },
      {
        label: 'Discover Orphaned Metadata',
        value: 'sysadmin.discover.orphaned.metadata',
        title: 'Discover Orphaned Metadata',
        tooltip: 'Discover orphaned metadata',
        authmodlevel: 'basic',
      },
    ]
  },
  {
    label: 'Support',
    value: 'support',
    tooltip: 'Support',
    icon: BusinessIcon,
    authmodlevel: 'sysadmin',
    children: [
      {
        label: 'Glossary',
        value: 'support.terms.and.definitions',
        title: 'Glossary of Terms and Definitions',
        tooltip: 'View a glossary of various terms and definitions used throughout the system.',
        authmodlevel: 'basic',
      },
    ]
  },
]
