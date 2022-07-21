const PersonForm = (props) => {
    return (
      <form onSubmit={props.handleSubmit}>
          <div>
            Name: <input
                    value={props.nameValue}
                    onChange={props.handleNameChange}
                    required
                  />
          </div>
          <div>
            Number: <input
                    value={props.numberValue}
                    onChange={props.handleNumberChange}
                    required
                  />
          </div>
          <div>
            <button type="submit">Add</button>
          </div>
        </form>
    )
  }

export default PersonForm
