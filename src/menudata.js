import IconPeople from "@mui/icons-material/People";
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import EngineeringIcon from '@mui/icons-material/Engineering';


export const MenuData = [
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
            name: '   - Add SSC Record',
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
    name: 'Controlled Materials',
    link: 'controlled.materials',
    tooltip: 'Human resource actions',
    authmodlevel: 'basic',
    Icon: LockIcon,
    items: [
      {
        name: '‣ Materials',
        tooltip: 'Human resource actions',
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
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
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
    name: 'Radiation Protection',
    link: 'radiation.protection',
    tooltip: 'Human resource actions',
    authmodlevel: 'basic',
    Icon: IconPeople,
    items: [
      {
        name: '‣ Monitors',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Add/Edit Monitor',
            link: 'rp.add.edit.monitor',
            title: 'Add/Edit Monitor Records',
            tooltip: 'Add/Edit monitor details including area, contamination, waste, and other types of monitors.',
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
        tooltip: 'Human resource actions',
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
        link: 'sysadmin.add.users',
        title: '',
        tooltip: 'Add system administration',
        authmodlevel: 'sysadmin',
      },
      {
        name: '- Import ICENS Personnel',
        link: 'sysadmin.import.icens.personnel',
        title: 'Import ICENS Personnel',
        tooltip: 'Batch import ICENS personnel',
        authmodlevel: 'sysadmin',
      },
    ],
  },
]