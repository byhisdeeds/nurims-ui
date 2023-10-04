import React, {Component} from 'react';
import {
  TextField,
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
  Switch,
  MenuItem,
  Avatar,
  IconButton
} from "@mui/material";
import {
  MapContainer,
  ImageOverlay,
} from 'react-leaflet';
import defaultMarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MouseCoordinates from "../../components/MouseCoordinates";
import LocationFinder from "../../components/LocationFinder";
import "leaflet/dist/leaflet.css";
import {
  BlobObject, getMarkerImageUrl,
  getRecordMetadataValue,
  markerBounds,
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
  BLANK_IMAGE_OBJECT,
} from "../../utils/constants";
import {HtmlTooltip, TooltipText} from "../../utils/TooltipUtils";
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import ImageIcon from '@mui/icons-material/Image';
import {PhotoCamera, NoPhotography} from "@mui/icons-material";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import PropTypes from "prop-types";
import {grey} from "@mui/material/colors";
import BLANK_MAP_IMAGE from "../../components/blank_map_image.png"

export const STORAGEMETADATA_REF = "StorageMetadata";

const DEFAULT_STORAGE_LOCATION = {easting: 0, northing: 0, marker: ""}

class StorageMetadata extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      storage: {},
      properties: props.properties,
      mapclick: false,
      marker_bounds: markerBounds(),
    };
    this.Module = STORAGEMETADATA_REF;
    this.glossary = {};
    this.mapRef = React.createRef();
    this.markerRef = React.createRef();
  }

  setGlossaryTerms = (terms) => {
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
    this.forceUpdate();
  }

  handleChange = (e) => {
    // console.log(">>>", e.target.id)
    const storage = this.state.storage;
    if (e.target.id === "name") {
      storage["changed"] = true;
      storage[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "description") {
      storage["changed"] = true;
      setMetadataValue(storage, NURIMS_DESCRIPTION, e.target.value)
    } else if (e.target.id === "easting") {
      storage["changed"] = true;
      const storageLocation = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, DEFAULT_STORAGE_LOCATION);
      storageLocation["easting"] = parseFloat(e.target.value);
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, storageLocation);
      if (this.markerRef.current) {
        this.markerRef.current.setBounds(markerBounds(storageLocation));
      }
    } else if (e.target.id === "northing") {
      storage["changed"] = true;
      const storageLocation = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, DEFAULT_STORAGE_LOCATION);
      storageLocation["northing"] = parseFloat(e.target.value);
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, storageLocation);
      if (this.markerRef.current) {
        this.markerRef.current.setBounds(markerBounds(storageLocation));
      }
    }
    this.setState({storage: storage})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleCoverageLocationMarkerChange = (e) => {
    const storage = this.state.storage;
    // images/markers/center-marker.png
    console.log("handleCoverageLocationMarkerChange", e.target.value)
    storage["changed"] = true;
    const storageLocation = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, DEFAULT_STORAGE_LOCATION);
    storageLocation["marker"] = e.target.value;
    setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, storageLocation);
    if (this.markerRef.current) {
      this.markerRef.current.setUrl(storageLocation.marker);
    }
    this.setState({storage: storage})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setRecordMetadata = (storage) => {
    if (this.markerRef.current) {
      const storageLocation = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, DEFAULT_STORAGE_LOCATION);
      this.markerRef.current.setBounds(markerBounds(storageLocation));
      this.markerRef.current.setUrl(storageLocation.marker);
    }
    this.setState({storage: storage})
    this.props.onChange(false);
  }

  onMapClick = (e) => {
    if (this.state.mapclick) {
      const storage = this.state.storage;
      storage["changed"] = true;
      const storageLocation = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, DEFAULT_STORAGE_LOCATION);
      storageLocation["easting"] = +parseFloat(e.lng).toPrecision(4) ;
      storageLocation["northing"] = +parseFloat(e.lat).toPrecision(4);
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, storageLocation);
      if (this.markerRef.current) {
        this.markerRef.current.setBounds(markerBounds(storageLocation));
      }
      this.setState({storage: storage})
      this.props.onChange(true);
    }
  }

  getStorageMetadata = () => {
    return this.state.storage;
  }

  handleStorageImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleStorageImageUpload", "selectedFile", selectedFile);
    }
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsDataURL(selectedFile);
    // fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      // console.log(">>>>>", event.target.result);
      const storage = that.state.storage;
      storage["changed"] = true;
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, BlobObject(selectedFile.name, event.target.result));
      // setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, event.target.result);
      that.setState({ storage: storage });
      // signal to parent that metadata has changed
      that.props.onChange(true);
    };
  }

  handleStorageMapImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    // console.log("file uploaded", selectedFile)
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsDataURL(selectedFile);
    // fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      // console.log(">>>>>", event.target.result);
      const storage = that.state.storage;
      storage["changed"] = true;
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, {file: selectedFile.name, url: event.target.result});
      // setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, event.target.result);
      that.forceUpdate();
      // signal to parent that metadata has changed
      that.props.onChange(true);
    };
  }

  handleStorageMapImageDeletion = (e) => {
    console.log("DELETION OF STORAGE MAP")
    const storage = this.state.storage;
    storage["changed"] = true;
    setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, BLANK_IMAGE_OBJECT);
    this.forceUpdate();
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  enableMapClick = (e) => {
    this.setState({ mapclick: e.target.checked });
  }

  render() {
    const {storage, properties, marker_bounds} = this.state;
    const storageLocation = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION,
      {easting: 0, northing: 0, marker: defaultMarkerIcon});
    const markers = getPropertyValue(properties, NURIMS_MATERIAL_STORAGE_LOCATION_MARKERS, "").split('|');
    const storageImage = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, BLANK_IMAGE_OBJECT);
    const storageMapImage = getRecordMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, BLANK_IMAGE_OBJECT);
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "storage", storage, "storageImage", storageImage,
        "storageLocation", storageLocation, "storageImage", storageImage, "storageMapImage", storageMapImage);
    }
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
                  placement={'bottom-start'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_TITLE, "")} />
                  }
                >
                  <TextField
                    required
                    id="name"
                    label="Name"
                    value={storage.hasOwnProperty(NURIMS_TITLE) ? storage[NURIMS_TITLE] : ""}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'bottom-start'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")} />
                  }
                >
                  <TextField
                    id="description"
                    label="Description"
                    value={getRecordMetadataValue(storage, NURIMS_DESCRIPTION, "")}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'bottom-start'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_STORAGE_LOCATION, "")} />
                  }
                >
                  <TextField
                    required
                    id="easting"
                    label="Easting/Longtitude"
                    value={storageLocation.hasOwnProperty("easting") ? storageLocation.easting : 0}
                    type="number"
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'bottom-start'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_STORAGE_LOCATION, "")} />
                  }
                >
                  <TextField
                    required
                    id="northing"
                    label="Northing/Latitude"
                    value={storageLocation.hasOwnProperty("northing") ? storageLocation.northing : 0}
                    type="number"
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl sx={{ml: 0, mb: 0, width: '100%'}}>
                  <InputLabel id="type">Marker</InputLabel>
                  <Select
                    required
                    id="marker"
                    label="Marker"
                    value={storageLocation.hasOwnProperty("marker") ? storageLocation.marker : "images/markers/center-marker.png#64#32#32"}
                    onChange={this.handleCoverageLocationMarkerChange}
                  >
                    {markers.map((mark) => {
                      const t = mark.split(',');
                      if (t.length === 2) {
                        return (
                          <MenuItem value={t[0]}>{t[1]}</MenuItem>
                        )
                      }
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="load-storage-image"
                  style={{display: 'none',}}
                  onChange={this.handleStorageImageUpload}
                  type="file"
                />
                <label htmlFor="load-storage-image">
                  <HtmlTooltip
                    placement={'top-start'}
                    title={
                      <TooltipText htmlText={"Click Icon to load storage location image."} />
                    }
                  >
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </HtmlTooltip>
                  <Avatar
                    variant={"square"}
                    sx={{ height: 256, width: "fit-content", bgcolor: grey[400] }}
                    src={storageImage.url}
                  >
                    {<ImageIcon sx={{width: 256, height: 256}}/>}
                  </Avatar>
                </label>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="load-storage-map-image"
                  style={{display: 'none',}}
                  onChange={this.handleStorageMapImageUpload}
                  type="file"
                />
                <Box display="flex">
                  <label htmlFor="load-storage-map-image">
                    <HtmlTooltip
                      placement={'top-start'}
                      title={
                        <TooltipText htmlText={"Click Icon to load storage location map."} />
                      }
                    >
                      <IconButton color="primary" aria-label="upload storage location map" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </HtmlTooltip>
                  </label>
                  <label htmlFor="delete-storage-map-image">
                    <HtmlTooltip
                      placement={'top-start'}
                      title={
                        <TooltipText htmlText={"Click Icon to delete storage location map."} />
                      }
                    >
                      <IconButton
                        color="primary"
                        aria-label="delete storage location map"
                        component="span"
                        onClick={this.handleStorageMapImageDeletion}
                      >
                        <NoPhotography />
                      </IconButton>
                    </HtmlTooltip>
                  </label>
                  <Box display="flex" justifyContent="flex-end" sx={{flexGrow: 1}}>
                    <FormControlLabel
                      value="start"
                      control={<Switch color="primary" onChange={this.enableMapClick}/>}
                      label="Use Map Click To Set Marker Location"
                      labelPlacement="start"
                    />
                  </Box>
                </Box>
                <Box sx={{width:'100%', height: 400}}>
                  <MapContainer
                    whenCreated={ mapInstance => { this.mapRef.current = mapInstance } }
                    bounds={[[0, 0],[1, 1]]}
                    center={[.5, .5]}
                    scrollWheelZoom={false}
                    style={{width:'100%', height: 400}}
                  >
                    <ImageOverlay
                      // url={storageMapImage.file === "" ? require("../../components/blank_map_image.png") : storageMapImage.url}
                      url={storageMapImage.file === "" ? BLANK_MAP_IMAGE : storageMapImage.url}
                      bounds={[[0, 0], [1, 1]]}
                    />
                    <div className="leaflet-bottom leaflet-left">
                      <MouseCoordinates />
                      <LocationFinder onClick={this.onMapClick}/>
                    </div>
                    <ImageOverlay
                      ref={this.markerRef}
                      bounds={marker_bounds}
                      url={getMarkerImageUrl(storageLocation, this.props.locationMarkerUrlPrefix)}
                      opacity={this.props.locationIconOpacity}
                    />
                  </MapContainer>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

StorageMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  locationMapInitialZoom: PropTypes.number,
  locationMapMaxZoom: PropTypes.number,
  locationIconOpacity: PropTypes.number,
  locationMarkerUrlPrefix: PropTypes.string,
}

StorageMetadata.defaultProps = {
  onChange: (msg) => {
  },
  locationMapInitialZoom: 9,
  locationMapMaxZoom: 18,
  locationIconOpacity: 0.7,
  locationMarkerUrlPrefix: "nurims/",
};

export default StorageMetadata;