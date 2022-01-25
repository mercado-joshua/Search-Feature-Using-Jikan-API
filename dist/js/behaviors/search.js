"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// make sure the page is loaded before firing any event
document.addEventListener('readystatechange', function (event) {
  if (event.target.readyState === 'complete') searchAnime();
}); // delays the execution of a function used as argument

var debounce = function debounce(fn) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1500;
  var id;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (id) clearTimeout(id);
    id = setTimeout(function () {
      fn.apply(void 0, args);
    }, delay);
  };
}; // build the url


var buildRequestURL = function buildRequestURL(url, keyword) {
  return "".concat(url, "/search/anime?q=").concat(keyword, "&page=1");
}; // renders the page base from the result got from the API


var renderResults = function renderResults(animeList) {
  var container = document.querySelector('[data-js-anime-section]');
  container.innerHTML = '';
  var animeTypes = animeList.reduce(function (accumulator, anime) {
    var type = anime.type;
    if (accumulator[type] === undefined) accumulator[type] = [];
    accumulator[type].push(anime);
    return accumulator;
  }, {});
  Object.keys(animeTypes).map(function (key) {
    var animes = animeTypes[key].sort(function (a, b) {
      return a.episodes - b.episodes;
    }).map(function (anime) {
      return "\n            <div class=\"anime-card\">\n                <div class=\"imagebox\">\n                    <img src=\"".concat(anime.image_url, "\" alt=\"\" class=\"image\">\n                </div>\n            </div>\n            ");
    }).join('');
    var typeSection = "\n            <div class=\"category-section\">\n                <div class=\"headerbox\">\n                    <h3>".concat(key.toUpperCase(), "</h3>\n                    <div class=\"linebar\"></div>\n                </div>\n                <div class=\"anime-list\">").concat(animes, "</div>\n            </div>\n        ");
    container.insertAdjacentHTML('beforeend', typeSection);
  }).join('');
}; // get the data from the fetch API


var getData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var response, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(url);

          case 3:
            response = _context.sent;

            if (response.ok) {
              _context.next = 6;
              break;
            }

            throw new Error("Failed to fetch posts: ".concat(response.status));

          case 6:
            _context.next = 8;
            return response.json();

          case 8:
            data = _context.sent;
            renderResults(data.results); // [4]

            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            renderResults([]);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function getData(_x) {
    return _ref.apply(this, arguments);
  };
}();

var startSearch = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, keyword) {
    var requestURL;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            requestURL = buildRequestURL(url, keyword); // [2]

            _context2.next = 3;
            return getData(requestURL);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function startSearch(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var searchAnime = function searchAnime() {
  var baseURL = 'https://api.jikan.moe/v3';
  var searchbar = document.querySelector('[data-js-search]');
  searchbar.addEventListener('keyup', debounce(function (event) {
    if (event.target.value.trim().length === 0) return;
    startSearch(baseURL, event.target.value); // [1]
  }));
};