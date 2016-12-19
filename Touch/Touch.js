import {
  TouchPhaseBegan,
  TouchPhaseMoved,
  TouchPhaseEnded
} from './constants'

import { first, nth } from '../Shortcuts'

export default class Touch {
  view = null
  window = null
  timestamp = 0
  locations = []
  phase = TouchPhaseBegan
  gestureRecognizers = []
  rads = []

  update(e) {
    this.phase = TouchPhaseMoved
    this.timestamp = Date.now()

    switch (true) {
      // wheel
      // case e.nativeEvent instanceof WheelEvent:
      //   if (! this.previousLocation()) {
      //     this.locations.push({
      //       t: this.timestamp,
      //       x: e.pageX - e.deltaX,
      //       y: e.pageY - e.deltaY
      //     })
      //     break
      //   }
      //
      //   this.locations.push({
      //     t: this.timestamp,
      //     x: this.previousLocation().x - e.deltaX,
      //     y: this.previousLocation().y - e.deltaY
      //   })
      //   break
      // mouse
      case e.nativeEvent instanceof MouseEvent:
        this.locations.push({
          t: this.timestamp,
          x: e.pageX,
          y: e.pageY
        })
        break

      // touch
      case e.nativeEvent instanceof TouchEvent:
        this.locations.push({
          t: this.timestamp,
          x: first(e.nativeEvent.touches).pageX,
          y: first(e.nativeEvent.touches).pageY
        })
        break
    }

    this._computeRads()
  }

  leave() {
    this.phase = TouchPhaseEnded
  }

  location() {
    return nth(this.locations, -1)
  }

  previousLocation() {
    return nth(this.locations, -2)
  }

  originalLocation() {
    return first(this.locations)
  }

  _computeRads() {
    let ratio = this._computeRatio(
      this.previousLocation(),
      this.location()
    )

    if (isNaN(ratio)) return 0

    if (ratio == Infinity) this.rads.push(0.5) // 向下90度
    if (ratio == -Infinity) this.rads.push(-0.5) // 向上90度
    this.rads.push(Math.tanh(ratio) / Math.PI)
  }

  _computeRatio(a, b) {
    if (! a || ! b) return NaN
    return (b.y - a.y) / (b.x - a.x)
  }
}
