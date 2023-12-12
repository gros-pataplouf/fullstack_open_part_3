/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import personsService from "./services/persons";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Phonebook from "./components/Phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [searchFailed, setSearchFailed] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });
  useEffect(() => {
    personsService
      .getAll()
      .then((response) => response.length && setPersons(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        props={{ persons, setFilteredPersons, setSearchFailed, setPersons }}
      />
      <Form
        props={{
          newName,
          setNewName,
          newNumber,
          setNewNumber,
          setPersons,
          setFilteredPersons,
          message,
          setMessage,
        }}
      />
      <h2>Numbers</h2>
      {persons.length ? (
        <Phonebook
          props={{
            persons,
            filteredPersons,
            searchFailed,
            setPersons,
            setMessage,
          }}
        />
      ) : (
        <p>Phonebook empty</p>
      )}{" "}
    </div>
  );
};

export default App;
