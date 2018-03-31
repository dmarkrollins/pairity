/* eslint-disable react/prop-types */
import React from 'react'

export default class TextInput extends React.Component {
    render() {
        return (
            <div className="pure-u-1">
                <label>{this.props.label}</label>
                <input
                    type="text"
                    value={this.props.value}
                    onChange={event => this.props.onChange(event.target.value)}
                />
                <p className="errorMessage">{this.props.errorMessage}</p>
            </div>
        )
    }
}
