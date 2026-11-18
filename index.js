/*
  KAMBAC Livestock Management System - Livestock Module
  Independent Module Repository
*/
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import fs from "fs";
import hbs from "hbs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load environment variables
dotenv.config();

import router from "./routes/index.js";
import { attachUserToLocals } from "./app/middleware/authMiddleware.js";
import { createDatabaseIfNotExists, sequelize } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder
app.use(express.static(path.join(process.cwd(), "public")));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "livestock-module-secret-key-2025",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Attach current user & flash messages to view locals
app.use(attachUserToLocals);

// Setup custom template engine (.xian extension powered by hbs)
app.engine("xian", async (filePath, options, callback) => {
  try {
    const originalPartialsDir = hbs.partialsDir;
    hbs.partialsDir = path.join(__dirname, "views");

    const result = await new Promise((resolve, reject) => {
      hbs.__express(filePath, options, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    hbs.partialsDir = originalPartialsDir;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "xian");

// Register Handlebars helpers
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

// Auto-register partials from views/partials
const partialsDir = path.join(__dirname, "views/partials");
if (fs.existsSync(partialsDir)) {
  fs.readdir(partialsDir, (err, files) => {
    if (err) {
      console.error("❌ Could not read partials directory:", err);
      return;
    }
    files
      .filter(file => file.endsWith('.xian'))
      .forEach(file => {
        const partialName = file.replace('.xian', '');
        const fullPath = path.join(partialsDir, file);
        fs.readFile(fullPath, 'utf8', (err, content) => {
          if (err) {
            console.error(`❌ Failed to read partial: ${file}`, err);
            return;
          }
          hbs.registerPartial(partialName, content);
        });
      });
  });
}

// Routes
app.use("/", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Application Error:", err);
  res.status(500).send("Internal Server Error: " + err.message);
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🔥 Livestock Module running at http://localhost:${PORT}`);
  console.log(`🌾 KAMBAC Livestock Management System active.`);
  
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log(`✅ MySQL database '${sequelize.config.database}' connected and ready.`);
  } catch (error) {
    console.error(`❌ Database connection error on startup:`, error.message);
  }
});

export default app;
