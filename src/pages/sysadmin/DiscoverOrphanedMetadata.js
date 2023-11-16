import React, {Component} from 'react';
import {
  CMD_DISCOVER_ORPHANED_METADATA,
} from "../../utils/constants";
import {
  Box,
  Grid,
  Stack,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import {
  withTheme
} from "@mui/styles";
import {
  SwitchComponent,
  TitleComponent
} from "../../components/CommonComponents";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  enqueueErrorSnackbar,
  enqueueWarningSnackbar
} from "../../utils/SnackbarVariants";
import {
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  isValidUserRole
} from "../../utils/UserUtils";
import {highlight, HIGHLIGHT_DEFN} from "../../utils/HighlightUtils";
import Editor from "react-simple-code-editor";

export const DISCOVERORPHANEDMETADATA_REF = "DiscoverOrphanedMetadata";

class DiscoverOrphanedMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      fields: "",
      delete_if_unreferenced: false,
      processing: false,
    };
    this.Module = DISCOVERORPHANEDMETADATA_REF;
  }

  componentDidMount() {
    const user = this.props.user;
    if (!isValidUserRole(user, "sysadmin")) {
      enqueueWarningSnackbar(
        `You are logged in as ${user.profile.username} but do not have sysadmin privileges required.`);
    }
  }

  discoverOrphanedMetadata = () => {
    this.props.send({
      cmd: CMD_DISCOVER_ORPHANED_METADATA,
      "delete.if.unreferenced": this.state.delete_if_unreferenced,
      module: this.Module,
    }, false, false);
    this.setState({ fields: "", processing: true })
  }

  deleteMetadataIfUnreferenced = (e) => {
    this.setState({ delete_if_unreferenced: e.target.checked })
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_DISCOVER_ORPHANED_METADATA)) {
          if (response.hasOwnProperty("field") && response.field.toLowerCase() === "done") {
            const fields = this.state.fields + (this.state.fields === "" ? "" : "\n") + "Completed processing."
            this.setState({fields: fields, processing: false})
          } else {
            const fields = this.state.fields +
              (this.state.fields === "" ? "" : "\n") +
              (response.hasOwnProperty("field") ? response.field : "")
            this.setState({fields: fields})
          }
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  highlight_fields = (code) => {
    return highlight(code, HIGHLIGHT_DEFN.files, "hl-editor token-filename");
  }

  render() {
    const { fields, delete_if_unreferenced, processing} = this.state;
    const {user, theme} = this.props;
    const isSysadmin = isValidUserRole(user, "sysadmin");
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "delete_if_unreferenced", delete_if_unreferenced,
        "processing", processing, "isSysAdmin", isSysadmin);
    }
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <SwitchComponent
                id={"id"}
                label={"Delete metadata if unreferenced"}
                onChange={this.deleteMetadataIfUnreferenced}
                value={delete_if_unreferenced}
                disabled={processing || !isSysadmin}
              />
              <Box sx={{flexGrow: 1}} />
              <LoadingButton
                disabled={!isSysadmin}
                sx={{minWidth: 350}}
                loading={processing}
                loadingPosition="end"
                endIcon={<DeleteSweepIcon fontSize={"large"}/>}
                variant="outlined"
                onClick={this.discoverOrphanedMetadata}
              >
                Discover Orphaned Metadata
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Editor
              className={"hl-editor"}
              readOnly={true}
              fullwidth={true}
              value={fields}
              data-color-mode={theme.palette.mode}
              onValueChange={code => {
              }}
              highlight={this.highlight_fields}
              padding={10}
              style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.primary.light,
                fontSize: 12,
                fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                width: "100%",
                height: "calc(100vh - 245px)",
                overflowY: "auto",
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );

  }
}

DiscoverOrphanedMetadata.defaultProps = {
};

export default withTheme(DiscoverOrphanedMetadata);