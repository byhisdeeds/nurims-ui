import {createTheme} from "@mui/material/styles";

export const lightTheme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#eeecec',
          '&$checked': {
            color: '#1976d2',
          },
          '&$checked + $track': {
            backgroundColor: '#1976d2',
          },
        },
        checked: {},
        track: {
          backgroundColor: '#8b8a8a',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root:{
          px: 1,
          py: 0.25,
          borderRadius: 1,
        },
        label: {
          padding: 'initial',
        },
        icon: {
          mr: 0.5,
          ml: '-2px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          backgroundColor: '#1976d2',
          color: '#dedede',
          '&:hover': {
            backgroundColor: '#1976d2',
            filter: 'brightness(85%)',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false, // No more ripple, on the whole application 💣!
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          padding: 0,
          fontSize: '1rem',
          fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
          backgroundColor: '#fff',
          color: '#000000',
          '&.Mui-selected': {
            backgroundColor: 'rgba(121,152,223,0.1)',
            color: '#ffffff',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
  },
  direction: "ltr",
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27c0',
      light: '#b868c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
      disabled: 'rgba(0,0,0,0.38)',
      icon: 'rgba(0,0,0,0.38)',
    },
    action: {
      active: 'rgba(0,0,0,0.54)',
      activeOpacity: 0.12,
      disabled: 'rgba(0,0,0,0.26)',
      disabledBackground: 'rgba(0,0,0,0.12)',
      disabledOpacity: 0.38,
      hover: 'rgba(0,0,0,0.14)',
      hoverOpacity: 0.14,
      focus: 'rgba(0,0,0,0.12)',
      focusOpacity: 0.12,
      selected: 'rgba(0,0,0,0.08)',
      selectedOpacity: 0.08
    },
    background: {
      default: '#fff',
      paper: '#fff'
    },
    common: {
      black: '#000',
      white: '#fff'
    },
    divider: "rgba(255, 255, 255, 0.12)",
    tonalOffset: 0.2,
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 300,
      fontSize: "6rem",
      lineHeight: 1,
      letterSpacing: "-0.01562em"
    },
    h2: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 300,
      fontSize: "3.75rem",
      lineHeight: 1,
      letterSpacing: "-0.00833em"
    },
    h3: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "3rem",
      lineHeight: 1.04,
      letterSpacing: "0em"
    },
    h4: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "2.125rem",
      lineHeight: 1.17,
      letterSpacing: "0.00735em"
    },
    h5: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.33,
      letterSpacing: "0em"
    },
    h6: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.6,
      letterSpacing: "0.0075em"
    },
    subtitle1: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.75,
      letterSpacing: "0.00938em"
    },
    subtitle2: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.57,
      letterSpacing: "0.00714em"
    },
    body1: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em"
    },
    body2: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em"
    },
    button: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "uppercase"
    },
    caption: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.66,
      letterSpacing: "0.03333em"
    },
    overline: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase"
    }
  },
  shape: {
    borderRadius: 4,
  },
});

export const darkTheme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#eeecec',
          '&$checked': {
            color: '#1976d2',
          },
          '&$checked + $track': {
            backgroundColor: '#1976d2',
          },
        },
        checked: {},
        track: {
          backgroundColor: '#d7d7d7',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root:{
          px: 1,
          py: 0.25,
          borderRadius: 1,
        },
        label: {
          padding: 'initial',
        },
        icon: {
          mr: 0.5,
          ml: '-2px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          backgroundColor: '#1976d2',
          color: '#dedede',
          '&:hover': {
            backgroundColor: '#1976d2',
            filter: 'brightness(85%)',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false, // No more ripple, on the whole application 💣!
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          padding: 0,
          fontSize: '1rem',
          fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
          backgroundColor: '#383838',
          color: '#ffffff',
          '&.Mui-selected': {
            backgroundColor: 'rgb(138,138,138)',
            color: '#ffffff',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: 0,
        },
        head: {
          padding: 0,
          backgroundColor: '#212121',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))',
          backgroundColor: 'rgb(40, 44, 52)',
          color: '#eeeeee',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(40, 44, 52)',
          color: '#eeeeee',
        },
      },
    },
  },
  direction: "ltr",
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#dcf0fd',
      dark: '#42a5f5',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255,255,255,0.7)',
      disabled: 'rgba(255,255,255,0.5)',
      icon: 'rgba(255,255,255,0.5)',
    },
    action: {
      active: '#fff',
      activeOpacity: 0.24,
      disabled: 'rgba(255,255,255,0.3)',
      disabledBackground: 'rgba(255,255,255,.12)',
      disabledOpacity: 0.38,
      hover: 'rgba(255,255,255,0.08)',
      hoverOpacity: 0.08,
      focus: 'rgba(255,255,255,0.12)',
      focusOpacity: 0.12,
      selected: 'rgba(255,255,255,0.16)',
      selectedOpacity: 0.16
    },
    background: {
      default: '#121212',
      paper: '#121212'
    },
    common: {
      black: '#000',
      white: '#fff'
    },
    divider: "rgba(255, 255, 255, 0.12)",
    tonalOffset: 0.2,
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 300,
      fontSize: "6rem",
      lineHeight: 1,
      letterSpacing: "-0.01562em"
    },
    h2: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 300,
      fontSize: "3.75rem",
      lineHeight: 1,
      letterSpacing: "-0.00833em"
    },
    h3: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "3rem",
      lineHeight: 1.04,
      letterSpacing: "0em"
    },
    h4: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "2.125rem",
      lineHeight: 1.17,
      letterSpacing: "0.00735em"
    },
    h5: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.33,
      letterSpacing: "0em"
    },
    h6: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.6,
      letterSpacing: "0.0075em"
    },
    subtitle1: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.75,
      letterSpacing: "0.00938em"
    },
    subtitle2: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.57,
      letterSpacing: "0.00714em"
    },
    body1: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em"
    },
    body2: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em"
    },
    button: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "uppercase"
    },
    caption: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.66,
      letterSpacing: "0.03333em"
    },
    overline: {
      fontFamily: 'Segoeui, Cabin, RobotoSlabRegular',
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase"
    }
  },
});
