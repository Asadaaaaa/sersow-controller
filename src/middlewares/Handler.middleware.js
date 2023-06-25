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

      if(this.server.env.LOG_REQUEST === "full") {
        this.API.use((req, res, next) => {
          const server = this.server
          const chunks = [];
          const originalWrite = res.write;
          const originalEnd = res.end;

          res.write = function (chunk) {
            chunks.push(chunk);
            originalWrite.apply(res, arguments);
          };
        
          res.end = function (chunk) {
            if (chunk) chunks.push(chunk);
            const responseBody = JSON.parse(chunks);
            
            server.sendLogs('New Request: ' + req.originalUrl + '\n- Header: ' + JSON.stringify(req.headers, null, 2) + '\n- Body: ' + JSON.stringify(req.body, null, 2) + '\n- Response: ' + JSON.stringify(responseBody, null, 2));
        
            originalEnd.apply(res, arguments);
          };
          
          next();
          return;
        });

      } else if(this.server.env.LOG_REQUEST === "medium") {
        this.API.use(Morgan((tokens, req, res) => {
          const date = new Date(new Date().toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}));
          const currentDate = '[' + 
            date.getDate() + '/' +
            (date.getMonth() + 1) + '/' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds() +
          ']';

          return [
            '\n' + currentDate,
            '(' + process.pid +'):',
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
          ].join(' ')
        }));
      }
    }
}

export default Handler;
