'use strict';

var utils = require('../utils');

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getPictureElement = function(data, container) {
  var templatePicture = document.querySelector('#picture-template');
  var pictureElement = utils.getTemplate(templatePicture, '.picture', true);

  pictureElement.querySelector('.picture-comments').textContent = data.comments;
  pictureElement.querySelector('.picture-likes').textContent = data.likes;

  var image = new Image('182', '182');
  var replaceImage = pictureElement.querySelector('img');
  var imageLoadTimeout;

  image.onload = function() {
    clearTimeout(imageLoadTimeout);
    pictureElement.replaceChild(image, replaceImage);
  };

  image.onerror = function() {
    pictureElement.classList.add('picture-load-failure');
  };

  image.src = data.url;

  imageLoadTimeout = setTimeout(function() {
    image.src = '';
    pictureElement.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  container.appendChild(pictureElement);
  return pictureElement;
};

module.exports = getPictureElement;
