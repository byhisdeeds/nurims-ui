import utils from '../utils.js';

const RATIO = 100;

const effectiveDoseRate = {
  si: {
    baseUnit: 'Sv',
    transform: (val) => { return val * RATIO },
    'Sv/hr': {
      name: {
        singular: 'Sievert per hour',
        plural: 'Sieverts per hour'
      },
      to_anchor: 1
    },
    'Sv/m': {
      name: {
        singular: 'Sievert per minute',
        plural: 'Sieverts per minute'
      },
      to_anchor: 1 / 60
    },
    'Sv/s': {
      name: {
        singular: 'Sievert per second',
        plural: 'Sieverts per second'
      },
      to_anchor: 1 / 3600
    },
    'mSv/hr': {
      name: {
        singular: 'MilliSievert per hour',
        plural: 'MilliSieverts per hour'
      },
      to_anchor: 1 / 1000
    },
    'mSv/m': {
      name: {
        singular: 'MilliSievert per minute',
        plural: 'MilliSieverts per minute'
      },
      to_anchor: 1 / 60000
    },
    'mSv/s': {
      name: {
        singular: 'MilliSievert per second',
        plural: 'MilliSieverts per second'
      },
      to_anchor: 1 / 3600000
    },
    'uSv/hr': {
      name: {
        singular: 'MicroSievert per hour',
        plural: 'MicroSieverts per hour'
      },
      to_anchor: 1 / 1000000
    },
    'uSv/m': {
      name: {
        singular: 'MicroSievert per minute',
        plural: 'MicroSieverts per minute'
      },
      to_anchor: 1 / 60000000
    },
    'uSv/s': {
      name: {
        singular: 'MicroSievert per second',
        plural: 'MicroSieverts per second'
      },
      to_anchor: 1 / 3600000000
    },
  },
  tradiational: {
    baseUnit: 'R',
    transform: (val) => { return val / RATIO },
    'R/hr': {
      name: {
        singular: 'Rem per hour',
        plural: 'Rems per hour'
      },
      to_anchor: 1
    },
    'R/m': {
      name: {
        singular: 'Rem per minute',
        plural: 'Rems per minute'
      },
      to_anchor: 1 / 60
    },
    'R/s': {
      name: {
        singular: 'Rem per second',
        plural: 'Rems per second'
      },
      to_anchor: 1 / 3600
    },
    'mR/hr': {
      name: {
        singular: 'MilliRem per hour',
        plural: 'MilliRems per hour'
      },
      to_anchor: 1 / 1000
    },
    'mR/m': {
      name: {
        singular: 'MilliRem per minute',
        plural: 'MilliRems per minute'
      },
      to_anchor: 1 / 60000
    },
    'mR/s': {
      name: {
        singular: 'MilliRem per second',
        plural: 'MilliRems per second'
      },
      to_anchor: 1 / 3600000
    },
    'uR/hr': {
      name: {
        singular: 'MicroRem per hour',
        plural: 'MicroRems per hour'
      },
      to_anchor: 1 / 1000000
    },
    'uR/m': {
      name: {
        singular: 'MicroRem per minute',
        plural: 'MicroRems per minute'
      },
      to_anchor: 1 / 60000000
    },
    'uR/s': {
      name: {
        singular: 'MicroRem per second',
        plural: 'MicroRems per second'
      },
      to_anchor: 1 / 3600000000
    },
  }
};

const effectiveDoseRate$1 = utils(effectiveDoseRate);

export default effectiveDoseRate$1;
