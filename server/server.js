import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonProcess = spawn("python", [
  path.join(__dirname, "_temp.py"),
]);

const pendingRequests = new Map();

pythonProcess.stdout.on("data", (data) => {
  const output = data.toString().trim();
  console.log("Python output:", output);

  try {
    const recommendations = JSON.parse(output);
    const movieId = [...pendingRequests.keys()][0];

    if (movieId) {
      const res = pendingRequests.get(movieId);
      pendingRequests.delete(movieId);
      res.json(recommendations);
    }
  } catch (error) {
    console.error("Error parsing Python output:", error);
  }
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`Error from Python process: ${data}`);
});

function sendMovieIdToPython(movieId, res) {
  if (pendingRequests.has(movieId)) {
    res.status(429).send("Request already in progress for this movie ID.");
    return;
  }

  pendingRequests.set(movieId, res);
  pythonProcess.stdin.write(movieId + "\n");
}

app.get("/recommendations", (req, res) => {
  const movieId = req.query.movieId; 

  if (!movieId) {
    return res.status(400).send("Movie ID is required.");
  }

  console.log("Received Movie ID:", movieId);
  sendMovieIdToPython(movieId, res);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
