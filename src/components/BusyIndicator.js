import React from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";
import Backdrop from "@mui/material/Backdrop";
// https://www.davidhu.io/react-spinners/

function BusyIndicator({ loader = 'clock', backdropLeft= 400, size = 50, open = false }) {
  return (
    <Backdrop style={{zIndex:1000, left:backdropLeft, color:'var(--backdropColor)'}} open={open}>
      { loader === 'pacman' &&
        <PacmanLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'red',
          }}
          size={size}
          color={'var(--busyIndicatorColor)'}
          loading={open}
        />
      }
      { loader === 'beat' &&
        <BeatLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'red',
          }}
          size={size}
          color={'var(--busyIndicatorColor)'}
          loading={open}
        />
      }
      { loader === 'clock' &&
        <ClockLoader
          css={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'red',
          }}
          size={size}
          color={'var(--busyIndicatorColor)'}
          loading={open}
        />
      }
    </Backdrop>
  );
}

export default BusyIndicator;
