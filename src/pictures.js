'use strict';

var utils = require('./utils');
var load = require('./load');

var getPictureElement = require('./pictures/picture');

var Filter = require('./filter/filter-type');
var getFilteredPictures = require('./filter/filter');

var filtersContainer = document.querySelector('.filters');
var picturesContainer = document.querySelector('.pictures');

var PICTURES_URL = '//o0.github.io/assets/json/pictures.json';

filtersContainer.classList.add('hidden');

/** @constant {number} */
var PAGE_SIZE = 12;

/** @type {number} */
var pageNumber = 0;

/** @type {Array.<Object>} */
var pictures = [];

/** @type {Array.<Object>} */
var filteredPictures = [];

/** @constant {Filter} */
var DEFAULT_FILTER = Filter.POPULAR;

var renderPictures = function(loadedPictures, page, replace) {
  if (replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  loadedPictures.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

var addPictures = function() {
  while (utils.isBottomReached() && utils.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
    renderPictures(filteredPictures, ++pageNumber, false);
  }
};

var setFilterEnabled = function(filter) {
  filteredPictures = getFilteredPictures(pictures, filter);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);

  addPictures();

  var activeFilter = filtersContainer.querySelector(':checked');
  if (activeFilter) {
    activeFilter.removeAttribute('checked');
  }
  var filterToActivate = document.getElementById(filter);
  filterToActivate.checked = true;
};

var setFiltersEnabled = function() {
  filtersContainer.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.id);
    }
  });
};

var optimizedScroll = utils.throttle(function() {
  if(utils.isBottomReached() && utils.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber, false);
  }
}, 100);

var setScrollEnabled = function() {
  window.addEventListener('scroll', optimizedScroll);
};

var setResizeEnabled = function() {
  window.addEventListener('resize', function() {
    addPictures();
  });
};

picturesContainer.classList.add('pictures-loading');

load(PICTURES_URL, function(error, loadedPictures) {
  picturesContainer.classList.remove('pictures-loading');
  if (error) {
    picturesContainer.classList.add('pictures-failure');
  } else {
    pictures = loadedPictures;
    setFiltersEnabled();
    setFilterEnabled(DEFAULT_FILTER);
    setScrollEnabled();
    setResizeEnabled();
  }
});

filtersContainer.classList.remove('hidden');
