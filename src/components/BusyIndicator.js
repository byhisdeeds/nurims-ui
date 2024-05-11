import React from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";
import Backdrop from "@mui/material/Backdrop";
import {BarLoader, PulseLoader, RingLoader} from "react-spinners";
// https://www.davidhu.io/react-spinners/
//
// function BusyIndicator({ loader = 'clock', size = 50, open = false }) {
//   return (
//     <Backdrop style={{zIndex:10000}} open={open}>
//       { loader === 'pulse' &&
//         <PulseLoader
//           css={{
//             display: 'block',
//             margin: '0 auto',
//             borderColor: 'inherit',
//           }}
//           size={size}
//           color={'#e3e3e3'}
//           loading={open}
//         />
//       }
//       { loader === 'clock' &&
//         <ClockLoader
//           css={{
//             display: 'block',
//             margin: '0 auto',
//             borderColor: 'inherit',
//           }}
//           size={size}
//           color={'#abff9e'}
//           loading={open}
//         />
//       }
//       { loader === 'ring' &&
//         <RingLoader
//           css={{
//             display: 'block',
//             margin: '0 auto',
//             borderColor: 'inherit',
//           }}
//           size={size}
//           color={'#2f2f27'}
//           loading={open}
//         />
//       }
//       { loader === 'bar' &&
//         <BarLoader
//           css={{
//             display: 'block',
//             margin: '0 auto',
//             borderColor: 'inherit',
//             top: 0,
//             position: 'absolute',
//           }}
//           width={'100%'}
//           size={size}
//           color={'#d1fad1'}
//           loading={open}
//         />
//       }
//     </Backdrop>
//   );
// }

function BusyIndicator({loader = 'bar', size = 50, open = false}) {
  return (
    <React.Fragment>
      {loader === 'pulse' && open &&
        <Backdrop style={{zIndex: 10000}} open={true}>
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
        </Backdrop>
      }
      {loader === 'ring' && open &&
        <Backdrop style={{zIndex: 10000}} open={true}>
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
        </Backdrop>
      }
      {loader === 'bar' && open &&
        <Backdrop style={{zIndex: 10000}} open={true}>
          <BarLoader
            css={{
              display: 'block',
              margin: '0 auto',
              borderColor: 'inherit',
            }}
            size={size}
            color={'#d1fad1'}
            loading={true}
          />
        </Backdrop>
      }
      {loader === 'clock' && open &&
        <Backdrop style={{zIndex: 10000}} open={true}>
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
        </Backdrop>
      }
    </React.Fragment>
  );
}

export default BusyIndicator;
