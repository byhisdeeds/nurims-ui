import React, {Component} from 'react';
import {
  CMD_CLEANUP_UNREFERENCED_LARGE_OBJECT_STORE_FILES,
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

export const CLEANUPLARGEOBJECTSTORE_REF = "CleanupLargeObjectStore";

class CleanupLargeObjectStore extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      files: "",
      only_list_files: "true",
      processing: false,
    };
    this.Module = CLEANUPLARGEOBJECTSTORE_REF;
  }

  componentDidMount() {
    const user = this.props.user;
    if (!isValidUserRole(user, "sysadmin")) {
      enqueueWarningSnackbar(
        `You are logged in as ${user.profile.username} but do not have sysadmin privileges required.`);
    }
  }

  removeUnreferencedFiles = () => {
    this.props.send({
      cmd: CMD_CLEANUP_UNREFERENCED_LARGE_OBJECT_STORE_FILES,
      module: this.Module,
      "only.list.files": this.state.only_list_files,
    }, false);
    this.setState({ files: "", processing: true })
  }

  onlyListFiles = (e) => {
    this.setState({ only_list_files: ""+e.target.checked })
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_CLEANUP_UNREFERENCED_LARGE_OBJECT_STORE_FILES)) {
          if (response.hasOwnProperty("file") && response.file.toLowerCase() === "done") {
            const files = this.state.files + (this.state.files === "" ? "" : "\n") + "Completed processing."
            this.setState({files: files, processing: false})
          } else {
            const files = this.state.files +
              (this.state.files === "" ? "" : "\n") +
              (response.hasOwnProperty("file") ? response.file : "")
            this.setState({files: files})
          }
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  highlight_files = (code) => {
    return highlight(code, HIGHLIGHT_DEFN.files, "hl-editor token-filename");
  }

  render() {
    const { files, only_list_files, processing} = this.state;
    const {user, theme} = this.props;
    const isSysadmin = isValidUserRole(user, "sysadmin");
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "only_list_files", only_list_files,
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
                label={"Only list files, do not remove"}
                onChange={this.onlyListFiles}
                value={only_list_files}
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
                onClick={this.removeUnreferencedFiles}
              >
                Remove Unreferenced Files
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Editor
              className={"hl-editor"}
              readOnly={true}
              fullwidth={true}
              value={files}
              data-color-mode={theme.palette.mode}
              onValueChange={code => {
              }}
              highlight={this.highlight_files}
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

CleanupLargeObjectStore.defaultProps = {
};

export default withTheme(CleanupLargeObjectStore);