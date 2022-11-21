const region = process.env.AWS_REGION;
const COGNITO_USER_POOL_ID = process.env.UserPoolId;
const COGNITO_CLIENT_ID = process.env.UserPoolClientId;
const stage = process.env.STAGE; // TODO Use keyword 'stage'/'dev'/'production' in the serverless.yml
export const isProductionMode = stage === 'production';

export default {
  isLocal: process.env.IS_OFFLINE && process.env.IS_OFFLINE === 'true',
  region,
  stage,
  db: {
    local: {
      name: 'local',
      host: 'iot-db.c8ajghifdi3g.us-west-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'G2eaR7AJgtGZug5ysxSL',
      database: 'iot',
      synchronize: false,
      logging: true,
    },
    dev: {
      name: 'dev',
      host: 'iot-db.c8ajghifdi3g.us-west-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'G2eaR7AJgtGZug5ysxSL',
      database: 'iot',
      synchronize: false,
      logging: true,
    },
    stage: {
      name: 'stage',
      host: 'iot-db.c8ajghifdi3g.us-west-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'G2eaR7AJgtGZug5ysxSL',
      database: 'iot',
      synchronize: false,
      logging: true,
    },
    production: {
      name: 'production',
      host: 'iot-db.c8ajghifdi3g.us-west-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'G2eaR7AJgtGZug5ysxSL',
      database: 'iot',
      synchronize: false,
      logging: true,
    },
  },
  tables: {
    building: 'building',
    system: 'system',
    user: 'user',
  },
  s3: {
    BUCKET: process.env.S3_BUCKET_NAME,
  },
  cognito: {
    COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID,
  },
  cmsUrl: isProductionMode ? 'https://***.***.com' : 'http://***.***.com',
  transactionProber: process.env.PROBE_TRANSACTION === 'enabled',
};
