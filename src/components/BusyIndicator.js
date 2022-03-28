import React from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";
import Backdrop from "@mui/material/Backdrop";
import {PulseLoader, RingLoader} from "react-spinners";
// https://www.davidhu.io/react-spinners/

function BusyIndicator({ loader = 'clock', size = 50, open = false }) {
  return (
    <Backdrop style={{zIndex:10000}} open={open}>
      { loader === 'pulse' &&
        <PulseLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'inherit',
          }}
          size={size}
          color={'#e3e3e3'}
          loading={open}
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
          loading={open}
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
          loading={open}
        />
      }
    </Backdrop>
  );
}

export default BusyIndicator;
