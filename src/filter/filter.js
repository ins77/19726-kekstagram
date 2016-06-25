'use strict';

var Filter = require('./filter-type');
var utils = require('../utils');

var getFilteredPictures = function(loadedPictures, filter) {
  var picturesToFilter = loadedPictures.slice(0);

  var showErrorTemplate = function() {
    var upload = document.querySelector('.upload');
    var uploadError = upload.querySelectorAll('.error-no-elements');
    if (uploadError[0]) {
      upload.removeChild(uploadError[0]);
    }
    if (picturesToFilter.length === 0) {
      var templateError = document.querySelector('#error-template');
      var errorElement = utils.getTemplate(templateError, '.error-no-elements', true);
      upload.appendChild(errorElement);
    }
  };

  switch (filter) {
    case Filter.POPULAR:
      break;
    case Filter.NEW:
      picturesToFilter = picturesToFilter.filter(function(a) {
        var lastFourDays = 4 * 24 * 60 * 60 * 1000;
        var dateImg = new Date(a.date);
        return dateImg >= (Date.now() - lastFourDays) && dateImg < Date.now();
      });
      picturesToFilter = picturesToFilter.sort(function(a, b) {
        return (new Date(b.date) - new Date(a.date));
      });
      break;
    case Filter.DISCUSSED:
      picturesToFilter = picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }

  showErrorTemplate();

  return picturesToFilter;
};

module.exports = getFilteredPictures;
