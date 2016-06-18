'use strict';

(function() {
  var filtersContainer = document.querySelector('.filters');
  var picturesContainer = document.querySelector('.pictures');

  filtersContainer.classList.add('hidden');

  /** @constant {number} */
  var IMAGE_LOAD_TIMEOUT = 10000;

  /** @constant {string} */
  var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

  /** @type {Array.<Object>} */
  var pictures = [];

  /** @enum {number} */
  var Filter = {
    'POPULAR': 'filter-popular',
    'NEW': 'filter-new',
    'DISCUSSED': 'filter-discussed'
  };

  /** @constant {Filter} */
  var DEFAULT_FILTER = Filter.POPULAR;

  /**
   * @param {Object} data
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  var getPictureElement = function(data, container) {
    var template = document.querySelector('#picture-template');
    var templateContent = 'content' in template ? template.content : template;
    var pictureElement = templateContent.querySelector('.picture').cloneNode(true);

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

  var getPictures = function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;

    xhr.onloadstart = function() {
      picturesContainer.classList.add('pictures-loading');
    };

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
      picturesContainer.classList.remove('pictures-loading');
    };

    xhr.onerror = function() {
      picturesContainer.classList.remove('pictures-loading');
      picturesContainer.classList.add('pictures-failure');
    };

    xhr.ontimeout = function() {
      picturesContainer.classList.remove('pictures-loading');
      picturesContainer.classList.add('pictures-failure');
    };

    xhr.open('GET', PICTURES_LOAD_URL);
    xhr.send();
  };

  var renderPictures = function(loadedPictures) {
    picturesContainer.innerHTML = '';

    loadedPictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };

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
        var templateErrorContent = 'content' in templateError ? templateError.content : templateError;
        var errorElement = templateErrorContent.querySelector('.error-no-elements').cloneNode(true);
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

  var setFilterEnabled = function(filter) {
    var filteredPictures = getFilteredPictures(pictures, filter);
    renderPictures(filteredPictures);

    var activeFilter = filtersContainer.querySelector(':checked');
    if (activeFilter) {
      activeFilter.removeAttribute('checked');
    }
    var filterToActivate = document.getElementById(filter);
    filterToActivate.checked = true;
  };

  var setFiltersEnabled = function(enabled) {
    var filters = filtersContainer.querySelectorAll('.filters-radio');
    for (var i = 0; i < filters.length; i++) {
      filters[i].onclick = enabled ? function() {
        setFilterEnabled(this.id);
      } : null;
    }
  };

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setFiltersEnabled(true);
    setFilterEnabled(DEFAULT_FILTER);
  });

  filtersContainer.classList.remove('hidden');
})();
