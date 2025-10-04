const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Database setup
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) console.error("Database error:", err);
  else console.log("Connected to SQLite database.");
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    rating INTEGER,
    comments TEXT
  )
`);

// Route: Submit feedback
app.post("/submit-feedback", (req, res) => {
  const { name, email, rating, comments } = req.body;
  db.run(
    "INSERT INTO feedback (name, email, rating, comments) VALUES (?, ?, ?, ?)",
    [name, email, rating, comments],
    function (err) {
      if (err) {
        res.status(500).send("Error saving feedback.");
      } else {
        res.send("Feedback submitted successfully!");
      }
    }
  );
});

// Route: View feedback (admin)
app.get("/view-feedback", (req, res) => {
  db.all("SELECT * FROM feedback", [], (err, rows) => {
    if (err) res.status(500).send("Error fetching feedback.");
    else res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
