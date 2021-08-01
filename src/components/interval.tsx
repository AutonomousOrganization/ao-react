import * as React from 'react'
import { observer } from 'mobx-react'
import aoStore from '../client/store'
import api from '../client/api'
import { HudStyle } from './cardHud'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'

interface Props {
  taskId: string
  hudStyle: HudStyle
}

interface State {
  text: string
  error?: boolean
}

@observer
export default class AoInterval extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    const card = aoStore.hashMap.get(this.props.taskId)
    if (card) {
      this.state = {
        text: card.claimInterval > 0 ? card.claimInterval.toString() : '',
      }
    } else {
      this.state = { text: '' }
    }

    this.saveValue = this.saveValue.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  saveValue() {
    event.stopPropagation()
    if (this.state.text.length < 1) {
      return
    }
    const taskId = this.props.taskId
    const card = aoStore.hashMap.get(taskId)
    if (!card) {
      return
    }
    let newValue = parseFloat(this.state.text)
    if (newValue === card.claimInterval) {
      return
    }
    if (newValue !== NaN) {
      api.setClaimInterval(taskId, newValue)
    }
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      event.stopPropagation()
      this.saveValue()
    } else if (event.key === 'Escape') {
      event.stopPropagation()
      this.setState({ text: '' })
    }
  }

  onChange(event) {
    this.setState({ text: event.target.value })
    const days = parseFloat(event.target.value)
    if (days === NaN) {
      this.setState({ error: true })
    } else {
      this.setState({ error: false })
    }
  }

  render() {
    const card = aoStore.hashMap.get(this.props.taskId)
    if (!card) {
      return null
    }
    switch (this.props.hudStyle) {
      case 'menu':
        const changedAndValid =
          !this.state.error &&
          parseFloat(this.state.text) !== card.claimInterval
        return (
          <div className="username">
            uncheck every{' '}
            <input
              type="text"
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              value={this.state.text}
              size={2}
              autoFocus
            />{' '}
            hours
            <button
              type="button"
              className="action inline"
              onClick={this.saveValue}
              disabled={!changedAndValid}>
              Set
            </button>
          </div>
        )
      default:
        if (!card.claimInterval || card.claimInterval <= 0) {
          return null
        }
        return (
          <div className="claimInterval">
            <Tippy
              placement="top"
              delay={[475, 200]}
              theme="translucent"
              content={
                'checkmarks will clear every ' + card.claimInterval + ' hours'
              }
              appendTo={document.getElementById('root')}>
              <div className="interval">reset</div>
            </Tippy>
          </div>
        )
    }
  }
}
