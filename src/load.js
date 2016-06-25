'use strict';

var SERVER_LOAD_TIMEOUT = 10000;

/**
 * Получение данных с сервера и обработка событий
 * @param {function} callback
 */
var load = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.timeout = SERVER_LOAD_TIMEOUT;

  xhr.onload = function(evt) {
    if (evt.target.status !== 200) {
      callback(true);
    } else {
      var loadedData = JSON.parse(evt.target.response);
      callback(false, loadedData);
    }
  };

  xhr.ontimeout = function() {
    callback(true);
  };

  xhr.open('GET', url);
  xhr.send();
};

module.exports = load;
