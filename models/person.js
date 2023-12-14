const mongoose = require("mongoose")
require("dotenv").config()
mongoose.set("strictQuery", false)
const url = process.env.MONGO_URI
console.log("connecting to ", url)

mongoose
  .connect(url)
  .then((_result) => {
    console.log("connection successful")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 9,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v)
      } }
  } })

personSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model("Person", personSchema)
module.exports = Person
