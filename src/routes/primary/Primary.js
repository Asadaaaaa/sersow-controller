import AuthorizationMiddleware from "../../middlewares/Authorization.middleware.js";

class Primary {
  constructor(server) {
    this.server = server;
    this.API = this.server.API;

    this.endpointPrefix = '/' + this.server.env.API_VERSION;
    this.AuthorizationMiddleware = new AuthorizationMiddleware(this.server);
  }
}

export default Primary;