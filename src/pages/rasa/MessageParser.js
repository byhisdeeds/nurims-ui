import {CMD_BOT_MESSAGE_SEND} from "../../utils/constants";

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
    this.Module = "MessageParser";
  }

  parse = (message) => {
    console.log("#####", message)
    console.log("this.actionProvider.rasaProvider", this.actionProvider.rasaProvider)
    const lowerCase = message.toLowerCase();

    if (this.actionProvider.rasaProvider) {
      console.log("%%%%%%%%%%%%%%", lowerCase)
      this.actionProvider.rasaProvider.send({
        cmd: CMD_BOT_MESSAGE_SEND,
        message: lowerCase,
        module: "ChatBot"
      })
    }
  }
  //
  //   if (
  //     lowerCase.includes("messageparser") ||
  //     lowerCase.includes("parse") ||
  //     lowerCase.includes("parser") ||
  //     lowerCase.includes("message parser")
  //   ) {
  //     return this.actionProvider.handleMessageParserDocs();
  //   }
  //
  //   if (lowerCase.includes("action") || lowerCase.includes("actionprovider")) {
  //     return this.actionProvider.handleActionProviderDocs();
  //   }
  //
  //   if (lowerCase.includes("config")) {
  //     return this.actionProvider.handleConfigDocs();
  //   }
  //
  //   if (lowerCase.includes("widget")) {
  //     return this.actionProvider.handleWidgetDocs();
  //   }
  //
  //   return this.actionProvider.handleDefault();
  // };
}

export default MessageParser;