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
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import {
  enqueueErrorSnackbar,
  enqueueWarningSnackbar
} from "../../utils/SnackbarVariants";
import DeleteIcon from "@mui/icons-material/HighlightOff";
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  LogViewer,
  LogViewerSearch
} from "@patternfly/react-log-viewer";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {
  isValidUserRole
} from "../../utils/UserUtils";
// import {e} from "caniuse-lite/data/browserVersions";

export const CLEANUPLARGEOBJECTSTORE_REF = "CleanupLargeObjectStore";

class CleanupLargeObjectStore extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      files: "",
      scrollToRow: 0,
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
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_CLEANUP_UNREFERENCED_LARGE_OBJECT_STORE_FILES)) {
          if (response.hasOwnProperty("file") && response.file.toLowerCase() === "done") {
            const files = this.state.files + (this.state.files === "" ? "" : "\n") + "Completed processing."
            const scrollToRow = files.split("\n").length + 1;
            this.setState({ files: files, scrollToRow: scrollToRow, processing: false })
          } else {
            const files = this.state.files +
              (this.state.files === "" ? "" : "\n") +
              (response.hasOwnProperty("file") ? response.file : "")
            const scrollToRow = files.split("\n").length + 1;
            this.setState({ files: files, scrollToRow: scrollToRow })
          }
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  render() {
    const { files, only_list_files, processing, scrollToRow} = this.state;
    const {user} = this.props;
    const isSysadmin = isValidUserRole(user, "sysadmin");
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "only_list_files", only_list_files, "scrollToRow", scrollToRow,
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
                endIcon={<DeleteSweepIcon fontSize={"large"} />}
                variant="outlined"
                onClick={this.removeUnreferencedFiles}
              >
                Remove Unreferenced Files
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <LogViewer
              isTextWrapped={false}
              hasLineNumbers={false}
              height={"calc(100vh - 245px)"}
              data={files}
              scrollToRow={scrollToRow}
              theme={'dark'}
              toolbar={
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarGroup align={{ default: 'alignLeft' }}>
                      <ToolbarItem>
                        <LogViewerSearch
                          minSearchChars={2}
                          placeholder="Search"
                        />
                      </ToolbarItem>
                    </ToolbarGroup>
                  </ToolbarContent>
                </Toolbar>
              }
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