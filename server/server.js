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

pythonProcess.stdout.on("data", (data) => {
  const output = data.toString().trim();
  console.log("Python output:", output);

  try {
    const recommendations = JSON.parse(output);
    // Send the recommendations back to the client
    lastResponse?.json(recommendations);
  } catch (error) {
    console.error("Error parsing Python output:", error);
  }
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`Error from Python process: ${data}`);
});

let lastResponse = null; // Store last response to send recommendations to

function sendMovieIdToPython(movieId, res) {
  lastResponse = res;  // Save the response object to send recommendations later
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

app.get("/movies", async (req, res) => {
  console.log("Trying");
  try {
    const chunkSize = 1000;  // Define the chunk size for each fetch
    let allMovies = [];
    let start = 0;
    let hasMoreData = true;

    // Keep fetching data until there's no more data
    while (hasMoreData) {
      const { data, error, count } = await supabase
        .from("Movies")
        .select("*", { count: "exact" })  // Get the total count for reference
        .range(start, start + chunkSize - 1);  // Fetch the next chunk of data

      if (error) {
        console.error("Error fetching movies:", error);
        return res.status(500).send("Error fetching movies from the database.");
      }

      // Append the fetched data to the allMovies array
      allMovies = [...allMovies, ...data];

      // If the number of fetched items is less than the chunk size, stop fetching more
      if (data.length < chunkSize) {
        hasMoreData = false;
      } else {
        // Otherwise, move the starting point to the next chunk
        start += chunkSize;
      }
    }

    // Return all collected movies once all data is fetched
    res.json(allMovies);
    console.log(`Finished With ${allMovies.length}`);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("Unexpected error while fetching movies.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
