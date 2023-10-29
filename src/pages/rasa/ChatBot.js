import React from 'react';
import {ConsoleLog, UserContext} from "../../utils/UserContext";
import {enqueueErrorSnackbar, enqueueSuccessSnackbar, enqueueWarningSnackbar} from "../../utils/SnackbarVariants";
import 'react-chatbot-kit/build/main.css';
import {
  CMD_BOT_MESSAGE_SEND,
} from "../../utils/constants";
import {isCommandResponse, messageHasResponse, messageResponseStatusOk} from "../../utils/WebsocketUtils";
import { ReactBot, addBotMessage, addUserMessage } from '@cozimacode/react-bot';
import "@cozimacode/react-bot/dist/styles.css";

export const CHATBOT_REF = "ChatBot";

class ChatBot extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
    this.Module = CHATBOT_REF;
    // this.displayTypingEffect = null;
    this.hideTypingEffect = null;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  show_utterances = async (utterances) => {
    for (const utter of utterances) {
      console.log(">>", utter.text)
      await addBotMessage(utter.text, "rasabot");
    }
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_BOT_MESSAGE_SEND)) {
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", response)
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", response.utterance)
          this.hideTypingEffect();
          this.show_utterances(response.utterance).then(r => {});
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  handleUserInput = async (input, displayTypingEffect, hideTypingEffect) => {
    // this.displayTypingEffect = displayTypingEffect;
    this.hideTypingEffect = hideTypingEffect;
    displayTypingEffect();
    this.props.send({
      cmd: CMD_BOT_MESSAGE_SEND,
      message: input,
      module: this.Module
    }, false);
    // await addUserMessage(input, "rasabot");
    // if (input.indexOf("Hi") > -1) {
    //   hideTypingEffect()
    //   await addBotMessage("Hi there!", "rasabot");
    // }
  }

  render() {
    const { user } = this.state;
    const { send } = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render");
    }
    return (
      <div style={{fontSize: 12}}>
        {/*<Widget*/}
        {/*  initPayload={"/happy path"}*/}
        {/*  socketUrl={"http://localhost:5005"}*/}
        {/*  socketPath={"/socket.io/"}*/}
        {/*  customData= {{"language": "en", "UserId": "123" }} // arbitrary custom data. Stay minimal as this will be added to the socket*/}
        {/*  title={"NURIMS Chatbot"}*/}
        {/*  inputTextFieldHint={"Type a message..."}*/}
        {/*  hideWhenNotConnected={false}*/}
        {/*  embedded={false}*/}
        {/*/>*/}
        {/*<Chatbot*/}
        {/*  config={config}*/}
        {/*  messageParser={MessageParser}*/}
        {/*  actionProvider={ActionProvider}*/}
        {/*  rasaProvider={send}*/}
        {/*/>*/}
        <ReactBot
          botId={"rasabot"}
          handleUserInput={this.handleUserInput}
          title="Rasa Bot"
          messagePlaceHolder="Type something here..."
          autofocus={true}
        />
      </div>
    );
  }
}

ChatBot.defaultProps = {
  send: (msg) => {},
};

export default ChatBot;