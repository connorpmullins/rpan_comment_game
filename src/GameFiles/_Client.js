const rp = require("request-promise");

const VALID_MESSAGES = [
  "red",
  "yellow",
  "green",
  "blue",
];

class RPANChat {
  constructor({ onConnect, streamID }) {
    this.uri = `https://strapi.reddit.com/videos/t3_${streamID}`;
    this.onConnect = onConnect;
    this.websocket = null;
    this.failedConnectionAttempts = 0;
    this.websocketReadyState = 3; // 1:open, 3:closed, 0:connecting  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
    this.comments = [];

    this.clearComments = this.clearComments.bind(this);
    this.getComments = this.getComments.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  onMessage(msg) {
      const message = JSON.parse(msg.data);
      if (message.type === "new_comment") {
        let payload = message.payload;
        
        // FAKE A VALID COMMENT
        const num = Math.floor(Math.random() * Math.floor(4));
        const body = VALID_MESSAGES[num];
        // use 'body' for comment.body
        
        let comment = {
          author: payload.author,
          body: body, // payload.body.toLowerCase().trim(),
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
  }

  clearComments() {
    this.comments = [];
  }

  getComments() {
    return this.comments;
  }

  connect() {
    rp(this.uri).then((strapiRequest) => {
      const streamJSON = JSON.parse(strapiRequest);
      const liveCommentsWebsocket = streamJSON.data.post.liveCommentsWebsocket;
      this.websocket = new WebSocket(liveCommentsWebsocket);
      this.websocket.onmessage = this.onMessage;
      this.websocket.onopen = this.onConnect;
      this.websocketReadyState = this.websocket.readyState;
    }).catch(err => {
      console.warn("strapiRequest failed: ", err);
      if (this.failedConnectionAttempts <= 10) {
        setTimeout(() => {
          this.connect();
          this.failedConnectionAttempts += 1;
        }, 1000)
      } 
    });
  }

  disconnect() {
    this.websocket.close();
  }
}

export default RPANChat;
