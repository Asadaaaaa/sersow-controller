import AuthRoute from './primary/Auth.route.js';
import ProfileRoute from './primary/Profile.route.js';
import SettingsRoute from './primary/Settings.route.js';
import ActivityRoute from './primary/Activity.route.js';
import ProjectRoute from './primary/Project.route.js';

class PrimaryHandler {
  constructor(server) {
    new AuthRoute(server);
    new ProfileRoute(server);
    new SettingsRoute(server);
    new ActivityRoute(server);
    new ProjectRoute(server);
  }
}

export default PrimaryHandler;