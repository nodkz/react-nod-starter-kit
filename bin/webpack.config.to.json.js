import fs from 'fs';
import path from 'path';
import configList from './webpack.config';

fs.writeFileSync(
  path.join(__dirname, '../.webpack.client.json'),
  JSON.stringify(configList[0], null, 2)
);

fs.writeFileSync(
  path.join(__dirname, '../.webpack.server.json'),
  JSON.stringify(configList[1], null, 2)
);
