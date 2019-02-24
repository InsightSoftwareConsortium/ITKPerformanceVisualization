import React, { Component } from 'react'
import Button from '../../src/Components/Button'
import "../../src/static/scss/NavBar.css"

export default class NavBar extends Component {
  render() {
    return (
      <div className="NavBar">
        <Button color="Green">Upload Data</Button>
      </div>
    )
  }
}
