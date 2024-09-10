import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Supabase configs in case we use them
// From what I can see, supabase will handle most endpoints
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Express configs
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

// In terminal, cd to server folder then run "npm i" then "npm start" to start server
// Root endpoint
app.get('/', async (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
