import $ from 'jquery'
import navigation from './js/navigation.js'
import './style/main.scss'

window.$ = $

$(document).ready(function ($) {
  navigation.init()
})
