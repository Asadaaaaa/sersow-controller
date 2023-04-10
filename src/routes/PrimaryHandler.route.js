import AuthRoute from './primary/Auth.route.js';

class PrimaryHandler {
  constructor(server) {
    new AuthRoute(server);
  }
}

export default PrimaryHandler;