import GestureRecognizer from './GestureRecognizer'
import { first, size } from '../Shortcuts'

export default class TapGestureRecognizer extends GestureRecognizer {
  began(touches, e) {
    let touch = first(touches)
    touch.gestureRecognizers.push(this)
    this.numberOfTouches = 1
  }

  ended(touches, e) {
    if (! first(touches)) return
    first(touches).leave()
    this.numberOfTouches = 0
    // this.moved(e)
  }

  evaluate(touches) {
    let touch = first(touches)
    return size(touch.rads) == 0
  }
}
