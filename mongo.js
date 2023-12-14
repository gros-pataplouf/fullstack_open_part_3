const mongoose = require("mongoose")

const password = process.argv[2]

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}
const url = `mongodb+srv://phonebookapp:${password}@cluster0.wvnvkgq.mongodb.net/?retryWrites=true&w=majority`
mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)
console.log(Person)

if (process.argv.length === 3) {
  console.log("phonebook")
  Person.find({}).then((response) => {
    response.forEach((person) =>
      console.log(`${person.name} ${person.number}`),
    )
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then((_result) => {
    console.log(`${person.name} number ${person.number} added to phonebook`)
    mongoose.connection.close()
  })
}
