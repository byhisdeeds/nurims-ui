import React, {Component} from 'react';
import {
  CMD_CLEANUP_UNREFERENCED_LARGE_OBJECT_STORE_FILES,
} from "../../utils/constants";
import {
  Box,
  Button,
  Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Stack, Typography
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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import DeleteIcon from "@mui/icons-material/HighlightOff";
import {Checkbox, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, Tooltip} from "@patternfly/react-core";
import {LogViewer, LogViewerSearch} from "@patternfly/react-log-viewer";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {isCommandResponse, messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";

export const CLEANUPLARGEOBJECTSTORE_REF = "CleanupLargeObjectStore";

class CleanupLargeObjectStore extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      files: "",
      scrollToRow: 0,
      only_list_files: true,
      processing: false,
    };
    this.Module = CLEANUPLARGEOBJECTSTORE_REF;
  }

  // toggleTextWrapping = (wrapped) => {
  //   this.setState({ isTextWrapped: !this.state.isTextWrapped });
  // }

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
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "only_list_files", only_list_files, "scrollToRow", scrollToRow,
        "processing", processing);
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
                label={"Only List Files"}
                onChange={this.onlyListFiles}
                value={only_list_files}
              />
              <Box sx={{flexGrow: 1}} />
              <LoadingButton
                sx={{minWidth: 300}}
                loading={processing}
                loadingPosition="start"
                endIcon={<DeleteIcon />}
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
              hasLineNumbers={true}
              height={500}
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