const {Pool} = require('pg')

export const client = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SowSmart',
  password: '12345_qwert',
  port: 5432, 
});

module.exports = client



