import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Service Role Key
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

// Allowed Origins
const allowedOrigins = ["https://www.cinevault.xyz", "http://localhost:3000", "http://localhost:5173", "https://senior-project-grtydj4gz-gael-guzmans-projects.vercel.app/"];

// CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async (message) => {
    console.log("Message received:", message);

    try {
      const { data, error } = await supabase
        .from("Messages")
        .insert([
          {
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            message_body: message.message_body,
            timestamp: new Date(),
          },
        ]);

      if (error) {
        console.error("Error saving message:", error);
        return;
      }

      // Broadcast the message to all connected clients
      io.emit("receiveMessage", { ...message, timestamp: new Date() });
    } catch (err) {
      console.error("Error handling sendMessage event:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Example HTTP Endpoint
app.get("/", (req, res) => {
  res.send("Socket.io server is running!");
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
