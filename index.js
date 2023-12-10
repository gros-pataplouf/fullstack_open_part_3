const express = require("express");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
const cors = require("cors");
let data = require("./data.json");

morgan.token("reqbody", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "No request body available.";
});

app.use(cors());
app.use(morgan(":method :url :status - :response-time ms :reqbody"));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Welcome to the phonebook api")
}) 

app.get("/info", (req, res) => {
  const numOfPeople = data.length;
  return res.send(
    `<p>Phonebook has info for ${numOfPeople} people</p> <p>${new Date().toLocaleString()} ${new Date().toString()} `,
  );
});

app.get("/api/persons", (req, res) => {
  return res.json(data);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((person) => person.id === id);
  if (person) {
    return res.json(person);
  } else
    return res.status(404).send(`Sorry, there is no id ${id} in our database.`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((person) => person.id === id);
  if (person) {
    data = data.filter((person) => person.id !== id);
    console.log(data);
    return res.status(204).send({ message: `${id} has been deleted.` });
  } else
    return res.status(404).send(`Sorry, there is no id ${id} in our database.`);
});

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;
  if (!newPerson.name || !newPerson.number) {
    return res.status(400).send({ error: "name or number missing" });
  }
  if (data.find((person) => person.name === newPerson.name)) {
    return res
      .status(403)
      .send({ error: "duplicate values are not authorized" });
  }
  const id = Math.floor(Math.random() * 1000000000000);
  const validatedPerson = { id, ...newPerson }; //otherwise, morgan logs the created id, despite it not being present in the original request body
  data.push(validatedPerson);
  return res.status(201).send("newPerson created");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
