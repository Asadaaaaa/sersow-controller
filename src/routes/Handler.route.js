import  PrimaryHandler from './PrimaryHandler.route.js';

class Handler {
  constructor(server) {
    new PrimaryHandler(server);
  }
}

export default Handler;
