import React from 'react';
import {
  ConsoleLog,
  UserDebugContext
} from "../../utils/UserDebugContext";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import {
  AutoCompleteComponent,
  TitleComponent
} from "../../components/CommonComponents";
import {
  CMD_GET_SEARCH_TERM_CONTENT,
  CMD_SUGGEST_SUPPORT_SEARCH_TERMS,
} from "../../utils/constants";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import {Slate, Editable, withReact} from 'slate-react'
import {createEditor, Editor} from 'slate'
import {plainText2RichText} from "../../utils/RTFUtils";
import {MaterialEditable, MaterialSlate, Toolbar} from "../../components/material-slate";
import PdfViewer from "../../components/PdfViewer";
import FormattedTextViewer from "../../components/FormattedTextViewer";

export const TERMSANDDEFINITIONS_REF = "TermsAndDefinitions";

const BLANK_PDF = 'data:application/pdf;base64,JVBERi0xLjQKJb/3ov4KMSAwIG9iago8PCAvUGFnZXMgMiAwIFIgL1R5cGUgL0NhdGFsb2cgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL0NvdW50IDEgL0tpZHMgWyAzIDAgUiBdIC9UeXBlIC9QYWdlcyA+PgplbmRvYmoKMyAwIG9iago8PCAvQ29udGVudHMgNCAwIFIgL0dyb3VwIDw8IC9DUyAvRGV2aWNlUkdCIC9JIHRydWUgL1MgL1RyYW5zcGFyZW5jeSAvVHlwZSAvR3JvdXAgPj4gL01lZGlhQm94IFsgMCAwIDYxMiA3OTEuMjUgXSAvUGFyZW50IDIgMCBSIC9SZXNvdXJjZXMgNSAwIFIgL1R5cGUgL1BhZ2UgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0ZpbHRlciAvRmxhdGVEZWNvZGUgL0xlbmd0aCAzMCA+PgpzdHJlYW0KeJwzVDAAQl1DIGFuaahnZKqQnMtVyBXIBQA6LATGZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8ID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NCAwMDAwMCBuIAowMDAwMDAwMTIzIDAwMDAwIG4gCjAwMDAwMDAyOTggMDAwMDAgbiAKMDAwMDAwMDM5OCAwMDAwMCBuIAp0cmFpbGVyIDw8IC9Sb290IDEgMCBSIC9TaXplIDYgL0lEIFs8YzhjZDFmYzFhMWNiODBlZTgyNzI1ZjIyMTYyMTU2NDE+PGM4Y2QxZmMxYTFjYjgwZWU4MjcyNWYyMjE2MjE1NjQxPl0gPj4Kc3RhcnR4cmVmCjQxOQolJUVPRgo='

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
    this.search_term_content = BLANK_PDF;
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
          // this.search_term_content = plainText2RichText(this.search_term_content, response.search_term_content.content);
          this.search_term_content = "data:application/pdf;base64," + response.search_term_content.content;
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
            <FormattedTextViewer
              height={"50vh"}
              source={this.search_term_content}
              paddingRight={8}
            />
            {/*<div style={{fontSize: 18, fontFamily: 'consola'}}>*/}
            {/*  <Slate*/}
            {/*    editor={this.editor}*/}
            {/*    value={this.search_term_content}*/}
            {/*    onChange={value => {*/}
            {/*      // const isAstChange = this.editor.operations.some(*/}
            {/*      //   op => 'set_selection' !== op.type*/}
            {/*      // )*/}
            {/*      // if (isAstChange) {*/}
            {/*      //   // Save the value to Local Storage.*/}
            {/*      //   const content = JSON.stringify(value)*/}
            {/*      //   console.log("@@@", content)*/}
            {/*      // }*/}
            {/*      console.log("@@@", JSON.stringify(value))*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Toolbar />*/}
            {/*    <Editable*/}
            {/*      readOnly={false}*/}
            {/*      onKeyDown={(e) => {*/}
            {/*        // let's make the current text bold if the user holds command and hits "b"*/}
            {/*        if (e.metaKey && e.key === 'b') {*/}
            {/*          e.preventDefault();*/}
            {/*          Editor.addMark(this.editor, 'bold', true);*/}
            {/*        }*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </Slate>*/}
            {/*</div>*/}
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