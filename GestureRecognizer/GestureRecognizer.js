import React, { Component } from 'react'
import {
  GestureRecognizerStatePossible,
  GestureRecognizerStateBegan,
  GestureRecognizerStateChanged,
  GestureRecognizerStateEnded
} from './constants'

import Touch from '../Touch-2'

import { autobind } from 'core-decorators'

export default class GestureRecognizer extends Component {
  static defaultProps = {
    isEnabled: true
  }

  action = null
  view = null
  numberOfTouches = 0
  gestureState = GestureRecognizerStatePossible
  isEnabled = true
  touches = []

  // frequency control
  interval = 1
  intervalSteps = this.interval

  events = {
    onMouseDown: this.touchesBegan,
    onMouseMove: this.touchesMoved,
    onMouseUp: this.touchesEnded,
    onTouchStart: this.touchesBegan,
    onTouchMove: this.touchesMoved,
    onTouchEnd: this.touchesEnded
  }

  shouldSample() {
    if (this.intervalSteps > 0) {
      this.intervalSteps --
      return false
    }
    this.intervalSteps = this.interval
    return true
  }

  @autobind
  touchesBegan(e) {
    if (! this.props.isEnabled) return
    this.gestureState = GestureRecognizerStateBegan
    this.touches = [new Touch]
    this.touches[0].update(e)
    console.log(this.touches[0])
    this.began(this.touches, e)
    // this.evaluate(touches) && this.action(this)
    this.props.action(this)
  }

  @autobind
  touchesMoved(e) {
    if (! this.props.isEnabled) return
    if (this.gestureState == GestureRecognizerStatePossible) return
    if (this.gestureState == GestureRecognizerStateEnded) return
    this.touches[0].update(e)
    this.moved(this.touches, e)

    this.gestureState = GestureRecognizerStatePossible
    if (this.evaluate(this.touches)) {
      this.gestureState = GestureRecognizerStateChanged
      this.props.action(this)
    }
  }

  @autobind
  touchesEnded(e) {
    if (! this.props.isEnabled) return
    this.gestureState = GestureRecognizerStateEnded
    this.touches[0].update(e)
    this.ended(this.touches, e)
    this.props.action(this)
    this.reset()
  }

  began(touches, e) {
  }

  moved(touches, e) {
  }

  ended(touches, e) {
  }

  reset() {
    this.gestureState = GestureRecognizerStatePossible
    this.touches = []
  }

  render() {
    return (
      <div className="PanGestureRecognizer" {...this.events}>
        {this.props.children}
      </div>
    )
  }
}
