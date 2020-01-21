const env: string = process.env.NODE_ENV;

interface Config {
  [index: string]: string;
}

const Config: Config = {
  foreignPrefix: 'http://104.156.250.95:7001',
  production: 'http://47.112.23.45:5002',
  development: 'http://localhost:5002'
};

const prefix: string = Config[`${env}`];

export default {
  env,
  Config,
  prefix
};
