const env: string = 'production';

interface Config {
  [index: string]: string;
}

const Config: Config = {
  foreignPrefix: 'http://104.156.250.95:7001',
  production: 'http://47.112.23.45:5001/1.0',
  development: 'http://localhost:5001/1.0'
};

const prefix: string = Config[`${env}`];

export default {
  env,
  Config,
  prefix
};
