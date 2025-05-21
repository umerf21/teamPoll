import {db}  from "../config/db";

const createTables = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS polls (
      id UUID PRIMARY KEY,
      question TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS poll_options (
      id UUID PRIMARY KEY,
      poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      votes INTEGER DEFAULT 0
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS poll_votes (
      id UUID PRIMARY KEY,
      poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE
    );
  `);

  console.log("✅ Tables created");
};

createTables().then(() => process.exit());
