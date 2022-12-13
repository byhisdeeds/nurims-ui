import React, {Component} from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  getRecordMetadataValue,
  setMetadataValue,
  getDateFromDateString, BlobObject
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";
import Avatar from "@mui/material/Avatar";
import ImageIcon from '@mui/icons-material/Image';
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import {HtmlTooltip, TooltipText} from "../../utils/TooltipUtils";
import EditableTable from "../../components/EditableTable";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import {
  BLANK_PDF,
  NURIMS_MATERIAL_CLASSIFICATION,
  NURIMS_MATERIAL_DOCUMENTS,
  NURIMS_MATERIAL_ID,
  NURIMS_MATERIAL_IMAGE,
  NURIMS_MATERIAL_INVENTORY_STATUS,
  NURIMS_MATERIAL_PHYSICAL_FORM,
  NURIMS_SURVEILLANCE_FREQUENCY,
  NURIMS_MATERIAL_TYPE,
  NURIMS_TITLE,
  NURIMS_DESCRIPTION,
  NURIMS_MATERIAL_REGISTRATION_DATE,
  NURIMS_MATERIAL_STORAGE_LOCATION_RECORD,
  NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY,
  NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY,
  NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY,
  NURIMS_MATERIAL_NUCLIDES,
  NURIMS_MATERIAL_QUANTITY_UNITS,
  BLANK_IMAGE_OBJECT,
  ITEM_ID,
  NURIMS_MATERIAL_MANUFACTURER_RECORD
} from "../../utils/constants";
import {
  SelectFormControlWithTooltip,
  TextFieldWithTooltip,
  DatePickerWithTooltip
} from "../../components/CommonComponents";

class MaterialMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      material: {},
      properties: props.properties,
    };
    this.ref = React.createRef();
    this.pdfRef = React.createRef();
    this.tooltipRef = React.createRef();
    this.glossary = {};
    this.manufacturers = [];
    this.storageLocations = [];
    this.nuclidesData = [];
    this.nuclideTableFields = [
      {
        label: "Nuclide",
        // selectMessage: "Nuclide",
        name: "nuclide",
        width: '20ch',
        align: 'center',
        type: "select",
        options: [],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Quantity",
        name: "quantity",
        width: '8ch',
        align: 'center',
        validation: e => {
          return true;
        },
        error: "Haha"
      },
      {
        label: "Units",
        // selectMessage: "Units",
        name: "units",
        type: "select",
        width: '8ch',
        align: 'center',
        options: [],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Reg. Date",
        // selectMessage: "Units",
        name: "date",
        type: "date",
        width: '18ch',
        align: 'center',
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      }
    ];
    getPropertyValue(props.properties, NURIMS_MATERIAL_NUCLIDES, "").split('|').map((n) => {
      const t = n.split(',');
      if (t.length === 2) {
        return this.nuclideTableFields[0].options.push({ label: t[1], value: t[0] });
      }
    })
    getPropertyValue(props.properties, NURIMS_MATERIAL_QUANTITY_UNITS, "").split('|').map((n) => {
      const t = n.split(',');
      if (t.length === 2) {
        return this.nuclideTableFields[2].options.push({ label: t[1], value: t[0] });
      }
    })
  }

  componentDidMount() {
    console.log("componentDidMount - MaterialMetadata.properties", this.state.properties)
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const material = this.state.material;
    if (e.target.id === "nurims.title") {
      material["changed"] = true;
      material[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "id") {
      material["changed"] = true;
      setMetadataValue(material, NURIMS_MATERIAL_ID, e.target.value)
    } else if (e.target.id === "type") {
      material["changed"] = true;
      setMetadataValue(material, NURIMS_MATERIAL_TYPE, e.target.value)
      const nuclideData = getRecordMetadataValue(material, NURIMS_MATERIAL_NUCLIDES, []);
      if (this.ref.current) {
        this.ref.current.setRowData(nuclideData);
      }
    } else if (e.target.id === "description") {
      material["changed"] = true;
      setMetadataValue(material, NURIMS_DESCRIPTION, e.target.value)
    }
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleMaterialTypeChange = (e) => {
    const material = this.state.material;
    setMetadataValue(material, NURIMS_MATERIAL_TYPE, e.target.value);
    material.changed = true;
    this.setState({material: material})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleMaterialClassificationChange = (e) => {
    console.log("handleMaterialClassificationChange", e.target.value);
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_MATERIAL_CLASSIFICATION, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleRegistrationDateChange = (date) => {
    console.log("handleRegistrationDateChange", date);
    const material = this.state.material;
    setMetadataValue(material, NURIMS_MATERIAL_REGISTRATION_DATE, date.toISOString().substring(0, 10))
    material["changed"] = true;
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleMaterialManufacturerChange = (e) => {
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_MATERIAL_MANUFACTURER_RECORD, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleInventoryStatusChange = (e) => {
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_MATERIAL_INVENTORY_STATUS, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handlePhysicalFormChange = (e) => {
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_MATERIAL_PHYSICAL_FORM, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleStorageLocationRecordChange = (e) => {
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_MATERIAL_STORAGE_LOCATION_RECORD, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleActivitySurveillanceFrequencyChange = (e) => {
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleLeakTestSurveillanceFrequencyChange = (e) => {
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleInventorySurveillanceFrequencyChange = (e) => {
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY, e.target.value);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setGlossaryTerms = (terms) => {
    console.log("MaterialMetadata.setGlossaryTerms", terms)
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
  }

  setManufacturers = (manufacturers) => {
    console.log("MaterialMetadata.setManufacturers", manufacturers)
    for (const manufacturer of manufacturers) {
      this.manufacturers.push({
        title: manufacturer[NURIMS_TITLE],
        id: manufacturer[ITEM_ID],
      });
    }
    this.forceUpdate();
  }

  setStorageLocations = (storageLocations) => {
    console.log("MaterialMetadata.setStorageLocations", storageLocations)
    for (const storage of storageLocations) {
      this.storageLocations.push({
        title: storage[NURIMS_TITLE],
        id: storage[ITEM_ID],
      });
    }
    this.forceUpdate();
  }

  setRecordMetadata = (material) => {
    console.log("MaterialMetadata.setMaterialMetadata", material)
    const nuclideData = getRecordMetadataValue(material, NURIMS_MATERIAL_NUCLIDES, []);
    if (this.ref.current) {
      this.ref.current.setRowData(nuclideData);
    }
    console.log("+++++++++++++++++++++++++")
    console.log(material)
    console.log("+++++++++++++++++++++++++")
    this.setState({material: material})
    this.props.onChange(false);
  }

  getRecordMetadata = () => {
    return this.state.manufacturer;
  }

  addNuclide = (e) => {
    // find highest id
    let id = 0;
    for (const row of this.table_rows) {
      id = Math.max(id, row.id);
    }
    this.table_rows.push({
      id: id+1,
      nuclide: "",
      quantity: 0,
      units: "",
      dateCreated: new Date(),
    });
    this.forceUpdate();
  }

  deleteNuclide = () => {

  }

  saveTableData = data => {
    console.log("UPDATED NUCLIDE TABLE DATA", data);
    const material = this.state.material;
    material["changed"] = true;
    setMetadataValue(material, "nurims.material.nuclides", data);
    this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  };

  handleMaterialImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsDataURL(selectedFile);
    fileReader.onload = function (event) {
      const material = that.state.material;
      material["changed"] = true;
      // setMetadataValue(material, "nurims.material.image", event.target.result);
      setMetadataValue(material, NURIMS_MATERIAL_IMAGE, BlobObject(selectedFile.name, event.target.result));
      that.setState({ material: material })
      that.props.onChange(true);
    };
  }

  handleMaterialDocumentUpload = (e) => {
    const selectedFile = e.target.files[0];
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsDataURL(selectedFile);
    fileReader.onload = function (event) {
      const material = that.state.material;
      material["changed"] = true;
      setMetadataValue(material, NURIMS_MATERIAL_DOCUMENTS, BlobObject(selectedFile.name, event.target.result));
      that.setState({ material: material })
      that.props.onChange(true);
    };
  }

  render() {
    const {material, properties} = this.state;
    // console.log("MaterialMetadata.RENDER - material", material)
    // console.log("MaterialMetadata.RENDER - table_rows", this.table_rows)
    // console.log("MaterialMetadata.RENDER - glossary", this.glossary)
    const disabled = Object.entries(material).length === 0;
    const materialTypes = getPropertyValue(properties, NURIMS_MATERIAL_TYPE, "").split('|');
    const materialClassification = getPropertyValue(properties, NURIMS_MATERIAL_CLASSIFICATION, "").split('|');
    const inventoryStatus = getPropertyValue(properties, NURIMS_MATERIAL_INVENTORY_STATUS, "").split('|');
    const physicalForm = getPropertyValue(properties, NURIMS_MATERIAL_PHYSICAL_FORM, "").split('|');
    const surveillanceFrequency = getPropertyValue(properties, NURIMS_SURVEILLANCE_FREQUENCY, "").split('|');
    const image = getRecordMetadataValue(material, NURIMS_MATERIAL_IMAGE, BLANK_IMAGE_OBJECT);
    const documentPdf = getRecordMetadataValue(material, NURIMS_MATERIAL_DOCUMENTS, BLANK_IMAGE_OBJECT);
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {ml: 0, mb: 0},
        }}
        noValidate
        autoComplete="off"
      >
        <div className="tooltip-root" ref={this.tooltipRef}>
          <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
            <CardContent sx={{'& .MuiCardContent-root:last-child': {p: 0}}}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextFieldWithTooltip
                    id={"nurims.title"}
                    label="Material Name"
                    required={true}
                    value={material.hasOwnProperty(NURIMS_TITLE) ? material[NURIMS_TITLE] : ""}
                    onChange={this.handleChange}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_TITLE, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'bottom-start'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_TITLE, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <TextField*/}
                  {/*    disabled={disabled}*/}
                  {/*    required*/}
                  {/*    fullWidth*/}
                  {/*    id="nurims.title"*/}
                  {/*    label="Material Name"*/}
                  {/*    value={material.hasOwnProperty(NURIMS_TITLE) ? material[NURIMS_TITLE] : ""}*/}
                  {/*    onChange={this.handleChange}*/}
                  {/*  />*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
                <Grid item xs={4}>
                  <TextFieldWithTooltip
                    id={"id"}
                    label="Material ID"
                    required={true}
                    value={getRecordMetadataValue(material, NURIMS_MATERIAL_ID, "")}
                    onChange={this.handleChange}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_ID, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'bottom-start'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_ID, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <TextField*/}
                  {/*    disabled={disabled}*/}
                  {/*    required*/}
                  {/*    fullWidth*/}
                  {/*    id="id"*/}
                  {/*    label="Material ID"*/}
                  {/*    value={getMetadataValue(material, NURIMS_MATERIAL_ID, "")}*/}
                  {/*    onChange={this.handleChange}*/}
                  {/*  />*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"type"}
                    label="Material Type"
                    required={true}
                    value={getRecordMetadataValue(material, NURIMS_MATERIAL_TYPE, "")}
                    onChange={this.handleMaterialTypeChange}
                    options={materialTypes}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_TYPE, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_TYPE, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 0, width: '100%'}}>*/}
                  {/*    <InputLabel id="type">Material Type</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="type"*/}
                  {/*      label="Material Type"*/}
                  {/*      id="type"*/}
                  {/*      value={getMetadataValue(material, NURIMS_MATERIAL_TYPE, "")}*/}
                  {/*      onChange={this.handleMaterialTypeChange}*/}
                  {/*    >*/}
                  {/*      {materialTypes.map((materialType) => {*/}
                  {/*        const t = materialType.split(',');*/}
                  {/*        if (t.length === 2) {*/}
                  {/*          return (*/}
                  {/*            <MenuItem value={t[0]}>{t[1]}</MenuItem>*/}
                  {/*          )*/}
                  {/*        }*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, width: '100%'}}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextFieldWithTooltip
                    id={"description"}
                    label="Material Description"
                    value={getRecordMetadataValue(material, NURIMS_DESCRIPTION, "")}
                    onChange={this.handleChange}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <TextField*/}
                  {/*    disabled={disabled}*/}
                  {/*    fullWidth*/}
                  {/*    id="description"*/}
                  {/*    label={<div>"Material Description"</div>}*/}
                  {/*    value={getMetadataValue(material, NURIMS_DESCRIPTION, "")}*/}
                  {/*    onChange={this.handleChange}*/}
                  {/*  />*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"classification"}
                    label="Material Classification"
                    value={getRecordMetadataValue(material, NURIMS_MATERIAL_CLASSIFICATION, "")}
                    onChange={this.handleMaterialClassificationChange}
                    options={materialClassification}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_CLASSIFICATION, "")}
                    // target={this.tooltipRef}
                  />
                </Grid>
                {/*<Grid item xs={4}>*/}
                {/*  <HtmlTooltip*/}
                {/*    placement={'left'}*/}
                {/*    title={*/}
                {/*      <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_CLASSIFICATION, "")} />*/}
                {/*    }*/}
                {/*  >*/}
                {/*    <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                {/*      <InputLabel id="classification">Material Classification</InputLabel>*/}
                {/*      <Select*/}
                {/*        disabled={disabled}*/}
                {/*        required*/}
                {/*        fullWidth*/}
                {/*        labelId="classification"*/}
                {/*        label="Material Classification"*/}
                {/*        id="classification"*/}
                {/*        value={getMetadataValue(material, NURIMS_MATERIAL_CLASSIFICATION, "")}*/}
                {/*        onChange={this.handleMaterialClassificationChange}*/}
                {/*      >*/}
                {/*        {materialClassification.map((classification) => {*/}
                {/*          const t = classification.split(',');*/}
                {/*          if (t.length === 2) {*/}
                {/*            return (*/}
                {/*              <MenuItem value={t[0]}>{t[1]}</MenuItem>*/}
                {/*            )*/}
                {/*          }*/}
                {/*        })}*/}
                {/*      </Select>*/}
                {/*    </FormControl>*/}
                {/*  </HtmlTooltip>*/}
                {/*</Grid>*/}
                <Grid item xs={4}>
                  <DatePickerWithTooltip
                    label="Registration Date"
                    value={getDateFromDateString(getRecordMetadataValue(material, NURIMS_MATERIAL_REGISTRATION_DATE, "1970-01-01"), null)}
                    onChange={this.handleRegistrationDateChange}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_REGISTRATION_DATE, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
                  {/*  <HtmlTooltip*/}
                  {/*    placement={'left'}*/}
                  {/*    title={*/}
                  {/*      <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_REGISTRATION_DATE, "")} />*/}
                  {/*    }*/}
                  {/*  >*/}
                  {/*    <Box sx={{'& .MuiTextField-root': {width: '18ch'}}}>*/}
                  {/*      <DatePicker*/}
                  {/*        disabled={disabled}*/}
                  {/*        label="Registration Date"*/}
                  {/*        inputFormat={"yyyy-MM-dd"}*/}
                  {/*        value={getDateFromDateString(getMetadataValue(material, NURIMS_MATERIAL_REGISTRATION_DATE, "1970-01-01"), null)}*/}
                  {/*        onChange={this.handleRegistrationDateChange}*/}
                  {/*        renderInput={(params) => <TextField {...params} />}*/}
                  {/*      />*/}
                  {/*    </Box>*/}
                  {/*  </HtmlTooltip>*/}
                  {/*</LocalizationProvider>*/}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"manufacturer"}
                    label="Manufacturer"
                    value={getRecordMetadataValue(material, NURIMS_MATERIAL_MANUFACTURER_RECORD, "")}
                    onChange={this.handleMaterialManufacturerChange}
                    options={this.manufacturers}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_MANUFACTURER_RECORD, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_MANUFACTURER, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                  {/*    <InputLabel id="manufacturer">Manufacturer</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="manufacturer"*/}
                  {/*      label="Manufacturer"*/}
                  {/*      id="manufacturer"*/}
                  {/*      value={getMetadataValue(material, NURIMS_MATERIAL_MANUFACTURER, "")}*/}
                  {/*      onChange={this.handleMaterialManufacturerChange}*/}
                  {/*    >*/}
                  {/*      {this.manufacturers.map((m) => {*/}
                  {/*        return (*/}
                  {/*          <MenuItem value={m["id"]}>{m["title"]}</MenuItem>*/}
                  {/*        )*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"inventorystatus"}
                    label="Inventory Status"
                    value={getRecordMetadataValue(material, NURIMS_MATERIAL_INVENTORY_STATUS, "")}
                    onChange={this.handleInventoryStatusChange}
                    options={inventoryStatus}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_INVENTORY_STATUS, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_INVENTORY_STATUS, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                  {/*    <InputLabel id="inventorystatus">Inventory Status</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="inventorystatus"*/}
                  {/*      label="Inventory Status"*/}
                  {/*      id="inventorystatus"*/}
                  {/*      value={getMetadataValue(material, NURIMS_MATERIAL_INVENTORY_STATUS, "")}*/}
                  {/*      onChange={this.handleInventoryStatusChange}*/}
                  {/*    >*/}
                  {/*      {inventoryStatus.map((status) => {*/}
                  {/*        const t = status.split(',');*/}
                  {/*        if (t.length === 2) {*/}
                  {/*          return (*/}
                  {/*            <MenuItem value={t[0]}>{t[1]}</MenuItem>*/}
                  {/*          )*/}
                  {/*        }*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"physicalform"}
                    label="Physical Form"
                    value={getRecordMetadataValue(material, NURIMS_MATERIAL_PHYSICAL_FORM, "")}
                    onChange={this.handlePhysicalFormChange}
                    options={physicalForm}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_PHYSICAL_FORM, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_PHYSICAL_FORM, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                  {/*    <InputLabel id="physicalform">Physical Form</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="physicalform"*/}
                  {/*      label="Physical Form"*/}
                  {/*      id="physicalform"*/}
                  {/*      value={getMetadataValue(material, NURIMS_MATERIAL_PHYSICAL_FORM, "")}*/}
                  {/*      onChange={this.handlePhysicalFormChange}*/}
                  {/*    >*/}
                  {/*      {physicalForm.map((form) => {*/}
                  {/*        const t = form.split(',');*/}
                  {/*        if (t.length === 2) {*/}
                  {/*          return (*/}
                  {/*            <MenuItem value={t[0]}>{t[1]}</MenuItem>*/}
                  {/*          )*/}
                  {/*        }*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"storage"}
                    label="Storage Location"
                    value={getRecordMetadataValue(material, NURIMS_MATERIAL_STORAGE_LOCATION_RECORD, "")}
                    onChange={this.handleStorageLocationRecordChange}
                    options={this.storageLocations}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_STORAGE_LOCATION_RECORD, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_STORAGE_LOCATION_RECORD, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                  {/*    <InputLabel id="manufacturer">Storage Location</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="storage"*/}
                  {/*      label="Storage Location"*/}
                  {/*      id="storage"*/}
                  {/*      value={getMetadataValue(material, NURIMS_MATERIAL_STORAGE_LOCATION_RECORD, "")}*/}
                  {/*      onChange={this.handleStorageLocationRecordChange}*/}
                  {/*    >*/}
                  {/*      {this.storageLocations.map((l) => {*/}
                  {/*        return (*/}
                  {/*          <MenuItem value={l["id"]}>{l["title"]}</MenuItem>*/}
                  {/*        )*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {getRecordMetadataValue(material, NURIMS_MATERIAL_TYPE, "") !== "controlled_item" &&
          <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <EditableTable
                    disable={disabled}
                    ref={this.ref}
                    addRowBtnText={"Add Nuclide"}
                    initWithoutHead={false}
                    defaultData={this.nuclidesData}
                    getData={this.saveTableData}
                    fieldsArr={this.nuclideTableFields}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          }
          <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, width: '100%'}}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"leaktest"}
                    label="Leak Testing Surveillance Frequency"
                    value={getRecordMetadataValue(material, NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY, "")}
                    onChange={this.handleLeakTestSurveillanceFrequencyChange}
                    options={surveillanceFrequency}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                  {/*    <InputLabel id="leaktest">Leak Testing Surveillance Frequency</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="leaktest"*/}
                  {/*      label="Leak Testing Surveillance Frequency"*/}
                  {/*      id="leaktest"*/}
                  {/*      value={getMetadataValue(material, NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY, "")}*/}
                  {/*      onChange={this.handleLeakTestSurveillanceFrequencyChange}*/}
                  {/*    >*/}
                  {/*      {surveillanceFrequency.map((form) => {*/}
                  {/*        const t = form.split(',');*/}
                  {/*        if (t.length === 2) {*/}
                  {/*          return (*/}
                  {/*            <MenuItem value={t[0]}>{t[1]}</MenuItem>*/}
                  {/*          )*/}
                  {/*        }*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"inventory"}
                    label="Inventory Surveillance Frequency"
                    value={getRecordMetadataValue(material, NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY, "")}
                    onChange={this.handleInventorySurveillanceFrequencyChange}
                    options={surveillanceFrequency}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                  {/*    <InputLabel id="inventory">Inventory Surveillance Frequency</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="inventory"*/}
                  {/*      label="Inventory Surveillance Frequency"*/}
                  {/*      id="inventory"*/}
                  {/*      value={getMetadataValue(material, NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY, "")}*/}
                  {/*      onChange={this.handleInventorySurveillanceFrequencyChange}*/}
                  {/*    >*/}
                  {/*      {surveillanceFrequency.map((form) => {*/}
                  {/*        const t = form.split(',');*/}
                  {/*        if (t.length === 2) {*/}
                  {/*          return (*/}
                  {/*            <MenuItem value={t[0]}>{t[1]}</MenuItem>*/}
                  {/*          )*/}
                  {/*        }*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
                <Grid item xs={4}>
                  <SelectFormControlWithTooltip
                    id={"activity"}
                    label="Activity Surveillance Frequency"
                    value={getRecordMetadataValue(material, NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY, "")}
                    onChange={this.handleActivitySurveillanceFrequencyChange}
                    options={surveillanceFrequency}
                    disabled={disabled}
                    tooltip={getGlossaryValue(this.glossary, NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY, "")}
                    // target={this.tooltipRef}
                  />
                  {/*<HtmlTooltip*/}
                  {/*  placement={'left'}*/}
                  {/*  title={*/}
                  {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY, "")} />*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  <FormControl sx={{ml: 0, mb: 1, width: '100%'}}>*/}
                  {/*    <InputLabel id="activity">Activity Surveillance Frequency</InputLabel>*/}
                  {/*    <Select*/}
                  {/*      disabled={disabled}*/}
                  {/*      required*/}
                  {/*      fullWidth*/}
                  {/*      labelId="activity"*/}
                  {/*      label="Activity Surveillance Frequency"*/}
                  {/*      id="activity"*/}
                  {/*      value={getMetadataValue(material, NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY, "")}*/}
                  {/*      onChange={this.handleActivitySurveillanceFrequencyChange}*/}
                  {/*    >*/}
                  {/*      {surveillanceFrequency.map((form) => {*/}
                  {/*        const t = form.split(',');*/}
                  {/*        if (t.length === 2) {*/}
                  {/*          return (*/}
                  {/*            <MenuItem value={t[0]}>{t[1]}</MenuItem>*/}
                  {/*          )*/}
                  {/*        }*/}
                  {/*      })}*/}
                  {/*    </Select>*/}
                  {/*  </FormControl>*/}
                  {/*</HtmlTooltip>*/}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, width: '100%'}}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <input
                    disabled={disabled}
                    accept="image/png, image/jpeg, image/svg+xml"
                    id="load-material-image"
                    style={{display: 'none',}}
                    onChange={this.handleMaterialImageUpload}
                    type="file"
                  />
                  <HtmlTooltip
                    placement={'left'}
                    title={
                      <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_IMAGE, "")} />
                    }
                  >
                    <label htmlFor="load-material-image">
                      <Avatar variant="rounded" sx={{ width: "100%", height: 300, border: "5px dashed grey" }} src={image.url}>
                        {image.url === "" && <ImageIcon/>}
                      </Avatar>
                    </label>
                  </HtmlTooltip>
                </Grid>
                <Grid item xs={8}>
                  <input
                    disabled={disabled}
                    accept="application/x-pdf"
                    id="load-material-doc"
                    style={{display: 'none',}}
                    onChange={this.handleMaterialDocumentUpload}
                    type="file"
                  />
                  <Box sx={{display: 'flex'}}>
                    <HtmlTooltip
                      placement={'left'}
                      title={
                        <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_MATERIAL_DOCUMENTS, "")} />
                      }
                    >
                      <label htmlFor="load-material-doc">
                        {<ImageIcon sx={{width: 32, height: 32}}/>}
                      </label>
                    </HtmlTooltip>
                    {/*<iframe width={"100%"} height={"400px"} src={documentPdf.hasOwnProperty("file") ? documentPdf.url : ""} />*/}
                    <PdfViewer height={"400px"} source={documentPdf.file === "" ? BLANK_PDF : documentPdf.url } />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Box>
    );
  }
}

MaterialMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default MaterialMetadata;