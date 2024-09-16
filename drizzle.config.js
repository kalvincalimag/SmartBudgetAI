const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    out: "./drizzle",
    dbCredentials: {
      url: process.env.DATABASE_URL,
      connectionString: process.env.DATABASE_URL,
    }
  };

