const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_TZ9oMu8BxYDA@ep-billowing-wildflower-anp1t9of.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log("Attempting to connect to Neon...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Server time:", res.rows[0].now);
    await client.end();
  } catch (err) {
    console.error("Connection error:", err.message);
    console.error("Detailed error:", err);
  }
}

testConnection();
