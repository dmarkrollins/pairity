/* eslint-disable react/prop-types */
import React from 'react'

export default class TextArea extends React.Component {
    render() {
        return (
            <div className="pure-u-1">
                <label>{this.props.label}</label>
                <textarea onChange={event => this.props.onChange(event.target.value)} >
                    {this.props.value}
                </textarea>
                <p className="errorMessage">{this.props.errorMessage}</p>
            </div>
        )
    }
}

module.exports = { TextArea }
