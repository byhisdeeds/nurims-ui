import React from 'react';
import {
  withTheme
} from "@mui/styles";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  Grid,
  Stack
} from "@mui/material";
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
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import sanitize from "sanitize-html";
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
// import CodeEditor from "@uiw/react-textarea-code-editor";

export const TERMSANDDEFINITIONS_REF = "TermsAndDefinitions";

const BLANK_PDF = 'data:application/pdf;base64,JVBERi0xLjQKJb/3ov4KMSAwIG9iago8PCAvUGFnZXMgMiAwIFIgL1R5cGUgL0NhdGFsb2cgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL0NvdW50IDEgL0tpZHMgWyAzIDAgUiBdIC9UeXBlIC9QYWdlcyA+PgplbmRvYmoKMyAwIG9iago8PCAvQ29udGVudHMgNCAwIFIgL0dyb3VwIDw8IC9DUyAvRGV2aWNlUkdCIC9JIHRydWUgL1MgL1RyYW5zcGFyZW5jeSAvVHlwZSAvR3JvdXAgPj4gL01lZGlhQm94IFsgMCAwIDYxMiA3OTEuMjUgXSAvUGFyZW50IDIgMCBSIC9SZXNvdXJjZXMgNSAwIFIgL1R5cGUgL1BhZ2UgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0ZpbHRlciAvRmxhdGVEZWNvZGUgL0xlbmd0aCAzMCA+PgpzdHJlYW0KeJwzVDAAQl1DIGFuaahnZKqQnMtVyBXIBQA6LATGZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8ID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NCAwMDAwMCBuIAowMDAwMDAwMTIzIDAwMDAwIG4gCjAwMDAwMDAyOTggMDAwMDAgbiAKMDAwMDAwMDM5OCAwMDAwMCBuIAp0cmFpbGVyIDw8IC9Sb290IDEgMCBSIC9TaXplIDYgL0lEIFs8YzhjZDFmYzFhMWNiODBlZTgyNzI1ZjIyMTYyMTU2NDE+PGM4Y2QxZmMxYTFjYjgwZWU4MjcyNWYyMjE2MjE1NjQxPl0gPj4Kc3RhcnR4cmVmCjQxOQolJUVPRgo='

// https://draftjs.org/docs/getting-started

class TermsAndDefinitions extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      ac_open: false,
      search_term: "",
      search_term_options: [],
      searching: false,
      text: "",
    };
    this.Module = TERMSANDDEFINITIONS_REF;
    this.modules = {
      toolbar: false
      // [
      //   [{'header': [1, 2, false]}],
      //   // [{'header': '1'}, {'header': '2'}, {'font': Font.whitelist}],
      //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      //   [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      //   ['link', 'image'],
      //   ['clean']
      // ]
    };
    this.formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];
    this.search_term_content = "";
  }

  componentDidMount() {
  }

  handleChange = (value) => {
    this.setState({text: value});
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
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_SUGGEST_SUPPORT_SEARCH_TERMS)) {
          this.setState({search_term_options: response.search_term_results, searching: false });
        } else if (isCommandResponse(message, CMD_GET_SEARCH_TERM_CONTENT)) {
          // this.search_term_content = plainText2RichText(this.search_term_content, response.search_term_content.content);
          // this.search_term_content = "data:application/pdf;base64," + response.search_term_content.content;
          this.search_term_content = sanitize(response.search_term_content.content);
          this.setState({searching: false, text: this.search_term_content });
        }
      } else {
        enqueueErrorSnackbar(response.message);
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

  update = () => {
    this.props.send({
      cmd: "update_terms_and_definitions",
      search_term: this.state.search_term,
      module: TERMSANDDEFINITIONS_REF,
    });
  }

  render() {
    const {user, ac_open, searching, search_term, search_term_options, text} = this.state;
    const {theme} = this.props;
    // if (this.context.debug) {
    //   ConsoleLog(this.Module, "render", "ac_open", ac_open, "searching", searching,
    //     "search_term", search_term, "text", text);
    // }
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
              <IconButton
                disableRipple={true}
                small
                variant={"contained"}
                onClick={this.update}
              >
                <RefreshIcon small />
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <div style={{fontSize: 16, fontFamily: 'consola'}}>
              { <div dangerouslySetInnerHTML={{ __html: this.search_term_content }} /> }
            </div>
            {/*<CodeEditor*/}
            {/*  readOnly={true}*/}
            {/*  fullwidth={true}*/}
            {/*  value={text}*/}
            {/*  language={"js"}*/}
            {/*  data-color-mode={theme.palette.mode}*/}
            {/*  padding={15}*/}
            {/*  style={{*/}
            {/*    fontSize: 12,*/}
            {/*    fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",*/}
            {/*    width: "100%",*/}
            {/*    overflowY: "auto",*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<ReactQuill*/}
            {/*  readOnly={true}*/}
            {/*  value={text}*/}
            {/*  modules={this.modules}*/}
            {/*  formats={this.formats}*/}
            {/*  onChange={this.handleChange}*/}
            {/*/>*/}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

TermsAndDefinitions.defaultProps = {
  send: (msg) => {},
};

export default withTheme(TermsAndDefinitions);