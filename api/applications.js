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

// Handle both POST and GET requests in a serverless function
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Handle POST request (submission of application)
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

      res.status(201).json({ message: 'Application submitted successfully', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error submitting application' });
    }
  }

  else if (req.method === 'GET') {
    // Handle GET request (fetching applications)
    try {
      const search = req.query.search || '';
      const query = `
        SELECT * FROM applications
        WHERE discord_username LIKE ? OR character_name LIKE ?
        ORDER BY id DESC
      `;
      const [rows] = await pool.execute(query, [`%${search}%`, `%${search}%`]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching applications' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
