import pathMatch from 'path-match'
import { Stream } from '@most/types'
import useRouterStream from './router-stream'
const pMatch = pathMatch({
  // path-to-regexp options
  sensitive: false,
  strict: false,
  end: false
})

export interface UrlEvent {
  oldUrl: String
  newUrl: String
}

type Route = (event: UrlEvent) => Boolean

export default class Router {
  routes: Array<Route>
  pathMatch: Function
  stream: Stream<Event>
  constructor() {
    this.routes = []
    this.handleChange = this.handleChange.bind(this)
    this.match = this.match.bind(this)
    useRouterStream(this.handleChange)
  }
  handleChange({ newUrl: longNewUrl, oldUrl: longOldUrl }: UrlEvent) {
    const newUrl = longNewUrl
      .split('/')
      .slice(3)
      .join('/')
    const oldUrl = longOldUrl
      .split('/')
      .slice(3)
      .join('/')
    for (let i = 0; i < this.routes.length; i++) {
      if (this.routes[i]({ newUrl, oldUrl })) break
    }
  }
  match(pattern: String, onMatch: (event: UrlEvent, params: Object) => void) {
    const match = pMatch(pattern)
    const route = function({ newUrl, oldUrl }) {
      const params = match(newUrl)
      if (params === false) {
        return false
      } else {
        onMatch({ newUrl, oldUrl }, params)
        return true
      }
    }
    this.routes.push(route.bind(this))
  }
}
