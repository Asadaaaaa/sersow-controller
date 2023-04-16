import AuthRoute from './primary/Auth.route.js';
import ProfileRoute from './primary/Profile.route.js';

class PrimaryHandler {
  constructor(server) {
    new AuthRoute(server);
    new ProfileRoute(server);
  }
}

export default PrimaryHandler;