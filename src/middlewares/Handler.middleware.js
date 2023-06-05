import ResponsePreset from '../helpers/ResponsePreset.helper.js';

// Library
import Express from 'express';
import Morgan from 'morgan';
import cors from 'cors';

class Handler {
    constructor(server) {
      this.server = server;
      this.API = this.server.API;

      this.ResponsePreset = new ResponsePreset();

      this.global();
    }

    global() {
      this.API.use(Morgan('tiny'));

      this.API.use(cors({
          methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
          origin: this.server.env.MIDDLEWARE_ORIGIN
      }));

      this.API.use('/:apiVersion', (req, res, next) => {
        const { apiVersion } = req.params;

        if(apiVersion !== this.server.env.API_VERSION) return res.status(410).json(this.ResponsePreset.resErr(
          410,
          'Gone, Something wrong with the version of API',
          'api-version',
          { code: -1 }
        ));

        next();
      });
      
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

      this.API.use((req, res, next) => {
        this.server.sendLogs('New Request: ' + req.originalUrl + '\n- Header: ' + JSON.stringify(req.headers, null, 2) + '\n- Body: ' + JSON.stringify(req.body, null, 2) );
        next();
        return;
      });
    }
}

export default Handler;
