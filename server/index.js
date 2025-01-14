import "express-async-errors";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { connectDB, connectServer } from "./config.js";
import userRouter from "./routes/user.js";
import isAuthenticated, {
  isSocketAuthenticated,
} from "./middlewares/isAuthenticated.js";
import messageRouter from "./routes/message.js";
import { Server } from "socket.io";
import Message from "./models/Message.js";

// Server
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api/user", userRouter);
app.use("/api/message", isAuthenticated, messageRouter);

// Connection
connectDB();
connectServer(server);

// Websocket
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(isSocketAuthenticated);

io.on("connection", async (socket) => {
  console.log(`user connected: ${socket.userId}`);

  socket.join(socket.userId);

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.userId}`);
  });

  socket.on("typing", (receiverId) => {
    socket.to(receiverId).emit("typing", socket.userId);
  });

  socket.on("stop_typing", (receiverId) => {
    socket.to(receiverId).emit("stop_typing", socket.userId);
  });

  socket.on("seen", async (receiverId) => {
    // نحصل على معرف المرسل من الاتصال الحالي
    const senderId = socket.userId;

    // نطبع رسالة في وحدة التحكم لتوضيح أن الرسائل من المرسل تم وضع علامة "مقروءة" من قبل المستقبل
    console.log(`Marking messages from ${senderId} as seen by ${receiverId}`);

    // نقوم بتحديث حالة جميع الرسائل التي لم تُقرأ بعد
    await Message.updateMany(
      { senderId, receiverId, seen: false }, // تحديد الرسائل التي لم تُقرأ بعد
      { seen: true }, // تحديث الحالة إلى "مقروءة"
      { multi: true } // تحديد أنه يجب تحديث جميع الرسائل المطابقة
    ).exec();

    // نرسل حدث "seen" إلى جميع العملاء لتحديث حالة الرسائل لديهم
    io.emit("seen", senderId);
  });

  socket.on("send_message", async ({ receiverId, content }) => {
    const senderId = socket.userId;

    const message = await Message.create({ senderId, receiverId, content });

    io.to([receiverId, senderId]).emit("receive_message", message);
  });
});
