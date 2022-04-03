import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
  Switch
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {MapContainer, Marker, ImageOverlay} from 'react-leaflet';
import L from 'leaflet';
import defaultMarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MouseCoordinates from "../../components/MouseCoordinates";
import LocationFinder from "../../components/LocationFinder";
import "leaflet/dist/leaflet.css";
import {
  getMetadataValue,
  setMetadataValue,
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {
  NURIMS_MATERIAL_STORAGE_LOCATION,
  NURIMS_DESCRIPTION,
  NURIMS_TITLE,
  NURIMS_MATERIAL_STORAGE_LOCATION_MARKERS,
  NURIMS_MATERIAL_STORAGE_IMAGE,
  NURIMS_MATERIAL_STORAGE_MAP_IMAGE,
  NURIMS_ENTITY_AVATAR,
  BLANK_IMAGE_OBJECT,
  NURIMS_MATERIAL_TYPE,
  NURIMS_SSC_TYPE,
  NURIMS_SSC_CLASSIFICATION,
  NURIMS_MATERIAL_CLASSIFICATION,
  NURIMS_SSC_SAFETY_FUNCTION, NURIMS_SSC_SAFETY_CATEGORY, NURIMS_SSC_SURVEILLANCE_FREQUENCY,
} from "../../utils/constants";
import {HtmlTooltip, TooltipText} from "../../utils/TooltipUtils";
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import Avatar from "@mui/material/Avatar";
import ImageIcon from '@mui/icons-material/Image';
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {PhotoCamera} from "@mui/icons-material";


class SSCMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssc: {},
      properties: props.properties,
    };
    this.glossary = {};
  }

  componentDidMount() {
  }

  setGlossaryTerms = (terms) => {
    // console.log("SSCMetadata.setGlossaryTerms", terms)
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
    this.forceUpdate();
  }

  handleChange = (e) => {
    // console.log(">>>", e.target.id)
    const ssc = this.state.ssc;
    if (e.target.id === "name") {
      ssc["changed"] = true;
      ssc[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "description") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_DESCRIPTION, e.target.value)
    } else if (e.target.id === "easting") {
      ssc["changed"] = true;
      const coverageLocation = getMetadataValue(ssc, NURIMS_MATERIAL_STORAGE_LOCATION, {});
      coverageLocation["easting"] = parseFloat(e.target.value);
      setMetadataValue(ssc, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
    } else if (e.target.id === "northing") {
      ssc["changed"] = true;
      const coverageLocation = getMetadataValue(ssc, NURIMS_MATERIAL_STORAGE_LOCATION, {});
      coverageLocation["northing"] = parseFloat(e.target.value);
      setMetadataValue(ssc, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
    }
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  // handleCoverageLocationMarkerChange = (e) => {
  //   const storage = this.state.storage;
  //   storage["changed"] = true;
  //   const coverageLocation = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, {});
  //   coverageLocation["marker"] = e.target.value;
  //   // if easting not defined then define now
  //   if (!coverageLocation.hasOwnProperty("easting")) {
  //     coverageLocation["easting"] = 0;
  //   }
  //   // if northing not defined then define now
  //   if (!coverageLocation.hasOwnProperty("northing")) {
  //     coverageLocation["northing"] = 0;
  //   }
  //   setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
  //   this.setState({storage: storage})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  setSSCMetadata = (ssc) => {
    console.log("SSCMetadata.setSSCMetadata", ssc)
    // if (ssc.hasOwnProperty("metadata")) {
    //   const metadata = storage.metadata;
    // }
    this.setState({ssc: ssc})
    this.props.onChange(false);
  }

  // refresh = () => {
  //   this.forceUpdate();
  // }

  // onMapClick = (e) => {
  //   if (this.state.mapclick) {
  //     const storage = this.state.storage;
  //     storage["changed"] = true;
  //     const coverageLocation = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, {});
  //     coverageLocation["easting"] = parseFloat(e.lng);
  //     coverageLocation["northing"] = parseFloat(e.lat);
  //     setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
  //     this.setState({storage: storage})
  //     this.props.onChange(true);
  //   }
  // }

  getSSCMetadata = () => {
    return this.state.ssc;
  }

  // handleStorageImageUpload = (e) => {
  //   const selectedFile = e.target.files[0];
  //   // console.log("file uploaded", selectedFile)
  //   const that = this;
  //   const fileReader = new FileReader();
  //   fileReader.onerror = function () {
  //     toast.error(`Error occurred reading file: ${selectedFile.name}`)
  //   };
  //   fileReader.readAsDataURL(selectedFile);
  //   // fileReader.readAsText(selectedFile);
  //   fileReader.onload = function (event) {
  //     // console.log(">>>>>", event.target.result);
  //     const storage = that.state.storage;
  //     storage["changed"] = true;
  //     setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, {file: selectedFile.name, url: event.target.result});
  //     // setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, event.target.result);
  //     that.forceUpdate();
  //     // signal to parent that metadata has changed
  //     that.props.onChange(true);
  //   };
  // }

  // handleStorageMapImageUpload = (e) => {
  //   const selectedFile = e.target.files[0];
  //   // console.log("file uploaded", selectedFile)
  //   const that = this;
  //   const fileReader = new FileReader();
  //   fileReader.onerror = function () {
  //     toast.error(`Error occurred reading file: ${selectedFile.name}`)
  //   };
  //   fileReader.readAsDataURL(selectedFile);
  //   // fileReader.readAsText(selectedFile);
  //   fileReader.onload = function (event) {
  //     // console.log(">>>>>", event.target.result);
  //     const storage = that.state.storage;
  //     storage["changed"] = true;
  //     setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, {file: selectedFile.name, url: event.target.result});
  //     // setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, event.target.result);
  //     that.forceUpdate();
  //     // signal to parent that metadata has changed
  //     that.props.onChange(true);
  //   };
  // }

  // enableMapClick = (e) => {
  //   this.setState({ mapclick: e.target.checked });
  // }
  handleSSCTypeChange = (e) => {
    const ssc = this.state.ssc;
    setMetadataValue(ssc, NURIMS_SSC_TYPE, e.target.value);
    ssc.changed = true;
    this.setState({ssc: ssc})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleSSCClassificationChange = (e) => {
    console.log("handleSSCClassificationChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCSafetyFunctionChange = (e) => {
    console.log("handleSSCSafetyFunctionChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCSafetyCategoryChange = (e) => {
    console.log("handleSSCSafetyCategoryChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCSurveillanceFrequencyChange = (e) => {
    console.log("handleSSCSurveillanceFrequencyChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_SURVEILLANCE_FREQUENCY, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  render() {
    const {ssc, properties} = this.state;
    console.log("SSCMetadata.RENDER - ssc", ssc)
    const disabled = Object.entries(ssc).length === 0;
    // console.log("SSCMetadata.RENDER - properties", properties)
    const sscClassifications = getPropertyValue(properties, NURIMS_SSC_CLASSIFICATION, "").split('|');
    const sscSafetyFunctions = getPropertyValue(properties, NURIMS_SSC_SAFETY_FUNCTION, "").split('|');
    const sscSafetyCategories = getPropertyValue(properties, NURIMS_SSC_SAFETY_CATEGORY, "").split('|');
    const sscSurveillenceFrequecies = getPropertyValue(properties, NURIMS_SSC_SURVEILLANCE_FREQUENCY, "").split('|');
    // const storageImage = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, BLANK_IMAGE_OBJECT);
    // const storageMapImage = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, BLANK_IMAGE_OBJECT);
    // const storageLocationMarker = storageLocation.marker.split("#");
    // const storageMarkerIcon = L.icon({
    //   iconUrl: storageLocationMarker[0],
    //   iconSize: [storageLocationMarker[1], storageLocationMarker[1]],
    //   iconAnchor: [storageLocationMarker[2], storageLocationMarker[3]],
    // });

    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '100%'},
        }}
        noValidate
        autoComplete="off"
      >
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_TITLE, "")} />
                  }
                >
                  <TextField
                    required
                    id="name"
                    label="Name"
                    value={ssc.hasOwnProperty(NURIMS_TITLE) ? ssc[NURIMS_TITLE] : ""}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")} />
                  }
                >
                  <TextField
                    id="description"
                    label="SSC Description"
                    value={getMetadataValue(ssc, NURIMS_DESCRIPTION, "")}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_TYPE, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 0, width: '100%'}}>
                    <InputLabel id="type">SSC Type</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="type"
                      label="SSC Type"
                      id="type"
                      value={getMetadataValue(ssc, NURIMS_SSC_TYPE, "")}
                      onChange={this.handleSSCTypeChange}
                    >
                      <MenuItem value='structure'>Structure</MenuItem>
                      <MenuItem value='system'>System</MenuItem>
                      <MenuItem value='component'>Component</MenuItem>
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_CLASSIFICATION, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="classification">SSC Classification</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="classification"
                      label="SSC Classification"
                      id="classification"
                      value={getMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, [])}
                      onChange={this.handleSSCClassificationChange}
                    >
                      {sscClassifications.map((classification) => {
                        const t = classification.split(',');
                        if (t.length === 2) {
                          return (
                            <MenuItem value={t[0]}>{t[1]}</MenuItem>
                          )
                        }
                      })}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_SAFETY_CATEGORY, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="safety-category">SSC Safety Category</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="safety-category"
                      label="SSC Safety Category"
                      id="safety-category"
                      value={getMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, "")}
                      onChange={this.handleSSCSafetyCategoryChange}
                    >
                      {sscSafetyCategories.map((safetyCategory) => {
                        const t = safetyCategory.split(',');
                        if (t.length === 2) {
                          return (
                            <MenuItem value={t[0]}>{t[1]}</MenuItem>
                          )
                        }
                      })}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_SAFETY_FUNCTION, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="safety-function">SSC Safety Function</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="safety-function"
                      label="SSC Safety Function"
                      id="safety-function"
                      value={getMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, "")}
                      onChange={this.handleSSCSafetyFunctionChange}
                    >
                      {sscSafetyFunctions.map((safetyfunction) => {
                        const t = safetyfunction.split(',');
                        if (t.length === 2) {
                          return (
                            <MenuItem value={t[0]}>{t[1]}</MenuItem>
                          )
                        }
                      })}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_SURVEILLANCE_FREQUENCY, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="surveillance">SSC Surveillance Frequency</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="surveillance"
                      label="SSC Surveillance Frequency"
                      id="surveillance"
                      value={getMetadataValue(ssc, NURIMS_SSC_SURVEILLANCE_FREQUENCY, "")}
                      onChange={this.handleSSCSurveillanceFrequencyChange}
                    >
                      {sscSurveillenceFrequecies.map((frequency) => {
                        const t = frequency.split(',');
                        if (t.length === 2) {
                          return (
                            <MenuItem value={t[0]}>{t[1]}</MenuItem>
                          )
                        }
                      })}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

SSCMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default SSCMetadata;