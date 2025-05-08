require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT || 3306, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post('/api/applications', async (req, res) => {
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
});

app.get('/api/applications', async (req, res) => {
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
  });
  

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
