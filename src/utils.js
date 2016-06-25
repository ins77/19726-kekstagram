'use strict';

module.exports = {

/**
 * Установка события с задержкой, которое вызывает переданную функцию
 * раз в нужное количество миллисекунд.
 * @param {function} callback
 * @param {number} ms
 * @return {function}
 */
  throttle: function(callback, delay) {
    var lastCall = Date.now();
    return function() {
      if (Date.now() - lastCall >= delay) {
        callback();
        lastCall = Date.now();
      }
    };
  },

  isBottomReached: function() {
    var GAP = 100;
    var bodyPosition = document.body.getBoundingClientRect();
    return bodyPosition.bottom - window.innerHeight - GAP <= 0;
  },

  isNextPageAvailable: function(loadedPictures, page, pageSize) {
    return page < Math.ceil(loadedPictures.length / pageSize);
  },

 /**
   * Проверка поддержки браузером эелемента <template>
   * и возвращение соответствующего объекта
   * @param {object} template
   * @param {string} selector
   * @return {object}
   */
  getTemplate: function(template, selector, clone) {
    if ('content' in template) {
      if (clone) {
        return template.content.querySelector(selector).cloneNode(true);
      } else {
        return template.content.querySelector(selector);
      }
    } else {
      if (clone) {
        return template.querySelector(selector).cloneNode(true);
      } else {
        return template.querySelector(selector);
      }
    }
  }

};
