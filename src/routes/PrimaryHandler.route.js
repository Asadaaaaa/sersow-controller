import AuthRoute from './primary/Auth.route.js';
import ProfileRoute from './primary/Profile.route.js';
import SettingsRoute from './primary/Settings.route.js';

class PrimaryHandler {
  constructor(server) {
    new AuthRoute(server);
    new ProfileRoute(server);
    new SettingsRoute(server);
  }
}

export default PrimaryHandler;