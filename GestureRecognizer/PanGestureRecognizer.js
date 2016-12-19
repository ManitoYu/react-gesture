import GestureRecognizer from './GestureRecognizer'
import { pointMake, first, size } from '../Shortcuts'
import { override } from 'core-decorators'

export default class PanGestureRecognizer extends GestureRecognizer {
  translation = pointMake(0, 0)
  velocity = pointMake(0, 0)

  setTranslation(translation) {
    this.translation = translation
  }

  @override
  began(touches, e) {
    first(touches).gestureRecognizers.push(this)
    this.numberOfTouches = 1
  }

  @override
  moved(touches, e) {
    let touch = first(touches)

    let prevLocation = touch.previousLocation()
    let curLocation = touch.location()

    if (this.translation.x == 0 && this.translation.y == 0) {
      this.setTranslation(pointMake(
        curLocation.x - prevLocation.x,
        curLocation.y - prevLocation.y
      ))
    } else {
      this.setTranslation(pointMake(
        e.pageX - touch.originalLocation().x,
        e.pageY - touch.originalLocation().y
      ))
    }

    this.velocity = pointMake(
      (curLocation.x - prevLocation.x) / (curLocation.t - prevLocation.t) * 1000,
      (curLocation.y - prevLocation.y) / (curLocation.t - prevLocation.t) * 1000
    )
  }

  @override
  ended(touches, e) {
    if (! first(touches)) return
    first(touches).leave()
    this.numberOfTouches = 0
    // this.moved(e)
  }

  evaluate(touches) {
    let touch = first(touches)
    let avgRads = touch.rads.reduce((a, v) => a += v / size(touch.rads), 0)

    // XXX no any movements
    // if (avgRads == 0) return false

    if (size(touch.rads) == 0) return false
    return avgRads < .5
  }
}
