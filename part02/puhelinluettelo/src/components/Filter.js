const Filter = (props) => {
    return (
        <div>
          Filter shown with:  <input
                                value={props.filterValue}
                                onChange={props.handleFilterChange}
                              />
        </div>
    )
}

export default Filter