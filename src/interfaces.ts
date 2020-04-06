// import { Stream } from 'xstream'
import { Stream } from '@most/types'
import { DOMSource, VNode } from '@cycle/dom'
import { StateSource, Reducer } from '@cycle/state'
import { RouterSource, HistoryInput } from 'cyclic-router'

export { Reducer } from '@cycle/state'

export type Component<State> = (s: Sources<State>) => Sinks<State>

export interface Sources<State> {
  DOM: DOMSource
  router: RouterSource
  // state: StateSource<State>
}

export interface Sinks<State> {
  DOM?: Stream<VNode>
  router?: Stream<HistoryInput>
  // state?: Stream<Reducer<State>>
}
