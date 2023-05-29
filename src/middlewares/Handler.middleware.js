// Library
import Express from 'express';
import Morgan from 'morgan';
import cors from 'cors';

class Handler {
    constructor(server) {
      this.server = server;
      this.API = this.server.API;

      this.global();
    }

    global() {
      this.API.use(Morgan('tiny'));

      this.API.use(cors({
          methods: ['GET', 'PUT', 'POST', 'DELETE'],
          origin: this.server.env.MIDDLEWARE_ORIGIN
      }));
      
      this.API.use(Express.json({
          limit: this.server.env.MIDDLEWARE_JSON_LIMIT_SIZE
      }));

      this.API.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({
          status: 400,
          err: {
            type: "SyntaxError"
          }
        });
        next();

      });

      this.API.use((req, res, next) => {
        req.middlewares = {};
        next();

      });

      /* this.API.use((req, res, next) => {
        this.server.sendLogs('New Request: ' + req.originalUrl + '\n- Header: ' + JSON.stringify(req.headers, null, 2) + '\n- Body: ' + JSON.stringify(req.body, null, 2) );
        next();
        return;
      }); */
    }
}

export default Handler;
