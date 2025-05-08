// api/applications.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// Set up MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://whitelist.carthage-dynasty.com', // Replace with your frontend URL
  'Access-Control-Allow-Methods': 'GET, POST', // Methods you want to allow
  'Access-Control-Allow-Headers': 'Content-Type', // Allow Content-Type header for JSON requests
  'Access-Control-Allow-Credentials': 'true', // If you need to send cookies or other credentials
};

// Handle both POST and GET requests in a serverless function
module.exports = async (req, res) => {
  // Pre-flight OPTIONS request handling
  if (req.method === 'OPTIONS') {
    res.status(200).set(corsHeaders).end();
    return;
  }

  // Handle POST request (submission of application)
  if (req.method === 'POST') {
    try {
      const {
        discordUsername,
        characterName,
        characterBackstory,
        characterRace,
        characterAge,
        rpExperience,
        serverRulesAgreement
      } = req.body;

      const [result] = await pool.execute(
        `INSERT INTO applications 
        (discord_username, character_name, character_backstory, character_race, character_age, rp_experience, server_rules_agreement)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [discordUsername, characterName, characterBackstory, characterRace, characterAge, rpExperience, serverRulesAgreement]
      );

      res.status(201).set(corsHeaders).json({ message: 'Application submitted successfully', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).set(corsHeaders).json({ message: 'Error submitting application' });
    }
  }

  // Handle GET request (fetching applications)
  else if (req.method === 'GET') {
    try {
      const search = req.query.search || '';
      const query = `
        SELECT * FROM applications
        WHERE discord_username LIKE ? OR character_name LIKE ?
        ORDER BY id DESC
      `;
      const [rows] = await pool.execute(query, [`%${search}%`, `%${search}%`]);
      res.set(corsHeaders).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).set(corsHeaders).json({ message: 'Error fetching applications' });
    }
  } else {
    res.status(405).set(corsHeaders).json({ message: 'Method Not Allowed' });
  }
};
