import React from "react"

const values = {
    clear: 0,
    active: 1,
    completed: 2,
    error: 3
  }

  const init = {
    value: values.clear,
    message: ""
  }

const getColor = (value) => {
  switch (value) {
    case values.active: return "blue"
    case values.completed: return "green"
    case values.error: return "red"
    default: return "pink"
  }
}

  const renderStatus = (status, clearStatus) => {
    switch (status.value) {
      case values.active:
        return (
          <div className="notification is-info">
            <p>
              <span className="element is-loading" />
              <span>{status.message}. Please wait!</span>
            </p>
          </div>
        )
      case values.completed:
        return (
          <div className="notification is-success">
            <button className="delete" onClick={clearStatus}></button>
              <span>Action completed. {status.message}</span>
          </div>
        )
      case values.error:
        return (
          <div className="notification is-danger">
            <button className="delete" onClick={clearStatus}></button>
            <span className="has-text-white"><strong>Something happened.</strong> {status.message}</span>
          </div>
        )
      default:
        return (<></>)
    }
  }

  export default {values, init, getColor, renderStatus}