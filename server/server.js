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

const allowedOrigins = ["https://www.cinevault.xyz", "http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async (message) => {
    console.log("Message received:", message);

    try {
      const { data: insertedMessage, error } = await supabase
        .from("Messages")
        .insert([
          {
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            message_body: message.message_body,
            timestamp: new Date(),
          },
        ])
        .select();

      if (error) {
        console.error("Error saving message:", error);
        return;
      }

      const { data: senderMessages, error: senderFetchError } = await supabase
        .from("Messages")
        .select("id, timestamp")
        .eq("sender_id", message.sender_id)
        .eq("receiver_id", message.receiver_id)
        .order("timestamp", { ascending: true });

      if (senderFetchError) {
        console.error("Error fetching sender's messages:", senderFetchError);
        return;
      }

      if (senderMessages.length > 10) {
        const oldestSenderMessageId = senderMessages[0].id;
        const { error: senderDeleteError } = await supabase
          .from("Messages")
          .delete()
          .eq("id", oldestSenderMessageId);

        if (senderDeleteError) {
          console.error("Error deleting sender's oldest message:", senderDeleteError);
        }
      }

      const { data: receiverMessages, error: receiverFetchError } = await supabase
        .from("Messages")
        .select("id, timestamp")
        .eq("sender_id", message.receiver_id)
        .eq("receiver_id", message.sender_id)
        .order("timestamp", { ascending: true });

      if (receiverFetchError) {
        console.error("Error fetching receiver's messages:", receiverFetchError);
        return;
      }

      if (receiverMessages.length > 10) {
        const oldestReceiverMessageId = receiverMessages[0].id;
        const { error: receiverDeleteError } = await supabase
          .from("Messages")
          .delete()
          .eq("id", oldestReceiverMessageId);

        if (receiverDeleteError) {
          console.error("Error deleting receiver's oldest message:", receiverDeleteError);
        }
      }

      io.emit("receiveMessage", { ...insertedMessage[0], timestamp: new Date() });
    } catch (err) {
      console.error("Error handling sendMessage event:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Socket.io server is running!");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
