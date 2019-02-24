import React, { Component } from 'react'
import "../../src/static/scss/Button.css"

export default class Button extends Component {
  render() {
    return (
      <button className={this.props.color + "Button"}>
          {this.props.children}
      </button>
    )
  }
}
