const express = require("express");
const todoRoutes = require("./routes/todo.route");
const prisma = require("./config/db.config");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/todo", todoRoutes);

class Server {
  constructor() {
    this.bootstrap();
  }

  async bootstrap() {
    await prisma.$connect().then(() => {
      console.log("Database connected successfully");
      app.listen(4000, async () => {
        console.log("TCP server has been established ");
      });
    });
  }
}

new Server();

// Create, Read, Update, Delete (CRUD) operations
// (CRUD)
