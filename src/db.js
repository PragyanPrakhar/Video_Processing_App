// Creating a pool for postgree sql database
import { Pool } from "pg";
import { config } from "dotenv";
config();
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    max: 20,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
});
// 🔥 Test connection on startup
pool.query("SELECT NOW()")
    .then((res) => {
        console.log("✅ PostgreSQL Connected:", res.rows[0].now);
    })
    .catch((err) => {
        console.error("❌ PostgreSQL Connection Failed:", err);
    });

export default pool;
