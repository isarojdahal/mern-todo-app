const app = require("express").Router();
const prisma = require("../config/db.config");

// create.
app.post("/", async (req, res) => {
  const { data } = req.body;

  const d = await prisma.todo.create({
    data: {
      title: data.title,
      description: data.description,
      completed: false,
    },
  });
  res.json({ data: d });
});

// get Todos.
app.get("/", async (req, res) => {
  const data = await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json({
    data,
  });
});

// Delete Todos.
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    const data = await prisma.todo.delete({
      where: {
        id,
      },
    });
    res.json({ data });
  } catch (err) {
    res.status(404).json({ error: "Todo not found" });
  }
});

// Update Todo
app.put("/:id", async (req, res) => {
  const { id } = req.params;

  console.log("id", id);
  const { data } = req.body;
  console.log("data", data);

  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo)
      return res.send({ status: "error", message: "Updating Todo not found" });

    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title: data.title ? data.title : todo.title,
        description: data.description ? data.description : todo.description,
        completed: data.completed ?? todo.completed,
      },
    });

    res.send({ data: updatedTodo, status: "success" });
  } catch (err) {
    res.json({ data: {}, status: "error", error: err });
  }
});

module.exports = app;
