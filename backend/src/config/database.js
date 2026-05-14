import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;

// 1. ESM __dirname workaround
// This finds the absolute path of THIS file (database.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Resolve to the .env file
// Based on your folder structure: src/config -> src -> backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// 3. Debugging (Keep these until you confirm it works!)
console.log('DEBUG: DB_USER is', process.env.DB_USER);
console.log('DEBUG: DB_PASSWORD is', process.env.DB_PASSWORD ? 'Set' : 'UNDEFINED');

// 4. Pool Configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// 5. Error Handling for Idle Clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// 6. Immediate Connection Test (Using Top-Level Await)
try {
  const client = await pool.connect();
  console.log('✅ Connected to PostgreSQL');
  client.release();
} catch (err) {
  console.error('❌ DB connection error:', err.message);
}

export default pool;



// import * as dotenv from 'dotenv';
// import path from 'path';
// import pg from 'pg';
// const { Pool } = pg;

// dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// console.log('DEBUG: DB_USER is', process.env.DB_USER);
// console.log('DEBUG: DB_PASSWORD is', process.env.DB_PASSWORD ? 'Set' : 'UNDEFINED');

// const pool = new Pool({
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT) || 5432,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// try {
//   const client = await pool.connect();
//   console.log('✅ Connected to PostgreSQL');
//   client.release();
// } catch (err) {
//   console.error('❌ DB connection error:', err.message);
// }

// export default pool;