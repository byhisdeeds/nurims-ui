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
  NURIMS_MATERIAL_STORAGE_IMAGE, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, NURIMS_ENTITY_AVATAR, BLANK_IMAGE_OBJECT,
} from "../../utils/constants";
import {HtmlTooltip, TooltipText} from "../../utils/TooltipUtils";
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import Avatar from "@mui/material/Avatar";
import ImageIcon from '@mui/icons-material/Image';
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {PhotoCamera} from "@mui/icons-material";


class StorageMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storage: {},
      properties: props.properties,
      mapclick: false,
    };
    this.glossary = {};
  }

  componentDidMount() {
  }

  setGlossaryTerms = (terms) => {
    // console.log("StorageMetadata.setGlossaryTerms", terms)
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
      const coverageLocation = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, {});
      coverageLocation["easting"] = parseFloat(e.target.value);
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
    } else if (e.target.id === "northing") {
      storage["changed"] = true;
      const coverageLocation = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, {});
      coverageLocation["northing"] = parseFloat(e.target.value);
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
    }
    this.setState({storage: storage})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleCoverageLocationMarkerChange = (e) => {
    const storage = this.state.storage;
    storage["changed"] = true;
    const coverageLocation = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, {});
    coverageLocation["marker"] = e.target.value;
    // if easting not defined then define now
    if (!coverageLocation.hasOwnProperty("easting")) {
      coverageLocation["easting"] = 0;
    }
    // if northing not defined then define now
    if (!coverageLocation.hasOwnProperty("northing")) {
      coverageLocation["northing"] = 0;
    }
    setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
    this.setState({storage: storage})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setStorageMetadata = (storage) => {
    // console.log("StorageMetadata.setStorageMetadata", storage)
    // if (storage.hasOwnProperty("metadata")) {
    //   const metadata = storage.metadata;
    // }
    this.setState({storage: storage})
    this.props.onChange(false);
  }

  onMapClick = (e) => {
    if (this.state.mapclick) {
      const storage = this.state.storage;
      storage["changed"] = true;
      const coverageLocation = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, {});
      coverageLocation["easting"] = parseFloat(e.lng);
      coverageLocation["northing"] = parseFloat(e.lat);
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, coverageLocation);
      this.setState({storage: storage})
      this.props.onChange(true);
    }
  }

  getStorageMetadata = () => {
    return this.state.storage;
  }

  handleStorageImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    // console.log("file uploaded", selectedFile)
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsDataURL(selectedFile);
    // fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      // console.log(">>>>>", event.target.result);
      const storage = that.state.storage;
      storage["changed"] = true;
      setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, {file: selectedFile.name, url: event.target.result});
      // setMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, event.target.result);
      that.forceUpdate();
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
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
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

  enableMapClick = (e) => {
    this.setState({ mapclick: e.target.checked });
  }

  render() {
    const {storage, properties} = this.state;
    console.log("StorageMetadata.RENDER - storage", storage)
    // console.log("StorageMetadata.RENDER - properties", properties)
    const storageLocation = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_LOCATION, {easting: 0,
                                                                                                    northing: 0,
                                                                                                    marker: defaultMarkerIcon});
    const markers = getPropertyValue(properties, NURIMS_MATERIAL_STORAGE_LOCATION_MARKERS, "").split('|');
    const storageImage = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_IMAGE, BLANK_IMAGE_OBJECT);
    const storageMapImage = getMetadataValue(storage, NURIMS_MATERIAL_STORAGE_MAP_IMAGE, BLANK_IMAGE_OBJECT);
    const storageLocationMarker = storageLocation.marker.split("#");
    const storageMarkerIcon = L.icon({
      iconUrl: storageLocationMarker[0],
      iconSize: [storageLocationMarker[1], storageLocationMarker[1]],
      iconAnchor: [storageLocationMarker[2], storageLocationMarker[3]],
    });

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
                    value={getMetadataValue(storage, NURIMS_DESCRIPTION, "")}
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
                    value={storageLocation.hasOwnProperty("marker") ? storageLocation.marker : ""}
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
                  <Avatar variant={"square"} sx={{ width: 256, height: 256 }} src={storageImage.url}>
                    {storageImage.file === "" && <ImageIcon/>}
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
                  <MapContainer bounds={[[0, 0],[1, 1],]} center={[.5, .5]} scrollWheelZoom={false} style={{width:'100%', height: 400}}>
                    <ImageOverlay
                      url={storageMapImage.file === "" ? require("../../components/blank_map_image.png") : storageMapImage.url}
                      bounds={[[0, 0],[1, 1]]}
                    />
                    <div className="leaflet-bottom leaflet-left">
                      <MouseCoordinates />
                      <LocationFinder onClick={this.onMapClick}/>
                    </div>
                    {/*<MapConsumer>*/}
                    {/*  {(map) => {*/}
                    {/*    console.log('map center:', map.getCenter())*/}
                    {/*    return null*/}
                    {/*  }}*/}
                    {/*</MapConsumer>*/}
                    <Marker position={[storageLocation.northing, storageLocation.easting]} icon={storageMarkerIcon}/>
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

StorageMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default StorageMetadata;