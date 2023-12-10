import personsService from "../services/persons";

/* eslint-disable react/prop-types */

const Notification = ({ message }) => {
  const notificationStyle = {
    borderColor: message.type === "warning" ? "red" : "green",
    borderStyle: "solid",
    borderWidth: "3px",
    color: message.type === "warning" ? "red" : "green",
    backgroundColor: "azure",
    padding: "15px",
  };
  return <p style={notificationStyle}>{message.text}</p>;
};
const Form = ({ props }) => {
  const {
    newName,
    setNewName,
    newNumber,
    setNewNumber,
    setPersons,
    setFilteredPersons,
    message,
    setMessage,
  } = props;

  async function handleSubmit(e) {
    e.preventDefault();
    const newPerson = {
      name: newName.trim(),
      number: newNumber.trim(),
    };
    // eslint-disable-next-line no-unused-vars
    const [existingPerson, ...rest] = await personsService.getByName(
      newName.trim(),
    );
    personsService
      .create(newPerson)
      .then((response) => {
        console.log(response);
        setMessage({
          type: "success",
          text: `${newPerson.name} has been created!`,
        });
        setTimeout(() => {
          setMessage({ type: null, text: "" });
        }, 2000);
        personsService.getAll().then((response) => {
          console.log(response.data);
          setPersons(response.data);
          //handle situation where searchForm has entry, filtered results should be updated without reload
          const searchForm = document.querySelector("#searchForm");
          if (searchForm.value) {
            setFilteredPersons(
              response.data.filter((person) =>
                person.name
                  .toLowerCase()
                  .includes(searchForm.value.toLowerCase()),
              ),
            );
          }
        });
      })
      .catch((error) => {
        console.error(error);
        setMessage({
          type: "warning",
          text: `There has been a problem adding ${newPerson.name}: ${error.response.data.error} `,
        });
        setTimeout(() => {
          setMessage({ type: null, text: "" });
        }, 2000);
      });
  }

  const handleChange = (fn) => (e) => {
    const myFunc = fn(e.target.value);
    return myFunc;
  };

  return (
    <form onSubmit={handleSubmit}>
      {message.type && <Notification message={message} />}
      <div>
        name:{" "}
        <input
          placeholder="Add a new person"
          value={newName}
          onChange={handleChange(setNewName)}
        />
      </div>
      <div>
        number:{" "}
        <input
          placeholder="Add phone number"
          value={newNumber}
          onChange={handleChange(setNewNumber)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default Form;
