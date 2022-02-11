import IconPeople from "@mui/icons-material/People";

export const MenuData = [
  {
    name: 'Human Resource',
    link: 'human.resource',
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
            name: '   - Add/Edit Person',
            link: 'hr.add.edit.person',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Assign Roles',
            link: 'hr.assign.person.roles',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Update Training',
            link: 'hr.update.person.training.record',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - View Record',
            link: 'hr.view.person.record',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ],
      },
      {
        name: '‣ Roles',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Update Role',
            link: 'hr.update.personnel.role',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - View Roles',
            link: 'hr.view.personnel.roles',
            tooltip: 'Human resource actions',
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
            name: '   - Update Training',
            link: 'hr.add.training',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - View Training',
            link: 'hr.view.training',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
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
    name: 'Controlled Materials',
    link: 'controlled.materials',
    tooltip: 'Human resource actions',
    authmodlevel: 'basic',
    Icon: IconPeople,
    items: [
      {
        name: '‣ Materials',
        tooltip: 'Human resource actions',
        authmodlevel: 'basic',
        items: [
          {
            name: '   - Update Storage',
            tooltip: 'Human resource actions',
            link: 'cm.update.storage.location',
            authmodlevel: 'basic',
          },
          {
            name: '   - Manufacturer',
            tooltip: 'Human resource actions',
            link: 'cm.update.material.manufacturer',
            authmodlevel: 'basic',
          },
          {
            name: '   - Material',
            tooltip: 'Human resource actions',
            link: 'cm.update.controlled.material',
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
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - Inventory',
            link: 'cm.inventory.list',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - View Material Locations',
            link: 'cm.view.material.locations',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Material Report',
            link: 'cm.controlled.materials.report',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
        ],
      },
    ],
  },
  {
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
            name: '   - Add Monitor',
            link: 'rp.add.area.monitor',
            tooltip: 'Add area,contamination, waste, and other types of monitors',
            authmodlevel: 'basic',
          },
          {
            name: '   - Edit Monitor',
            link: 'rp.edit.area.monitor',
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
            tooltip: 'Add dosimetry measurement for personnel, area, contamination, waste and other monitors',
            authmodlevel: 'basic',
          },
          {
            name: '   - Edit Measurement',
            link: 'rp.edit.dosimetry.measurement',
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
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Monitor Data',
            link: 'rp.monitor.data.statistics',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
          {
            name: '   - Personnel Dose Evaluation',
            link: 'rp.personnel.dose.evaluation.report',
            tooltip: 'Human resource actions',
            authmodlevel: 'basic',
          },
          {
            name: '   - Personnel Dose Profile',
            link: 'rp.personnel.dose.profile.report',
            tooltip: 'Human resource actions',
            authmodlevel: 'pro',
          },
        ],
      },
    ],
  },
]