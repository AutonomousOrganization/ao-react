import * as React from 'react'
import { computed, comparer, reaction, observable } from 'mobx'
import { observer, Observer } from 'mobx-react'
import aoStore from '../client/store'
import { Task } from '../interfaces'
import api from '../client/api'
import AoHome from './home'
import AoHopper from './hopper'
import AoGem from './gem'
import AoGrid from './grid'
import AoPopupPanel from './popupPanel'
import { gloss } from '../semantics'
import _ from 'lodash'

interface State {
  bookmarksTaskId?: string
  renderMeNowPlease?: boolean
}

@observer
export default class AoDock extends React.Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  executeOnUnmount_list = []
  componentDidMount() {
    const dockCardName = aoStore.member.memberId + '-bookmarks'
    // let myBookmarks =
    aoStore.getTaskByName_async(dockCardName, myBookmarks => {
      // console.log('myBookmarks is', myBookmarks)
      if (myBookmarks) {
        this.setState({ bookmarksTaskId: myBookmarks.taskId })
      }
    })

    // here we want to track the subCards and rerender when they change
    let unMountReactionFunction = reaction(
      () => {
        // console.log("AO: client/store.ts: bookmarksCard computing")
        let bookmarksTaskId = aoStore.bookmarksTaskId
        let card = aoStore.hashMap.get(bookmarksTaskId)
        let bookmarkedCardsData = []
        // card.grid.rows.forEach
        //     ( (row, y) =>
        //       {
        //         row.forEach
        //             ( (cell, x) =>
        //               { bookmarkedCardsData.push({y, x, cell})
        //               }
        //             )
        //       }
        //     )
        return bookmarkedCardsData
      },
      bookmarkedCardsData => {
        // console.log("AO: components/dock.tsx: gridChangedReaction: actionPhase")
        this.setState({ renderMeNowPlease: true })
      },
      { equals: comparer.structural }
    )
    this.executeOnUnmount_list.push(unMountReactionFunction)
  }

  componentWillUnmount() {
    // this.executeOnUnmount_list.forEach ( fn => fn() );
  }

  render() {
    // console.log("AO: components/dock.tsx: AoDock: render", {"props": this.props, "state": this.state})

    const card = aoStore.hashMap.get(this.state.bookmarksTaskId)
    if (!card) {
      return null
    }
    const hasBookmarksCard =
      card && _.has(card, 'grid.rows') && card?.grid?.height >= 1

    if (!hasBookmarksCard) {
      return null
    }
    return (
      <div id="dock">
        <AoHopper />
        <AoGem />
        <div id="dock-tour">
          <Observer>
            {() => {
              return (
                <AoGrid
                  taskId={this.state.bookmarksTaskId}
                  height={card.grid.height}
                  width={card.grid.width}
                  size={card.grid?.size || 9}
                  gridStyle="grid"
                />
              )
            }}
          </Observer>
        </div>
      </div>
    )
  }
}
