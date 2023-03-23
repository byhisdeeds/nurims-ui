import React from 'react';
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import {Box, Button, Grid, Stack} from "@mui/material";
import {
  AutoCompleteComponent,
  TitleComponent
} from "../../components/CommonComponents";
import {
  CMD_GET_SEARCH_TERM_CONTENT,
  CMD_SUGGEST_SUPPORT_SEARCH_TERMS,
} from "../../utils/constants";
import {isCommandResponse, messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";
import {toast} from "react-toastify";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import {Slate, Editable, withReact} from 'slate-react'
import {createEditor} from 'slate'
import {plainText2RichText} from "../../utils/RTFUtils";

export const TERMSANDDEFINITIONS_REF = "TermsAndDefinitions";


class TermsAndDefinitions extends React.Component {
  static contextType = UserDebugContext;
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      ac_open: false,
      search_term: "",
      search_term_options: [],
      searching: false,
    };
    this.Module = TERMSANDDEFINITIONS_REF;
    this.editor = withReact(createEditor());
    this.search_term_content = [];
  }

  componentDidMount() {
  }

  onAutocompleteOpen = () => {
    this.setState({ac_open: true});
  };

  onAutocompleteClose = () => {
    this.setState({ac_open: false});
  };

  onSearchTermChange = (event) => {
    const value = event.target.value;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.send({
        cmd: CMD_SUGGEST_SUPPORT_SEARCH_TERMS,
        search_term: value,
        module: TERMSANDDEFINITIONS_REF,
      });
      this.setState({searching: true, search_term: event.target.value});
    }, 1000);
    this.setState({search_term: event.target.value});
  };

  onSearchTermSelected = (event, value) => {
    console.log("%%%%%% onSearchTermSelected %%%%%%%%", value)
    clearTimeout(this.timeout);
    this.timeout = null;
    // const record = this.state.record;
    // setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB, typeof value == "string" ? analysisJobAsObject(value) : value);
    this.setState({search_term: value});
  };

  getSearchTermLabel = (term) => {
    console.log("getSearchTermKeywords **** ", term, typeof term === "object" ? term.hasOwnProperty('keywords') ? term.keywords : '' : term)
    return typeof term === "object" ? term.hasOwnProperty('keywords') ? term.keywords : '' : term;
  };

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_SUGGEST_SUPPORT_SEARCH_TERMS)) {
          this.setState({search_term_options: response.search_term_results, searching: false });
        } else if (isCommandResponse(message, CMD_GET_SEARCH_TERM_CONTENT)) {
          this.search_term_content = plainText2RichText(this.search_term_content, response.search_term_content.content);
          this.setState({searching: false });
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  getSearchContent = () => {
    this.props.send({
      cmd: CMD_GET_SEARCH_TERM_CONTENT,
      search_term: this.state.search_term,
      module: TERMSANDDEFINITIONS_REF,
    });
  }

  render() {
    const { user, ac_open, searching, search_term, search_term_options } = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "ac_open", ac_open, "searching", searching,
        "search_term", search_term);
    }
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <AutoCompleteComponent
                freeInput={false}
                label={"Search Keywords"}
                defaultValue={search_term}
                isOpen={ac_open}
                onOpen={this.onAutocompleteOpen}
                onClose={this.onAutocompleteClose}
                getOptionLabel={this.getSearchTermLabel}
                options={search_term_options}
                optionId={"keywords"}
                loading={searching}
                onSelected={this.onSearchTermSelected}
                onChange={this.onSearchTermChange}
                busy={searching}
                padding={0}
              />
              <IconButton
                disableRipple={true}
                disabled={typeof search_term !== "object"}
                small
                variant={"contained"}
                onClick={this.getSearchContent}
              >
                <SearchIcon small />
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box style={{fontSize: 18, fontFamily: 'consola'}}>
              <Slate editor={this.editor} value={this.search_term_content}>
                <Editable readOnly={true} />
              </Slate>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

TermsAndDefinitions.defaultProps = {
  send: (msg) => {},
};

export default TermsAndDefinitions;