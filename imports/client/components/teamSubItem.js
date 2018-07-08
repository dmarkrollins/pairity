import { Random } from 'meteor/random'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { _ } from 'meteor/underscore'

import { Pairity, Teams } from '../../../imports/lib/pairity'

class TeamSubItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: Object.assign({}, this.props.list),
            selectedItem: '',
            showAddItem: false,
            textValue: ''
        };
        this.handleItemAdd = this.handleItemAdd.bind(this)
        this.handleItemRemove = this.handleItemRemove.bind(this)
        this.handleItemSelected = this.handleItemSelected.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.itemChange = this.itemChange.bind(this)
    }

    handleItemAdd(event) {
        let { showAddItem } = this.state

        showAddItem = !showAddItem

        this.setState({ showAddItem })

        if (showAddItem === true) {
            const input = this.refs.newItemInput

            setTimeout(function () {
                input.focus()
            }, 300)
        }
    }

    handleItemRemove() {
        let { selectedItem } = this.state

        if (selectedItem === '') {
            return
        }

        this.props.handleRemove(selectedItem)

        selectedItem = ''

        this.setState({ selectedItem })
    }

    handleItemSelected(value, isSelected) {
        let { selectedItem } = this.state
        if (isSelected) {
            selectedItem = value
            this.setState({ selectedItem })
        }
    }

    subItems() {
        const items = []
        this.props.list.forEach((item) => {
            const className = item.value === this.state.selectedItem ? 'selected-item' : 'unselected-item'
            const selected = item.value === this.state.selectedItem
            const newItem = (<Pairity.Components.TeamSubListItem
                handleSelected={this.handleItemSelected}
                label={item.label}
                value={item.value}
                key={Random.id()}
                selected={selected}
                className={className}
            />)
            items.push(newItem)
        })
        return items
    }

    removeStyle() {
        const style = {}
        style.fontSize = '1.5em'
        style.color = this.state.selectedItem !== '' ? '#659BB9' : '#ccc'
        return style
    }

    removeClass() {
        return this.state.selectedItem !== '' ? '' : 'disabled'
    }

    addItemClass() {
        const hidden = this.state.showAddItem ? '' : 'hidden'

        return `pure-form pure-form-horizontal ${hidden}`
    }

    saveItem(event) {
        if (event.charCode === 13) {
            if (this.state.textValue.length > 0) {
                this.props.handleSave(this.state.textValue)
                this.setState({ textValue: '' })
            }
        }
    }

    itemChange(event) {
        const textValue = event.target.value.toProperCase()
        this.setState({ textValue })
    }

    render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1">
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <label>{this.props.label} [{this.props.list.length}]</label>
                        <div style={{
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '7px',
                            height: '32px'
                        }}>
                            <a id="btnAdd" href="#" onClick={this.handleItemAdd}>
                                <i className="fa fa-plus-circle" style={{ fontSize: '1.5em', color: '#659BB9', marginRight: '21px' }} />
                            </a>
                            <a id="btnRemove" href="#" onClick={this.handleItemRemove} className={this.removeClass()} >
                                <i className="fa fa-minus-circle" style={this.removeStyle()} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <div className={this.addItemClass()} style={{ marginBottom: '7px' }} >
                            <input ref="newItemInput" onKeyPress={this.saveItem} onChange={this.itemChange} value={this.state.textValue} type="text" placeholder="Enter new item, press enter" style={{ width: '100%', maxWidth: '500px' }} />
                        </div>
                        <div className="item-box">
                            {this.subItems()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

TeamSubItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired
}

module.exports = TeamSubItem
