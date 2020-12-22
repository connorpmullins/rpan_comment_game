const rp = require("request-promise");
const $ = require("cheerio");
const WebSocketClient = require("websocket").client;

const VALID_MESSAGES = [
  "red",
  "yellow",
  "green",
  "blue",
];

class RPANChat {
  constructor({ streamID, userAgent }) {
    this.websocket = new WebSocketClient();
    this.options = {
      uri: `https://strapi.reddit.com/videos/t3_${streamID}`,
      headers: { "User-Agent": userAgent },
    };
    this.comments = [];

    this.whenConnected = this.whenConnected.bind(this);
    this.getComments = this.getComments.bind(this);

    this.websocket.on("connect", this.whenConnected);
  }

  whenConnected(connection) {
    connection.on("message", (msg) => {
      const message = JSON.parse(msg.utf8Data);
      if (message.type === "new_comment") {
        let payload = message.payload;
        const num = Math.floor(Math.random() * Math.floor(4));
        const body = VALID_MESSAGES[num];
        let comment = {
          author: payload.author,
          body: body, //payload.body.toLowerCase().trim(),
          id: payload._id36,
        };
        // Filter invalid messages
        if (VALID_MESSAGES.indexOf(comment.body) >= 0) {
          this.comments.push(comment);
          if (this.comments.length > 30) {
            this.comments.shift();
          }
        }
      }
    });
  }

  clearComments() {
    this.comments = [];
  }

  getComments() {
    return this.comments;
  }

  connect() {
    rp(this.options.uri).then((strapiRequest) => {
      const streamJSON = JSON.parse(strapiRequest);
      const liveCommentsWebsocket = streamJSON.data.post.liveCommentsWebsocket;
      this.websocket.connect(liveCommentsWebsocket, null, this.headers);
    });
  }

  disconnect() {
    this.websocket.close();
  }
}

export default RPANChat;
