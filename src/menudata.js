import IconPeople from "@mui/icons-material/People";
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import EngineeringIcon from '@mui/icons-material/Engineering';

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
    tooltip: 'Controlled material resource actions',
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Materials',
        value: '',
        tooltip: 'Controlled material resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Storage',
            value: 'cm.register.update.material.storage.location',
            title: 'Register/Update Controlled Material Storage',
            tooltip: 'Register and update controlled material storage location details',
            authmodlevel: 'basic',
          },
          {
            label: '   - Manufacturer',
            value: 'cm.register.update.material.manufacturer',
            title: 'Register/Update Controlled Material Manufacturer',
            tooltip: 'Register and update controlled material manufacturer details',
            authmodlevel: 'basic',
          },
          {
            label: '   - Owner',
            value: 'cm.update.material.owner',
            title: 'Register/Update Controlled Material Owner',
            tooltip: 'Register and update controlled material owner details',
            authmodlevel: 'basic',
          },
          {
            label: '   - Material',
            value: 'cm.register.update.material',
            title: 'Register/Update Controlled Material',
            tooltip: 'Register and update controlled material details',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Surveillance',
        tooltip: 'Surveillance of controlled material resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Surveillance Sheet',
            value: 'cm.generate.material.surveillance.sheet',
            title: 'Controlled Material Surveillance Sheet',
            tooltip: 'Generate controlled material surveillance sheet',
            authmodlevel: 'basic',
          },
          {
            label: '   - Update Surveillance',
            value: 'cm.update.material.surveillance',
            title: '',
            tooltip: 'Human resource actions',
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
            label: '   - RadPro Schedule',
            value: 'cm.radiation.protection.schedule',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            label: '   - Inventory',
            value: 'cm.inventory.list',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: '   - View Material Locations',
            value: 'cm.view.material.locations',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: '   - List of Materials',
            value: 'cm.view.controlled.materials.list',
            title: 'Materials List',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ]
      },
    ]
  },
  {
    label: 'Emergency Preparedness',
    value: 'emergency.preparedness.response',
    tooltip: 'Emergency preparedness and response actions',
    authmodlevel: 'basic',
    icon: IconPeople,
    children: [
      {
        label: '○ Concept of Operations',
        tooltip: 'A basic concept of operations describing the response process. On the basis of the concept of operations, roles and responsibilities are assigned to each group, organization or individual involved in emergency preparedness and response.',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Add Measurement',
            value: 'rp.add.dosimetry.measurement',
            title: 'Add Dosimetry Measurement Record',
            tooltip: 'Add dosimetry measurement for personnel, area, contamination, waste and other monitors',
            authmodlevel: 'basic',
          },
          {
            label: '   - Edit Measurement',
            value: 'rp.edit.dosimetry.measurement',
            title: '',
            tooltip: 'Edit dosimetry measurement for personnel, area, contamination, waste and other monitors already entered',
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
            label: '   - Surveillance Sheet',
            value: 'cm.generate.material.surveillance.sheet',
            title: 'Controlled Material Surveillance Sheet',
            tooltip: 'Generate controlled material surveillance sheet',
            authmodlevel: 'basic',
          },
          {
            label: '   - Update Surveillance',
            value: 'cm.update.material.surveillance',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Documents',
        value: '',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - RadPro Schedule',
            value: 'cm.radiation.protection.schedule',
            title: '',
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
    title: '',
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
            label: '   - Add/Edit Personnel',
            value: 'hr.add.edit.personnel',
            title: 'Add/Edit Personnel Records',
            tooltip: 'Add/Edit organisation staff details including external contractors that interact with the nuclear or radioactive materials and need to be monitored.',
            authmodlevel: 'basic',
          },
          {
            label: '   - Monitoring Status',
            value: 'hr.update.personnel.monitoring.status',
            title: 'Update Personnel Monitoring Status',
            tooltip: 'Update dosimeter types and surveillance frequency used to monitor organisation staff and external contractors',
            authmodlevel: 'basic',
          },
          {
            label:  '   - Update Training',
            value: 'hr.update.person.training.record',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: '   - View Records',
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
            label: '   - Add/Edit Training',
            value: 'hr.add.training',
            title: 'Add/Edit Training Programmes',
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
            label: '   - SPI',
            value: 'hr.spi',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            label: '   - TPP',
            value: 'hr.tpp',
            tooltip: 'Human resource actions',
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
        tooltip: 'Structures, systems and components.',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Add/Edit SSC Record',
            value: 'ssc.add.edit.ssc',
            title: 'Add/Edit Structures, Systems, and Components',
            tooltip: 'Add/Edit structures systems and components.',
            authmodlevel: 'basic',
          },
          {
            label: '   - View SSC List',
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
            label: '   - Add/Edit AMP Record',
            value: 'ssc.add.edit.ssc.amp',
            title: 'Add/Edit SSC Aging Management Programme',
            tooltip: 'Add or Edit an Aging Management Programme (AMP) for an SSC',
            authmodlevel: 'basic',
          },
          {
            label: '   - View AMP List',
            value: 'ssc.amp.list',
            title: 'View Aging Management Programme SSC List',
            tooltip: 'View Aging Management Programme (AMP) SSC details',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Corr. Maintenance',
        tooltip: 'Corrective maintenance issue records.',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Add/Edit Issue Record',
            value: 'ssc.add.edit.ssc.corrective.maintenance.issue.record',
            title: 'Add/Edit SSC Corrective Maintenance Issue Record',
            tooltip: 'Add or Edit an SSC corrective maintenance issue record.',
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
            label: '   - Maintenance Schedule',
            value: 'ssc.generate.maintenance.schedule',
            title: 'Generate Maintenance Schedule',
            tooltip: 'Generate a preventive maintenance schedule for structures, systems and components.',
            authmodlevel: 'basic',
          },
          {
            label: '   - Maintenance Report',
            value: 'ssc.generate.ssc.maintenance.report',
            title: 'Generate SSC Maintenance Report',
            tooltip: 'Generate a report on corrective or preventive maintenance carried out on structures, systems and components.',
            authmodlevel: 'basic',
          },
          {
            label: '   - AMP Schedule',
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
    icon: BusinessIcon,
    authmodlevel: 'basic',
    children: [
      {
        label: '- Update Details',
        value: 'org.edit.details',
        title: '',
        tooltip: 'Edit details on the organisation',
        authmodlevel: 'basic',
      },
      {
        label: '- Statutory Requirements',
        value: 'org.statutory.requirements',
        title: 'Add/Edit/Print Statutory Requirements',
        tooltip: 'Statutory requirement actions',
        authmodlevel: 'basic',
      },
      {
        label: '- Documents',
        value: 'org.maintain.organisation.documents',
        title: 'Maintain Organisation Documents',
        tooltip: 'Add/Update documents related to the organisation and its responsibilities. These will include operating licenses, statutory requirements, organisational chart etc.',
        authmodlevel: 'basic',
      },
    ]
  },
  {
    label: 'Radiation Protection',
    value: 'radiation.protection',
    tooltip: 'Radiation protection resource actions',
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Monitors',
        tooltip: 'Radiation protection resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Add/Edit Monitors',
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
            label: '   - Personnel Measurements',
            value: 'rp.add.edit.personnel.dosimetry.measurements',
            title: 'Add/Edit Personnel Dosimetry Measurement Record',
            tooltip: 'Add and edit dosimetry measurement for personnel monitors.',
            authmodlevel: 'basic',
          },
          {
            label: '   - Monitor Measurements',
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
            label: '   - Monitors List',
            value: 'rp.monitors.list',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: '   - Monitor Data',
            value: 'rp.monitor.data.statistics',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            label: '   - Personnel Dose Report',
            value: 'rp.personnel.dosimetry.report',
            title: 'Personnel Dosimetry Report',
            tooltip: 'Evaluation of the personnel dosimetry measurements for a period.',
            authmodlevel: 'basic',
          },
          {
            label: '   - Personnel Dose Profile',
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
            label: '   - Add Dosimetry Reports',
            value: 'rp.documents.add.dosimetry.reports',
            title: 'Add Dosimetry Reports',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: '   - Monitor Data',
            value: 'rp.monitor.data.statistics',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            label: '   - Personnel Dose Evaluation',
            value: 'rp.personnel.dose.evaluation.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            label: '   - Personnel Dose Profile',
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
            label: '   - Add/Edit Reactor Irrad.',
            value: 'ro.add.edit.reactor.sample.irradiation.records',
            title: 'Add/Edit Reactor Sample Irradiation (RSI) Authorization Records',
            tooltip: 'Add or edit the irradiation request/authorization record for samples to be irradiated in the reactor core.',
            authmodlevel: 'basic',
          },
          {
            label: '   - Print Auth. Records',
            value: 'ro.generate.reactor.sample.irradiation.authorization.pdf',
            title: 'Print Reactor Sample Irradiation Authorization Pdf',
            tooltip: 'Generate a pdf of the irradiation authorization records for samples to be irradiated in the reactor core.',
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
            label: '   - Discover Run Events',
            value: 'ro.add.edit.reactor.operating.run.records',
            title: 'Add/Edit Operating Run Records',
            tooltip: 'Update the reactor operation run records from the YOKOGAWA operating parameters data files (*.GTE)',
            authmodlevel: 'basic',
          },
          {
            label: '   - Add/Edit Irrad. Samples',
            value: 'ro.add.edit.irradiated.samples',
            title: 'Add/Edit Irradiated Sample Records',
            tooltip: 'Add and edit irradiated sample records',
            authmodlevel: 'basic',
          },
          {
            label: '   - Add/Edit Water Samples',
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
            label: '   - Reactor Operations',
            value: 'ro.reactor.operations.report',
            title: 'Reactor Operations Report',
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
    tooltip: 'Safety and security culture actions',
    authmodlevel: 'basic',
    children: [
      {
        label: '○ Safety',
        tooltip: 'Safety resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Add Monitor',
            value: 'rp.add.area.monitor',
            title: '',
            tooltip: 'Add area,contamination, waste, and other types of monitors',
            authmodlevel: 'basic',
          },
          {
            label: '   - Edit Monitor',
            value: 'rp.edit.area.monitor',
            title: '',
            tooltip: 'Edit area, contamination, waste and other types monitors',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        label: '○ Security',
        tooltip: 'Security resource actions',
        authmodlevel: 'basic',
        children: [
          {
            label: '   - Surveillance Sheet',
            value: 'cm.generate.material.surveillance.sheet',
            title: 'Controlled Material Surveillance Sheet',
            tooltip: 'Generate controlled material surveillance sheet',
            authmodlevel: 'basic',
          },
          {
            label: '   - Update Surveillance',
            value: 'cm.update.material.surveillance',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ]
      },
    ]
  },
  {
    label: 'System Admin',
    value: 'sysadmin',
    tooltip: 'System Administration',
    icon: BusinessIcon,
    authmodlevel: 'sysadmin',
    children: [
      {
        label: '- Add Users',
        value: 'sysadmin.manage.users',
        title: 'Manage Users',
        tooltip: 'Manage system users',
        authmodlevel: 'sysadmin',
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
        label: '- Terms and Definitions',
        value: 'support.terms.and.definitions',
        title: 'Terms and Definitions',
        tooltip: 'View terms and definitions',
        authmodlevel: 'basic',
      },
    ]
  },
]


export const MenuData = [
  {
    root: true,
    name: 'Chat With NURIMS',
    title: 'Chat With NURIMS',
    link: 'chat.bot',
    tooltip: 'Natural language interface to NURIMS',
    authmodlevel: 'basic',
    Icon: LockIcon,
    items: [],
  },
  {
    root: true,
    name: 'Controlled Materials',
    link: 'controlled.materials',
    tooltip: 'Controlled material resource actions',
    authmodlevel: 'basic',
    Icon: LockIcon,
    items: [
      {
        name: '○ Materials',
        tooltip: 'Controlled material resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Storage',
            link: 'cm.register.update.material.storage.location',
            title: 'Register/Update Controlled Material Storage',
            tooltip: 'Register and update controlled material storage location details',
            authmodlevel: 'basic',
          },
          {
            name: '   - Manufacturer',
            link: 'cm.register.update.material.manufacturer',
            title: 'Register/Update Controlled Material Manufacturer',
            tooltip: 'Register and update controlled material manufacturer details',
            authmodlevel: 'basic',
          },
          {
            name: '   - Owner',
            tooltip: 'Register and update controlled material owner details',
            link: 'cm.update.material.owner',
            title: 'Register/Update Controlled Material Owner',
            authmodlevel: 'basic',
          },
          {
            name: '   - Material',
            link: 'cm.register.update.material',
            tooltip: 'Register and update controlled material details',
            title: 'Register/Update Controlled Material',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Surveillance',
        tooltip: 'Surveillance of controlled material resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Surveillance Sheet',
            link: 'cm.generate.material.surveillance.sheet',
            title: 'Controlled Material Surveillance Sheet',
            tooltip: 'Generate controlled material surveillance sheet',
            authmodlevel: 'basic',
          },
          {
            name: '   - Update Surveillance',
            link: 'cm.update.material.surveillance',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Reports',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - RadPro Schedule',
            link: 'cm.radiation.protection.schedule',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - Inventory',
            link: 'cm.inventory.list',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - View Material Locations',
            link: 'cm.view.material.locations',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - List of Materials',
            link: 'cm.view.controlled.materials.list',
            title: 'Materials List',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ],
      },
    ],
  },
  {
    root: true,
    name: 'Emergency Preparedness',
    link: 'emergency.preparedness.response',
    tooltip: 'Emergency preparedness and response actions',
    authmodlevel: 'basic',
    Icon: IconPeople,
    items: [
      {
        name: '○ Concept of Operations',
        tooltip: 'A basic concept of operations describing the response process. On the basis of the concept of operations, roles and responsibilities are assigned to each group, organization or individual involved in emergency preparedness and response.',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add Measurement',
            link: 'rp.add.dosimetry.measurement',
            title: 'Add Dosimetry Measurement Record',
            tooltip: 'Add dosimetry measurement for personnel, area, contamination, waste and other monitors',
            authmodlevel: 'basic',
          },
          {
            name: '   - Edit Measurement',
            link: 'rp.edit.dosimetry.measurement',
            title: '',
            tooltip: 'Edit dosimetry measurement for personnel, area, contamination, waste and other monitors already entered',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Reports',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Monitors List',
            link: 'rp.monitors.list',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Monitor Data',
            link: 'rp.monitor.data.statistics',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - Personnel Dose Evaluation',
            link: 'rp.personnel.dose.evaluation.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Personnel Dose Profile',
            link: 'rp.personnel.dose.profile.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
        ],
      },
      {
        name: '○ Documents',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add Dosimetry Reports',
            link: 'rp.documents.add.dosimetry.reports',
            title: 'Add Dosimetry Reports',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Monitor Data',
            link: 'rp.monitor.data.statistics',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - Personnel Dose Evaluation',
            link: 'rp.personnel.dose.evaluation.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Personnel Dose Profile',
            link: 'rp.personnel.dose.profile.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
        ],
      },
    ],
  },
  {
    root: true,
    name: 'Human Resource',
    link: 'human.resource',
    title: '',
    tooltip: 'Human resource actions',
    Icon: IconPeople,
    authmodlevel: 'basic',
    items: [
      {
        name: '○ Personnel',
        tooltip: 'Personnel action',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit Personnel',
            link: 'hr.add.edit.personnel',
            title: 'Add/Edit Personnel Records',
            tooltip: 'Add/Edit organisation staff details including external contractors that interact with the nuclear or radioactive materials and need to be monitored.',
            authmodlevel: 'basic',
          },
          {
            name: '   - Monitoring Status',
            link: 'hr.update.personnel.monitoring.status',
            title: 'Update Personnel Monitoring Status',
            tooltip: 'Update dosimeter types and surveillance frequency used to monitor organisation staff and external contractors',
            authmodlevel: 'basic',
          },
          {
            name: '   - Update Training',
            link: 'hr.update.person.training.record',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - View Records',
            link: 'hr.view.person.records',
            title: 'View Personnel Records',
            tooltip: 'View all personnel records',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Training',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit Training',
            link: 'hr.add.training',
            title: 'Add/Edit Training Programmes',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          }
        ],
      },
      {
        name: '○ Assessment',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - SPI',
            link: 'hr.spi',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - TPP',
            link: 'hr.tpp',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
        ],
      },
    ],
  },
  {
    root: true,
    name: 'Maintenance',
    link: 'maintenance',
    tooltip: 'Maintenance of Structures, Systems, & Components',
    Icon: EngineeringIcon,
    authmodlevel: 'basic',
    items: [
      {
        name: '○ SSC\'s',
        tooltip: 'Structures, systems and components.',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit SSC Record',
            link: 'ssc.add.edit.ssc',
            title: 'Add/Edit Structures, Systems, and Components',
            tooltip: 'Add/Edit structures systems and components.',
            authmodlevel: 'basic',
          },
          {
            name: '   - View SSC List',
            link: 'ssc.view.ssc.list',
            title: 'View SSC Records',
            tooltip: 'View structures systems and components records.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        name: '○ Aging Management',
        tooltip: 'Aging management programme (AMP) for Structures, systems and components.',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit AMP Record',
            link: 'ssc.add.edit.ssc.amp',
            title: 'Add/Edit SSC Aging Management Programme',
            tooltip: 'Add or Edit an Aging Management Programme (AMP) for an SSC',
            authmodlevel: 'basic',
          },
          {
            name: '   - View AMP List',
            link: 'ssc.amp.list',
            title: 'View Aging Management Programme SSC List',
            tooltip: 'View Aging Management Programme (AMP) SSC details',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        name: '○ Corr. Maintenance',
        tooltip: 'Corrective maintenance issue records.',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit Issue Record',
            link: 'ssc.add.edit.ssc.corrective.maintenance.issue.record',
            title: 'Add/Edit SSC Corrective Maintenance Issue Record',
            tooltip: 'Add or Edit an SSC corrective maintenance issue record.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        name: '○ Reports',
        tooltip: 'Reports.',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Maintenance Schedule',
            link: 'ssc.generate.maintenance.schedule',
            title: 'Generate Maintenance Schedule',
            tooltip: 'Generate a preventive maintenance schedule for structures, systems and components.',
            authmodlevel: 'basic',
          },
          {
            name: '   - Maintenance Report',
            link: 'ssc.generate.ssc.maintenance.report',
            title: 'Generate SSC Maintenance Report',
            tooltip: 'Generate a report on corrective or preventive maintenance carried out on structures, systems and components.',
            authmodlevel: 'basic',
          },
          {
            name: '   - AMP Schedule',
            link: 'ssc.generate.amp.schedule',
            title: 'Add/Edit Structures, Systems, and Components',
            tooltip: 'Add/Edit structures systems and components.',
            authmodlevel: 'basic',
          },
        ]
      },
    ],
  },
  {
    root: true,
    name: 'Organisation',
    link: 'organisation',
    tooltip: 'Details on the organisation',
    Icon: BusinessIcon,
    authmodlevel: 'basic',
    items: [
      {
        name: '- Update Details',
        link: 'org.edit.details',
        title: '',
        tooltip: 'Edit details on the organisation',
        authmodlevel: 'basic',
      },
      {
        name: '- Statutory Requirements',
        link: 'org.statutory.requirements',
        title: 'Add/Edit/Print Statutory Requirements',
        tooltip: 'Statutory requirement actions',
        authmodlevel: 'basic',
      },
      {
        name: '- Documents',
        link: 'org.maintain.organisation.documents',
        title: 'Maintain Organisation Documents',
        tooltip: 'Add/Update documents related to the organisation and its responsibilities. These will include operating licenses, statutory requirements, organisational chart etc.',
        authmodlevel: 'basic',
      },
    ],
  },
  {
    root: true,
    name: 'Radiation Protection',
    link: 'radiation.protection',
    tooltip: 'Radiation protection resource actions',
    authmodlevel: 'basic',
    Icon: IconPeople,
    items: [
      {
        name: '○ Monitors',
        tooltip: 'Radiation protection resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit Monitors',
            link: 'rp.add.edit.monitors',
            title: 'Add/Edit Monitor Records',
            tooltip: 'Add/Edit radiation monitor details including area, contamination, waste, and other types of monitors.',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Dosimetry',
        tooltip: 'Dosimetry resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Personnel Measurements',
            link: 'rp.add.edit.personnel.dosimetry.measurements',
            title: 'Add/Edit Personnel Dosimetry Measurement Record',
            tooltip: 'Add and edit dosimetry measurement for personnel monitors.',
            authmodlevel: 'basic',
          },
          {
            name: '   - Monitor Measurements',
            link: 'rp.add.edit.monitor.dosimetry.measurements',
            title: 'Add/Edit Monitor Dosimetry Measurement Record',
            tooltip: 'Add and edit dosimetry measurement for area, contamination, waste and other monitors.',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Reports',
        tooltip: 'Radiation protection resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Monitors List',
            link: 'rp.monitors.list',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Monitor Data',
            link: 'rp.monitor.data.statistics',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - Personnel Dose Report',
            link: 'rp.personnel.dosimetry.report',
            title: 'Personnel Dosimetry Report',
            tooltip: 'Evaluation of the personnel dosimetry measurements for a period.',
            authmodlevel: 'basic',
          },
          {
            name: '   - Personnel Dose Profile',
            link: 'rp.personnel.dosimetry.evaluation',
            title: 'Evaluate Personnel Dosimetry',
            tooltip: 'Evaluate personnel dosimetry measurements',
            authmodlevel: 'pro',
          },
        ],
      },
      {
        name: '○ Documents',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add Dosimetry Reports',
            link: 'rp.documents.add.dosimetry.reports',
            title: 'Add Dosimetry Reports',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Monitor Data',
            link: 'rp.monitor.data.statistics',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - Personnel Dose Evaluation',
            link: 'rp.personnel.dose.evaluation.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Personnel Dose Profile',
            link: 'rp.personnel.dose.profile.report',
            title: '',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
        ],
      },
    ],
  },
  {
    root: true,
    name: 'Reactor Operations',
    link: 'reactoroperations',
    tooltip: 'Reactor Operations',
    Icon: BusinessIcon,
    authmodlevel: 'basic',
    items: [
      {
        name: '○ Authorizations',
        tooltip: 'Authorizations for reactor utilization',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit Reactor Irrad.',
            link: 'ro.add.edit.reactor.sample.irradiation.records',
            title: 'Add/Edit Reactor Sample Irradiation (RSI) Authorization Records',
            tooltip: 'Add or edit the irradiation request/authorization record for samples to be irradiated in the reactor core.',
            authmodlevel: 'basic',
          },
          {
            name: '   - Print Auth. Records',
            link: 'ro.generate.reactor.sample.irradiation.authorization.pdf',
            title: 'Print Reactor Sample Irradiation Authorization Pdf',
            tooltip: 'Generate a pdf of the irradiation authorization records for samples to be irradiated in the reactor core.',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Operating Data',
        tooltip: 'Data on the reactor operating runs',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Discover Run Events',
            link: 'ro.add.edit.reactor.operating.run.records',
            title: 'Add/Edit Operating Run Records',
            tooltip: 'Update the reactor operation run records from the YOKOGAWA operating parameters data files (*.GTE)',
            authmodlevel: 'basic',
          },
          {
            name: '   - Add/Edit Irrad. Samples',
            link: 'ro.add.edit.irradiated.samples',
            title: 'Add/Edit Irradiated Sample Records',
            tooltip: 'Add and edit irradiated sample records',
            authmodlevel: 'basic',
          },
          {
            name: '   - Add/Edit Water Samples',
            link: 'ro.add.edit.reactor.water.samples',
            title: 'Add/Edit Reactor Water Records',
            tooltip: 'Add and edit reactor water chemistry records',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Reports',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Reactor Operations',
            link: 'ro.reactor.operations.report',
            title: 'Reactor Operations Report',
            tooltip: 'Report on reactor operations',
            authmodlevel: 'basic',
          }
        ],
      },
    ],
  },
  {
    root: true,
    name: 'Safety/Security Culture',
    link: 'safety.security.culture',
    tooltip: 'Safety and security culture actions',
    authmodlevel: 'basic',
    Icon: IconPeople,
    items: [
      {
        name: '○ Safety',
        tooltip: 'Safety resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add Monitor',
            link: 'rp.add.area.monitor',
            title: '',
            tooltip: 'Add area,contamination, waste, and other types of monitors',
            authmodlevel: 'basic',
          },
          {
            name: '   - Edit Monitor',
            link: 'rp.edit.area.monitor',
            title: '',
            tooltip: 'Edit area, contamination, waste and other types monitors',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '○ Security',
        tooltip: 'Security resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add Measurement',
            link: 'rp.add.dosimetry.measurement',
            title: 'Add Dosimetry Measurement Record',
            tooltip: 'Add dosimetry measurement for personnel, area, contamination, waste and other monitors',
            authmodlevel: 'basic',
          },
          {
            name: '   - Edit Measurement',
            link: 'rp.edit.dosimetry.measurement',
            title: '',
            tooltip: 'Edit dosimetry measurement for personnel, area, contamination, waste and other monitors already entered',
            authmodlevel: 'basic',
          },
        ],
      },
    ],
  },
  {
    root: true,
    name: 'System Admin',
    link: 'sysadmin',
    tooltip: 'System Administration',
    Icon: BusinessIcon,
    authmodlevel: 'sysadmin',
    items: [
      {
        name: '- Add Users',
        link: 'sysadmin.manage.users',
        title: 'Manage Users',
        tooltip: 'Manage system users',
        authmodlevel: 'sysadmin',
      }
    ],
  },
  {
    root: true,
    name: 'Support',
    link: 'support',
    tooltip: 'Support',
    Icon: BusinessIcon,
    authmodlevel: 'sysadmin',
    items: [
      {
        name: '- Terms and Definitions',
        link: 'support.terms.and.definitions',
        title: 'Terms and Definitions',
        tooltip: 'View terms and definitions',
        authmodlevel: 'basic',
      },
    ],
  },
]