import IconPeople from "@mui/icons-material/People";
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import EngineeringIcon from '@mui/icons-material/Engineering';


export const MenuData = [
  {
    root: true,
    name: 'Controlled Materials',
    link: 'controlled.materials',
    tooltip: 'Controlled material resource actions',
    authmodlevel: 'basic',
    Icon: LockIcon,
    items: [
      {
        name: '‣ Materials',
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
            tooltip: 'Human resource actions',
            link: 'cm.update.material.owner',
            title: '',
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
        name: '‣ Surveillance',
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
        name: '‣ Reports',
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
        name: '‣ Monitors',
        tooltip: 'Human resource actions',
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
        name: '‣ Concept of Operations',
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
        name: '‣ Reports',
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
        name: '‣ Documents',
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
        name: '‣ Personnel',
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
        name: '‣ Training',
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
        name: '‣ Assessment',
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
        name: '‣ SSC\'s',
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
            name: '   - View SSC Records',
            link: 'ssc.view.ssc.records',
            title: 'View SSC Records',
            tooltip: 'View structures systems and components records.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        name: '‣ Aging Management',
        tooltip: 'Aging management programme (AMP) for Structures, systems and components.',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add SSC AMP Record',
            link: 'ssc.add.edit.ssc.amp',
            title: 'Add/Edit SSC Aging Management Programme',
            tooltip: 'Add or Edit an Aging Management Programme (AMP) for an SSC',
            authmodlevel: 'basic',
          },
          {
            name: '   - View AMP Records',
            link: 'ssc.view.amp.records',
            title: 'View AMP Records',
            tooltip: 'View SSC ageing management programme records.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        name: '‣ Maintenance',
        tooltip: 'Maintenance records.',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit Maint. Record',
            link: 'ssc.add.edit.ssc.maintenance.record',
            title: 'Add/Edit SSC Maintenance Record',
            tooltip: 'Add or Edit an SSC corrective maintenance record.',
            authmodlevel: 'basic',
          },
          {
            name: '   - View Maint. Record',
            link: 'ssc.view.ssc.maintenance.records',
            title: 'View SSC Maintenance Records',
            tooltip: 'View an SSC corrective maintenance records.',
            authmodlevel: 'basic',
          },
        ]
      },
      {
        name: '‣ Reports',
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
        name: '‣ Monitors',
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
        name: '‣ Dosimetry',
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
        name: '‣ Reports',
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
            name: '   - Personnel Dose Evaluation',
            link: 'rp.personnel.dosimetry.evaluation',
            title: 'Evaluate Personnel Dosimetry',
            tooltip: 'Evaluate personnel dosimetry measurements',
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
        name: '‣ Documents',
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
        name: '‣ Operating Data',
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
        name: '‣ Reports',
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
        name: '‣ Safety',
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
        name: '‣ Security',
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
      },
      {
        name: '- Import ICENS Personnel',
        link: 'sysadmin.import.icens.personnel',
        title: 'Import ICENS Personnel',
        tooltip: 'Batch import ICENS personnel',
        authmodlevel: 'sysadmin',
      },
      {
        name: '- Import Material Manuf.',
        link: 'sysadmin.import.icens.controlled.material.manufacturers',
        title: 'Import Controlled Material Manufacturers',
        tooltip: 'Batch import of controlled material manufacturers',
        authmodlevel: 'sysadmin',
      },
      {
        name: '- Import Material Store.',
        link: 'sysadmin.import.icens.controlled.material.storage.locations',
        title: 'Import Controlled Material Storage Locations',
        tooltip: 'Batch import of controlled material storage locations',
        authmodlevel: 'sysadmin',
      },
      {
        name: '- Import Materials.',
        link: 'sysadmin.import.icens.controlled.materials',
        title: 'Import Controlled Materials',
        tooltip: 'Batch import of controlled materials',
        authmodlevel: 'sysadmin',
      },
      {
        name: '- Import ICENS Monitors',
        link: 'sysadmin.import.icens.monitors',
        title: 'Import ICENS Environmental Monitors',
        tooltip: 'Batch import of environmental radiation monitors',
        authmodlevel: 'sysadmin',
      },
    ],
  },
]