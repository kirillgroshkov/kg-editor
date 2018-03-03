import Vue from 'vue'

// based on:
// https://github.com/simplesmiler/vue-focus/blob/master/index.js

Vue.directive('focus', {
  inserted (el, b) {
    // alert('inserted!')
    // console.log('inserted: ', el, b)

    if (b.value) {
      // console.log('focusing: ', el)
      el.focus()

      // To make vue-material understand that we want to focus it!
      triggerEvent(el, 'keyup')
    } else {
      // console.log('blurring: ', el)
      el.blur()
    }
  },

  /*componentUpdated (el, b) {
    // if (b.modifiers.lazy) {
      if (Boolean(b.value) === Boolean(b.oldValue)) return
    // }
    // console.log('updated: ', el, b)

    if (b.value) {
      // console.log('focusing: ', el)
      el.focus()
    } else {
      // console.log('blurring: ', el)
      el.blur()
    }
  },*/
})

function triggerEvent (el: HTMLElement, type: string): void {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

/*
Vue.directive('focus-class', {
  inserted (el, b) {
    const focused = document.activeElement === el
    console.log('insss: ' + focused, el, b)
    el.classList.toggle(b.value, focused)
  },

  componentUpdated (el, b) {
    console.log('upddddd: ', el, b)
  },
})
*/
