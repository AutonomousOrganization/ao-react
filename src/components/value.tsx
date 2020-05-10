import * as React from 'react'
import { observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import aoStore, { AoState } from '../client/store'
import api from '../client/api'
import { ObservableMap } from 'mobx'
import { delay, cancelablePromise, noop } from '../utils'

interface State {
  editing: boolean
  text: string
}

export type ValueStyle = 'full' | 'collapsed' | 'mini' | 'menu'

export const defaultState: State = {
  editing: false,
  text: ''
}

interface ValueParams {
  taskId: string
  cardStyle?: ValueStyle
}

@observer
export default class AoValue extends React.Component<ValueParams, State> {
  constructor(props) {
    super(props)
    this.state = defaultState
    this.startEditing = this.startEditing.bind(this)
    this.saveValue = this.saveValue.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  startEditing(event) {
    event.stopPropagation()
    console.log(
      'value is ',
      aoStore.hashMap.get(this.props.taskId).completeValue
    )
    if (aoStore.hashMap.get(this.props.taskId).completeValue) {
      console.log('has a value')
      this.setState({
        text: aoStore.hashMap.get(this.props.taskId).completeValue.toString()
      })
    }
    this.setState({ editing: true })
  }

  saveValue(event) {
    event.stopPropagation()
    console.log('save Value', event.target.value)
    let newValue: number =
      this.state.text.length > 0 ? parseInt(this.state.text, 10) : 0
    if (newValue !== NaN) {
      api.valueCard(this.props.taskId, newValue)
      this.setState({ editing: false })
    }
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      this.saveValue(event)
    }
  }

  onChange(event) {
    console.log('on change', event.target.value)
    this.setState({ text: event.target.value })
  }

  render() {
    if (this.state.editing) {
      return (
        <div className="value">
          <input
            type="text"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={this.state.text}
            size={1}
            autoFocus
          />
          <button type="button" onClick={this.saveValue}>
            Set Value
          </button>
        </div>
      )
    }
    switch (this.props.cardStyle) {
      case 'full':
        return (
          <div onClick={this.startEditing} className={'value full action'}>
            {aoStore.hashMap.get(this.props.taskId).completeValue
              ? aoStore.hashMap.get(this.props.taskId).completeValue + ' points'
              : '+value'}
          </div>
        )
      case 'mini':
        if (aoStore.hashMap.get(this.props.taskId).completeValue) {
          return (
            <span className={'miniValue'}>
              {aoStore.hashMap.get(this.props.taskId).completeValue}
            </span>
          )
        }
        return null
      case 'menu':
        return (
          <div className={'value'}>
            <div onClick={this.startEditing} className={'action'}>
              {aoStore.hashMap.get(this.props.taskId).completeValue
                ? 'worth ' +
                  aoStore.hashMap.get(this.props.taskId).completeValue +
                  ' points if checked'
                : 'set checkmark value'}
            </div>
          </div>
        )
      case 'collapsed':
      default:
        if (aoStore.hashMap.get(this.props.taskId).completeValue > 0) {
          return (
            <div className={'value collapsed'}>
              <div className={'action'}>
                {aoStore.hashMap.get(this.props.taskId).completeValue}
              </div>
            </div>
          )
        }
        return null
    }
  }
}
