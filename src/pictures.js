'use strict';

(function() {
  var filters = document.querySelector('.filters');
  var picturesContainer = document.querySelector('.pictures');

  filters.classList.add('hidden');

  /** @constant {number} */
  var IMAGE_LOAD_TIMEOUT = 10000;

  /**
   * @param {Object} data
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  var getPicturesElement = function(data, container) {
    var template = document.querySelector('#picture-template');
    var templateContent = 'content' in template ? template.content : template;
    var pictureElement = templateContent.querySelector('.picture').cloneNode(true);

    pictureElement.querySelector('.picture-comments').textContent = data.comments;
    pictureElement.querySelector('.picture-likes').textContent = data.likes;

    container.appendChild(pictureElement);

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

    return pictureElement;
  };

  window.pictures.forEach(function(hotel) {
    getPicturesElement(hotel, picturesContainer);
  });

  filters.classList.remove('hidden');
})();
