const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()
const Person = require("./models/person")
const { Error400, Error404, errorHandler } = require("./errorHandling")
const app = express()
const PORT = process.env.PORT

morgan.token("reqbody", function (req, _res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
  return "No request body available."
})

app.use(cors())
app.use(express.static("./dist"))
app.use(express.json())
app.use(morgan(":method :url :status - :response-time ms :reqbody"))

app.get("/info", (_req, res, next) => {
  Person.find({})
    .then((response) => {
      res.send(
        `<p>Phonebook has info for ${
          response.length
        } people</p> <p>${new Date().toLocaleString()} ${new Date().toString()}) `,
      )
    })
    .catch((error) => {
      next(error)
    })
})

app.get("/api/persons", (_req, res, next) => {
  Person.find({})
    .then((response) => {
      return res.json(response)
    })
    .catch((error) => {
      next(error)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        throw new Error404()
      }
      return res.json(person)
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((response) => {
      if (response) {
        return res.status(204).end()
      } else {
        throw new Error404()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    throw new Error400()
  }
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  })
  newPerson
    .save()
    .then((savedPerson) => {
      res.status(201).json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body
  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: "query" }
  )
    .then(response => {
      res.status(204).send(response)
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`)
})
