class Primary {
  constructor(server) {
    this.server = server;
    this.API = this.server.API;

    this.endpointPrefix = '/' + this.server.env.API_VERSION;
  }
}

export default Primary;