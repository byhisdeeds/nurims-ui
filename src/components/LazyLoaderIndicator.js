import React from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";
import Backdrop from "@mui/material/Backdrop";
import {BarLoader, PulseLoader, RingLoader} from "react-spinners";
// https://www.davidhu.io/react-spinners/

function LazyLoaderIndicator({ loader = 'clock', size = 50 }) {
  return (
    <div>
      { loader === 'pulse' &&
        <PulseLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'inherit',
          }}
          size={size}
          color={'#e3e3e3'}
          loading={true}
        />
      }
      { loader === 'clock' &&
        <ClockLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'inherit',
          }}
          size={size}
          color={'#abff9e'}
          loading={true}
        />
      }
      { loader === 'ring' &&
        <RingLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'inherit',
          }}
          size={size}
          color={'#2f2f27'}
          loading={true}
        />
      }
      { loader === 'bar' &&
        <BarLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'inherit',
            top: 0,
            position: 'absolute',
          }}
          width={'100%'}
          size={size}
          color={'#d1fad1'}
          loading={true}
        />
      }
    </div>
  );
}

export default LazyLoaderIndicator;
