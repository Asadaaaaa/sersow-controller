import sendLogs from './helpers/Logger.helper.js';

// Library
import * as dotenv from 'dotenv';
import os from 'os';
import cluster from 'cluster';
import FS from 'fs-extra';
import Express from 'express';

class Server {
  constructor() {
    // Logger
    this.sendLogs = sendLogs;

    // File System
    this.FS = FS;

    // .env config
    dotenv.config();
    this.env = process.env;

    // Total Server CPUs
    const numCPUs = os.cpus().length;

    if(this.env.MULTI_THREAD === 'true') {
      this.multiThreads(numCPUs);
    } else {
      this.sendLogs('Total CPUs: ' + numCPUs);
      this.sendLogs('Starting Server with 1 threads...');

      this.init();
    }
  }
  
  init() {    
    // Initiate Server Data
    const serverDataPath = '/server_data';
    const resourceFolder = '/src/resources';

    if (!FS.existsSync(process.cwd() + serverDataPath)) {
      this.sendLogs('Initiate Server Data...');
      this.FS.mkdirSync(process.cwd() + serverDataPath);
      this.FS.copySync(process.cwd() + resourceFolder, process.cwd() + serverDataPath);
    }

    this.run();
  }

  run() {
    this.API = Express();

    this.API.listen(this.env.PORT, this.env.IP, () => this.sendLogs('Server Started, Listening PORT ' + this.env.PORT));
  }

  multiThreads(numCPUs) { 
    if(cluster.isPrimary) {
      this.sendLogs('Total CPUs ' + numCPUs);
      this.sendLogs('Starting Server with ' + numCPUs + ' threads...');

      // Fork workers.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      // This event is first when worker died
      cluster.on('exit', (worker, code, signal) => {
        this.sendLogs(`worker ${worker.process.pid} died`);
      });
    } else {
      this.init();
    }
  }
}

new Server();