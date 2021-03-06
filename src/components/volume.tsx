import * as React from 'react'
import { observer } from 'mobx-react'
import aoStore from '../client/store'
import api from '../client/api'
import Muted from '../assets/images/muted.svg'
import Unmuted from '../assets/images/unmuted.svg'

@observer
export default class AoVolume extends React.PureComponent<{}> {
  constructor(props) {
    super(props)
    this.toggleMute = this.toggleMute.bind(this)
  }

  pendingPromises = []

  toggleMute() {
    if (aoStore.member.muted) {
      api.unmute()
    } else {
      api.mute()
    }
  }

  render() {
    if (!aoStore.member) {
      return null
    }

    return (
      <div id="volume" onClick={this.toggleMute} className="action">
        <img src={aoStore.member.muted ? Muted : Unmuted} />
        <span>{aoStore.member.muted ? 'Unmute' : 'Mute'}</span>
      </div>
    )
  }
}
