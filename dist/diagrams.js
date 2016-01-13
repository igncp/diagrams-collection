/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	_diagrams2['default'].utils = __webpack_require__(2);
	_diagrams2['default'].events = _diagrams2['default'].utils.createAnEventEmitter();
	_diagrams2['default'].shared = __webpack_require__(3);
	_diagrams2['default'].shapes = __webpack_require__(4);
	_diagrams2['default'].svg = __webpack_require__(5);
	_diagrams2['default'].Diagram = __webpack_require__(6)();
	
	_.each(['Box', 'Graph', 'Layer'], function (diagramName) {
	  return __webpack_require__(7)("./" + diagramName + '/index')();
	});
	
	window.diagrams = _diagrams2['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = {};
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var utils = {
	  applySimpleTransform: function applySimpleTransform(el) {
	    el.attr('transform', function (d) {
	      return 'translate(' + d.x + ',' + d.y + ')';
	    });
	  },
	
	  codeBlockOfLanguageFn: function codeBlockOfLanguageFn(language) {
	    var commentsSymbol = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	
	    return function (codeBlock, where, withInlineStrs) {
	      if (withInlineStrs === true) {
	        codeBlock = commentsSymbol + ' ...\n' + codeBlock + '\n' + commentsSymbol + ' ...';
	      }
	
	      if (_.isString(where)) codeBlock = commentsSymbol + ' @' + where + '\n' + codeBlock;
	
	      return '``' + language + '``' + codeBlock + '``';
	    };
	  },
	
	  composeWithEventEmitter: function composeWithEventEmitter(constructor) {
	    var _subjects = {};
	    var createName = function createName(name) {
	      return '$' + name;
	    };
	    var dispose = function dispose(prop) {
	      if (({}).hasOwnProperty.call(_subjects, prop)) {
	        _subjects[prop].dispose();
	        _subjects[prop] = null;
	      }
	    };
	
	    constructor.prototype.emit = function (name, data) {
	      var fnName = createName(name);
	
	      _subjects[fnName] = _subjects[fnName] || new Rx.Subject();
	      _subjects[fnName].onNext(data);
	    };
	
	    constructor.prototype.listen = function (name, handler) {
	      var fnName = createName(name);
	
	      _subjects[fnName] = _subjects[fnName] || new Rx.Subject();
	
	      return _subjects[fnName].subscribe(handler);
	    };
	
	    constructor.prototype.unlisten = function (name) {
	      var fnName = createName(name);
	
	      dispose(fnName);
	    };
	
	    constructor.prototype.dispose = function () {
	      for (var prop in _subjects) {
	        dispose(prop);
	      }_subjects = {};
	    };
	  },
	
	  createAnEventEmitter: function createAnEventEmitter() {
	    var constructor = function EventEmitter() {};
	
	    utils.composeWithEventEmitter(constructor);
	
	    return new constructor();
	  },
	
	  d3DefaultReturnFn: function d3DefaultReturnFn(props, preffix, suffix) {
	    props = props.split('.');
	
	    return function (d) {
	      var position = _.reduce(props, function (memo, property) {
	        return memo[property];
	      }, d);
	
	      return preffix || suffix ? preffix + position + suffix : position;
	    };
	  },
	
	  dataFromGeneralToSpecificForATreeStructureType: function dataFromGeneralToSpecificForATreeStructureType(generalData) {
	    // FPN: Find Parent Node
	    var FPNRecursiveFailed = false;
	    var itemsIdToItemsMap = {};
	    var nodesData = {};
	    var findParentNodeFn = function findParentNodeFn() {
	      var itemsChecked = undefined;
	      var itemsIdToFromConnectionMap = {};
	      var FPNRecursiveFn = function FPNRecursiveFn(item) {
	        var connection = undefined,
	            parentItemId = undefined,
	            parentItem = undefined;
	
	        if (itemsChecked.indexOf(item) > -1) {
	          FPNRecursiveFailed = true;
	
	          return;
	        } else itemsChecked.push(item);
	
	        if (_.isUndefined(itemsIdToFromConnectionMap[item.id]) === false) {
	          connection = itemsIdToFromConnectionMap[item.id];
	        } else {
	          connection = _.where(generalData.connections, {
	            from: item.id
	          });
	          itemsIdToFromConnectionMap[item.id] = connection;
	        }
	
	        if (connection.length === 0) {
	          if (parentNode) {
	            if (parentNode.id !== item.id) FPNRecursiveFailed = true;
	          } else parentNode = item;
	        } else if (connection.length === 1) {
	          parentItemId = connection[0].to;
	
	          if (_.isUndefined(itemsIdToItemsMap[parentItemId]) === false) {
	            parentItem = itemsIdToItemsMap[parentItemId];
	          } else {
	            parentItem = _.where(generalData.items, {
	              id: parentItemId
	            })[0];
	            itemsIdToItemsMap[parentItemId] = parentItem;
	          }
	          FPNRecursiveFn(parentItem);
	        } else FPNRecursiveFailed = true;
	      };
	
	      _.each(generalData.items, function (item) {
	        if (FPNRecursiveFailed === false) {
	          itemsChecked = [];
	          itemsIdToItemsMap[item.id] = item;
	          FPNRecursiveFn(item);
	        }
	      });
	    };
	    var buildNodesDataRecursiveFn = function buildNodesDataRecursiveFn(transformedData, item) {
	      var text = undefined,
	          children = undefined;
	
	      transformedData.id = item.id;
	      text = item.name;
	
	      if (item.description) text += ': ' + item.description;
	      transformedData.text = text;
	
	      children = _.where(generalData.connections, {
	        to: item.id
	      });
	
	      if (children.length > 0) {
	        transformedData.items = [];
	        _.each(children, function (child) {
	          transformedData.items.push({});
	          buildNodesDataRecursiveFn(_.last(transformedData.items), itemsIdToItemsMap[child.from]);
	        });
	      }
	    };
	    var parentNode = undefined;
	
	    findParentNodeFn();
	
	    if (FPNRecursiveFailed) {
	      alert('The data structure is not suitable for this diagram');
	
	      return [];
	    } else {
	      buildNodesDataRecursiveFn(nodesData, parentNode);
	
	      return nodesData;
	    }
	  },
	
	  formatShortDescription: function formatShortDescription(text) {
	    text = text.replace(/<p>/g, '');
	    text = text.replace(/<br>/g, ' ');
	    text = text.replace(/<\/p>/g, '. ');
	    text = utils.replaceCodeFragmentOfText(text, function (_ref) {
	      var codeBlock = _ref.codeBlock;
	      var matchStr = _ref.matchStr;
	
	      if (matchStr === text && /\n/.test(matchStr) === false) return codeBlock;else {
	        return ' <CODE...>';
	      }
	    });
	
	    return text;
	  },
	
	  formatTextFragment: function formatTextFragment(text) {
	    var tagsToEncode = ['strong', 'code', 'pre', 'br', 'span', 'p'];
	    var encodeOrDecodeTags = function encodeOrDecodeTags(action, tag) {
	      var encodeOrDecodeTagsWithAction = _.partial(encodeOrDecodeTags, action);
	      var beginningTagArr = ['<' + tag + '(.*?)>', '<' + tag + '$1>', tag + 'DIAGSA(.*?)DIAGSB' + tag + 'DIAGSC', tag + 'DIAGSA$1DIAGSB' + tag + 'DIAGSC'];
	      var endingTagReal = '</' + tag + '>';
	      var endingTagFake = tag + 'ENDREPLACEDDIAGRAMS';
	      var endingTagArr = [endingTagReal, endingTagReal, endingTagFake, endingTagFake];
	      var replaceText = function replaceText(from, to) {
	        text = text.replace(new RegExp(from, 'g'), to);
	      };
	
	      if (_.isArray(tag)) _.each(tag, encodeOrDecodeTagsWithAction);else {
	        _.each([beginningTagArr, endingTagArr], function (arr) {
	          if (action === 'encode') replaceText(arr[0], arr[3]);else if (action === 'decode') replaceText(arr[2], arr[1]);
	        });
	      }
	    };
	
	    text = utils.replaceCodeFragmentOfText(text, function (_ref2) {
	      var allMatches = _ref2.allMatches;
	      var codeBlock = _ref2.codeBlock;
	      var language = _ref2.language;
	      var matchStr = _ref2.matchStr;
	
	      var lastMatch = matchStr === _.last(allMatches);
	
	      return '<pre' + (lastMatch ? ' class="last-code-block" ' : '') + '><code>' + (hljs.highlight(language, codeBlock).value + '</pre></code>');
	    });
	
	    encodeOrDecodeTags('encode', tagsToEncode);
	    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    encodeOrDecodeTags('decode', tagsToEncode);
	
	    return text;
	  },
	
	  generateATextDescriptionStr: function generateATextDescriptionStr(text, description) {
	    var descriptionText = description ? '<br>' + description : '';
	
	    return '<strong>' + text + '</strong>' + descriptionText;
	  },
	
	  getUrlParams: function getUrlParams() {
	    var query_string = {};
	    var query = window.location.search.substring(1);
	    var vars = query.split("&");
	
	    for (var i = 0; i < vars.length; i++) {
	      var pair = vars[i].split("=");
	
	      if (typeof query_string[pair[0]] === "undefined") {
	        query_string[pair[0]] = decodeURIComponent(pair[1]);
	      } else if (typeof query_string[pair[0]] === "string") {
	        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
	
	        query_string[pair[0]] = arr;
	      } else {
	        query_string[pair[0]].push(decodeURIComponent(pair[1]));
	      }
	    }
	
	    return query_string;
	  },
	
	  joinWithLastDifferent: function joinWithLastDifferent(arr, separator, lastSeparator) {
	    return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1];
	  },
	
	  positionFn: function positionFn(props, offset) {
	    offset = offset || 0;
	
	    return utils.d3DefaultReturnFn(props, 0, offset);
	  },
	
	  replaceCodeFragmentOfText: function replaceCodeFragmentOfText(text, predicate) {
	    var codeRegex = /``([\s\S]*?)``([\s\S]*?)``/g;
	    var allMatches = text.match(codeRegex);
	
	    return text.replace(codeRegex, function (matchStr, language, codeBlock) {
	      return predicate({ allMatches: allMatches, codeBlock: codeBlock, language: language, matchStr: matchStr });
	    });
	  },
	
	  runIfReady: function runIfReady(fn) {
	    if (document.readyState === 'complete') fn();else window.onload = fn;
	  },
	
	  textFn: function textFn(props, preffix, suffix) {
	    preffix = preffix || '';
	    suffix = suffix || '';
	
	    return utils.d3DefaultReturnFn(props, preffix, suffix);
	  },
	
	  // This function is created to be able to reference it in the diagrams
	  wrapInParagraph: function wrapInParagraph(text) {
	    return '<p>' + text + '</p>';
	  }
	};
	
	utils.commasAndAndJoin = _.partial(utils.joinWithLastDifferent, _, ', ', ' and ');
	
	exports['default'] = utils;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _arguments = arguments;
	var shared = {
	  get: function get(key) {
	    shared.throwIfSharedMethodAlreadyExists(key);
	
	    return shared[key];
	  },
	
	  getWithStartingBreakLine: function getWithStartingBreakLine() {
	    return '<br>' + shared.get.apply(shared, _arguments);
	  },
	
	  set: function set(data) {
	    shared.throwIfSharedMethodAlreadyExists(data);
	
	    for (var prop in data) {
	      if (data.hasOwnProperty(prop)) shared[prop] = data[prop];
	    }
	  },
	
	  throwIfSharedMethodAlreadyExists: function throwIfSharedMethodAlreadyExists(data) {
	    var keys = undefined;
	
	    if (_.isObject(data)) {
	      keys = Object.keys(data);
	      _.each(keys, shared.throwIfSharedMethodAlreadyExists);
	    } else if (_.isString(data)) {
	      if (shared[methodsVarName].indexOf(data) > 0) throw new Error('Reserved keyword: ' + data);
	    }
	  }
	};
	
	var methodsVarName = 'builtInMethods';
	
	shared[methodsVarName] = _.keys(shared).concat(methodsVarName);
	
	exports['default'] = shared;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var shapes = {
	  hexagon: function hexagon(opts) {
	    var halfHeight = opts.height / 2;
	    var halfWidth = opts.width / 2;
	    var gap = opts.widthPercent ? (1 - opts.widthPercent / 100) * opts.width : (opts.width - opts.height) / 2;
	    var center = opts.center || [halfWidth, halfHeight];
	
	    var _center = _slicedToArray(center, 2);
	
	    var cx = _center[0];
	    var cy = _center[1];
	
	    return 'M' + (cx - halfWidth) + ',' + cy + ('L' + (cx - halfWidth + gap) + ',' + (cy + halfHeight)) + ('L' + (cx + halfWidth - gap) + ',' + (cy + halfHeight)) + ('L' + (cx + halfWidth) + ',' + cy) + ('L' + (cx + halfWidth - gap) + ',' + (cy - halfHeight)) + ('L' + (cx - halfWidth + gap) + ',' + (cy - halfHeight)) + 'Z';
	  }
	};
	
	exports['default'] = shapes;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var addEllipsis = function addEllipsis(_ref) {
	  var self = _ref.self;
	  var text = _ref.text;
	  var textLength = _ref.textLength;
	  var width = _ref.width;
	
	  while (textLength > width && text.length > 0) {
	    text = text.slice(0, -4);
	    self.text(text + '...');
	    textLength = self.node().getComputedTextLength();
	  }
	};
	
	var appendElsToFilterColor = function appendElsToFilterColor(_ref2) {
	  var deviation = _ref2.deviation;
	  var filter = _ref2.filter;
	  var slope = _ref2.slope;
	
	  filter.append('feOffset').attr({
	    dx: 0.5,
	    dy: 0.5,
	    'in': 'SourceGraphic',
	    result: 'offOut'
	  });
	  filter.append('feGaussianBlur').attr({
	    'in': 'offOut',
	    result: 'blurOut',
	    stdDeviation: deviation
	  });
	  filter.append('feBlend').attr({
	    'in': 'SourceGraphic',
	    in2: 'blurOut',
	    mode: 'normal'
	  });
	  filter.append('feComponentTransfer').append('feFuncA').attr({
	    slope: slope,
	    type: 'linear'
	  });
	};
	
	var svg = {
	  addFilterColor: function addFilterColor(_ref3) {
	    var container = _ref3.container;
	    var deviation = _ref3.deviation;
	    var extra = _ref3.extra;
	    var id = _ref3.id;
	    var slope = _ref3.slope;
	
	    var defs = container.append('defs');
	    var filter = defs.append('filter').attr({
	      id: 'diagrams-drop-shadow-' + id
	    });
	
	    if (extra) filter.attr({
	      height: '500%',
	      width: '500%',
	      x: '-200%',
	      y: '-200%'
	    });
	
	    appendElsToFilterColor({ deviation: deviation, filter: filter, slope: slope });
	  },
	
	  addVerticalGradientFilter: function addVerticalGradientFilter(container, id, colors) {
	    var defs = container.append('defs');
	    var linearGradient = defs.append('linearGradient').attr({
	      id: id,
	      x1: '0%',
	      x2: '0%',
	      y1: '0%',
	      y2: '100%'
	    });
	
	    linearGradient.append('stop').attr('offset', '0%').style({
	      'stop-color': colors[0],
	      'stop-opacity': 1
	    });
	    linearGradient.append('stop').attr('offset', '100%').style({
	      'stop-color': colors[1],
	      'stop-opacity': 1
	    });
	  },
	
	  generateSvg: function generateSvg(style) {
	    var selector = svg.getDiagramWrapperStr();
	    var bodyDims = document.body.getBoundingClientRect();
	
	    return d3.select(selector).append('svg').attr({
	      height: 4000,
	      width: bodyDims.width - 40
	    }).style(style);
	  },
	
	  insertInBodyBeforeSvg: function insertInBodyBeforeSvg(tag) {
	    var diagramWrapper = svg.getDiagramWrapperStr();
	    var body = d3.select('body');
	    var elementAfterName = diagramWrapper === 'body' ? 'svg' : diagramWrapper;
	    var el = body.insert(tag, elementAfterName);
	
	    return el;
	  },
	
	  textEllipsis: function textEllipsis(width) {
	    return function () {
	      var self = d3.select(this);
	      var textLength = self.node().getComputedTextLength();
	      var text = self.text();
	
	      addEllipsis({ self: self, text: text, textLength: textLength, width: width });
	    };
	  },
	
	  updateHeigthOfElWithOtherEl: function updateHeigthOfElWithOtherEl(el, otherEl, offset) {
	    el.attr({
	      height: otherEl[0][0].getBoundingClientRect().height + (offset || 0)
	    });
	  }
	};
	
	svg.getDiagramWrapperStr = function () {
	  return _diagrams2['default'].diagramsWrapperSelector || 'body';
	};
	
	svg.fullscreenElement = function () {
	  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	};
	
	svg.selectScreenHeightOrHeight = function (height) {
	  return _diagrams2['default'].svg.fullscreenElement() ? screen.height - 30 : height;
	};
	
	exports['default'] = svg;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _svg = __webpack_require__(5);
	
	var _svg2 = _interopRequireDefault(_svg);
	
	var _ref = _;
	var bind = _ref.bind;
	var defaults = _ref.defaults;
	var each = _ref.each;
	var isFunction = _ref.isFunction;
	var isObject = _ref.isObject;
	var isString = _ref.isString;
	var merge = _ref.merge;
	var where = _ref.where;
	
	var defaultDiagramConfiguration = {};
	var createdDiagramsMaxId = 0;
	
	_diagrams2['default'].diagramsRegistry = [];
	
	var Diagram = (function () {
	  _createClass(Diagram, null, [{
	    key: 'convertDiagram',
	    value: function convertDiagram(creationId, toDiagramType) {
	      var item = Diagram.getRegistryItemWithCreationId(creationId);
	      var newArgs = item.data.slice(1);
	      var generalData = undefined,
	          specificData = undefined;
	
	      generalData = item.diagram.dataFromSpecificToGeneral.apply({}, newArgs);
	      specificData = _diagrams2['default'][toDiagramType].dataFromGeneralToSpecific.apply({}, [generalData]);
	
	      _diagrams2['default'].events.emit('diagram-to-transform', item.diagram);
	
	      Diagram.removePreviousDiagrams();
	      _diagrams2['default'][toDiagramType].apply(item.diagram, [specificData]);
	    }
	  }, {
	    key: 'removePreviousDiagrams',
	    value: function removePreviousDiagrams() {
	      d3.selectAll('input.diagrams-diagram-button').remove();
	      d3.select('svg').remove();
	    }
	  }, {
	    key: 'addDivBeforeSvg',
	    value: function addDivBeforeSvg() {
	      var div = _svg2['default'].insertInBodyBeforeSvg('div');
	
	      div.appendButtonToDiv = function (cls, value, onclick) {
	        div.append('input').attr({
	          'class': cls + ' diagrams-diagram-button btn btn-default',
	          onclick: onclick,
	          type: 'button',
	          value: value
	        });
	      };
	
	      return div;
	    }
	  }, {
	    key: 'getRegistryItemWithCreationId',
	    value: function getRegistryItemWithCreationId(creationId) {
	      var items = where(_diagrams2['default'].diagramsRegistry, {
	        id: creationId
	      });
	
	      return items.length === 1 ? items[0] : null;
	    }
	  }, {
	    key: 'getDataWithCreationId',
	    value: function getDataWithCreationId(creationId) {
	      var item = Diagram.getRegistryItemWithCreationId(creationId);
	
	      return item ? item.data : null;
	    }
	  }]);
	
	  function Diagram(opts) {
	    _classCallCheck(this, Diagram);
	
	    var diagram = this;
	    var prototype = Object.getPrototypeOf(diagram);
	
	    diagram.name = opts.name;
	    diagram._configuration = opts.configuration || {};
	
	    prototype.configurationKeys = opts.configurationKeys || {};
	
	    each(Object.keys(opts.helpers), function (helperName) {
	      if (isFunction(opts.helpers[helperName])) {
	        opts.helpers[helperName] = bind(opts.helpers[helperName], diagram);
	      }
	    });
	    merge(diagram._configuration, defaultDiagramConfiguration);
	    each(Object.keys(diagram._configuration), function (confKey) {
	      diagram.configCheckingLocalStorage(confKey, diagram._configuration[confKey]);
	    });
	    defaults(prototype, opts.helpers);
	    diagram.register();
	  }
	
	  _createClass(Diagram, [{
	    key: 'reRender',
	    value: function reRender() {
	      return null;
	    }
	  }, {
	    key: 'addMouseListenersToEl',
	    value: function addMouseListenersToEl(el, data, callbacks) {
	      var diagram = this;
	      var emitFn = function emitFn(d3Event, emitedEvent) {
	        emitedEvent = emitedEvent || d3Event;
	        el.on(d3Event, function () {
	          diagram.emit(emitedEvent, emitContent);
	
	          if (callbacks && callbacks[d3Event]) callbacks[d3Event](emitContent);
	        });
	      };
	      var emitContent = { data: data, el: el };
	
	      emitFn('mouseleave');
	      emitFn('mouseenter');
	      emitFn('click', 'itemclick');
	    }
	  }, {
	    key: 'removePreviousAndCreate',
	    value: function removePreviousAndCreate() {
	      var diagram = this;
	
	      Diagram.removePreviousDiagrams();
	      diagram.addConversionButtons();
	      diagram.create.apply(diagram, arguments);
	    }
	  }, {
	    key: 'config',
	    value: function config(opts, optValue) {
	      var argsLength = arguments.length;
	      var optsType = typeof opts;
	      var optsKey = undefined;
	
	      if (argsLength === 0) return this._configuration;else if (argsLength === 1) {
	        if (isFunction(optsType)) optsKey = opts();else if (isString(opts)) optsKey = opts;else if (isObject(opts)) {
	          for (var key in opts) {
	            if (opts.hasOwnProperty(key)) this.config(key, opts[key]);
	          }
	
	          return opts;
	        }
	
	        return this._configuration[optsKey];
	      } else if (argsLength === 2) {
	        this._configuration[opts] = optValue;
	
	        if (isObject(optValue)) this.setToLocalStorage(opts, optValue.value);else this.setToLocalStorage(opts, optValue);
	
	        this.emit('configuration-changed', {
	          key: opts,
	          value: optValue
	        });
	
	        return optValue;
	      }
	    }
	  }, {
	    key: 'configCheckingLocalStorage',
	    value: function configCheckingLocalStorage(key, defaultValue) {
	      var diagram = this;
	      var finalValue = diagram.getFromLocalStorage(key, defaultValue);
	
	      diagram.config(key, finalValue);
	    }
	  }, {
	    key: 'generateLocalStorageKeyPreffix',
	    value: function generateLocalStorageKeyPreffix(originalKey) {
	      return 'diagramsjs-' + originalKey;
	    }
	  }, {
	    key: 'getFromLocalStorage',
	    value: function getFromLocalStorage(originalKey, defaultItem) {
	      var diagram = this;
	      var getAndConvertStrBoolean = function getAndConvertStrBoolean(defaultValue) {
	        var rv = localStorage.getItem(diagram.generateLocalStorageKeyPreffix(originalKey)) || defaultValue;
	
	        if (rv === 'false') rv = false;else if (rv === 'true') rv = true;
	
	        return rv;
	      };
	      var finalValue = defaultItem;
	
	      if (localStorage && localStorage.getItem) {
	        if (isObject(finalValue)) {
	          finalValue.value = getAndConvertStrBoolean(finalValue.value);
	
	          if (finalValue.type) finalValue.value = finalValue.type(finalValue.value);
	        } else finalValue = getAndConvertStrBoolean(finalValue);
	      }
	
	      return finalValue;
	    }
	  }, {
	    key: 'setToLocalStorage',
	    value: function setToLocalStorage(originalKey, value) {
	      var diagram = this;
	
	      if (localStorage && localStorage.setItem) {
	        return localStorage.setItem(diagram.generateLocalStorageKeyPreffix(originalKey), value);
	      }
	    }
	  }, {
	    key: 'generateEmptyRelationships',
	    value: function generateEmptyRelationships(item) {
	      item.relationships = {};
	      item.relationships.dependants = [];
	      item.relationships.dependencies = [];
	    }
	  }, {
	    key: 'addDependantRelationship',
	    value: function addDependantRelationship(item, el, data) {
	      item.relationships.dependants.push(this.generateRelationship(el, data));
	    }
	  }, {
	    key: 'addSelfRelationship',
	    value: function addSelfRelationship(item, el, data) {
	      item.relationships.self = this.generateRelationship(el, data);
	    }
	  }, {
	    key: 'addDependencyRelationship',
	    value: function addDependencyRelationship(item, el, data) {
	      item.relationships.dependencies.push(this.generateRelationship(el, data));
	    }
	  }, {
	    key: 'generateRelationship',
	    value: function generateRelationship(el, data) {
	      return { data: data, el: el };
	    }
	  }, {
	    key: 'getAllRelatedItemsOfItem',
	    value: function getAllRelatedItemsOfItem(item, relationshipType) {
	      var diagram = this;
	      var relatedItems = [];
	      var depthThresold = 100;
	      var recursiveFn = function recursiveFn(relatedItemData, depth) {
	        each(relatedItemData.relationships[relationshipType], function (relatedItemChild) {
	          if (depth < depthThresold) {
	            // Handle circular loops
	            if (relatedItems.indexOf(relatedItemChild) < 0 && relatedItemChild.data !== relatedItemData) {
	              relatedItems.push(relatedItemChild);
	              recursiveFn(relatedItemChild.data, depth + 1);
	            }
	          }
	        });
	      };
	      var returnObj = undefined;
	
	      if (relationshipType) {
	        recursiveFn(item, 0);
	
	        return relatedItems;
	      } else {
	        returnObj = {};
	        each(['dependants', 'dependencies'], function (relationshipName) {
	          returnObj[relationshipName] = diagram.getAllRelatedItemsOfItem(item, relationshipName);
	        });
	
	        return returnObj;
	      }
	    }
	  }, {
	    key: 'markRelatedItems',
	    value: function markRelatedItems(item, opts) {
	      var relatedItemsGroup = undefined;
	      var diagram = this;
	      var pushToRelatedItemsGroup = function pushToRelatedItemsGroup(args) {
	        relatedItemsGroup.push(diagram.getAllRelatedItemsOfItem.apply(diagram, _toConsumableArray([item].concat(args))));
	      };
	
	      opts = opts || {};
	
	      if (diagram.markRelatedFn && item.relationships) {
	        relatedItemsGroup = [];
	
	        if (opts.filter) pushToRelatedItemsGroup([opts.filter]);else each([['dependants'], ['dependencies']], pushToRelatedItemsGroup);
	
	        each(relatedItemsGroup, function (relatedItems) {
	          each(relatedItems, diagram.markRelatedFn);
	        });
	
	        diagram.markRelatedFn(item.relationships.self);
	      }
	    }
	  }, {
	    key: 'handleDiagramId',
	    value: function handleDiagramId() {
	      createdDiagramsMaxId++;
	      this.diagramId = createdDiagramsMaxId;
	    }
	  }, {
	    key: 'addToDiagramsRegistry',
	    value: function addToDiagramsRegistry(creationArgs) {
	      _diagrams2['default'].diagramsRegistry.push({
	        data: creationArgs,
	        diagram: this,
	        id: createdDiagramsMaxId
	      });
	    }
	  }, {
	    key: 'register',
	    value: function register() {
	      var _this = this;
	
	      var diagram = this;
	
	      _diagrams2['default'].diagramTypes = _diagrams2['default'].diagramTypes || [];
	      _diagrams2['default'].diagramTypes.push(diagram.name);
	      _diagrams2['default'][diagram.name] = function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }
	
	        _diagrams2['default'].utils.runIfReady(function () {
	          var creationArgs = [createdDiagramsMaxId].concat(args);
	
	          _this.handleDiagramId();
	          _this.addToDiagramsRegistry(creationArgs);
	          diagram.addConversionButtons();
	          diagram.create.apply(diagram, _toConsumableArray(creationArgs));
	          _diagrams2['default'].events.emit('diagram-created', diagram);
	        });
	      };
	
	      defaults(_diagrams2['default'][diagram.name], Object.getPrototypeOf(diagram));
	    }
	  }, {
	    key: 'addConversionButtons',
	    value: function addConversionButtons() {
	      var diagram = this;
	      var div = Diagram.addDivBeforeSvg();
	      var onClickFn = undefined;
	
	      each(_diagrams2['default'].diagramTypes, function (diagramType) {
	        if (diagramType !== diagram.name) {
	          onClickFn = 'diagrams.Diagram.convertDiagram(' + diagram.diagramId + ', \'' + diagramType + '\')';
	          div.appendButtonToDiv('diagrams-box-conversion-button', 'To ' + diagramType + ' diagram', onClickFn);
	        }
	      });
	    }
	  }]);
	
	  return Diagram;
	})();
	
	var getDiagramClass = function getDiagramClass() {
	  _diagrams2['default'].utils.composeWithEventEmitter(Diagram);
	
	  return Diagram;
	};
	
	exports['default'] = getDiagramClass;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Box/helpers/index": 8,
		"./Box/index": 28,
		"./Graph/helpers/index": 29,
		"./Graph/index": 47,
		"./Layer/helpers/index": 48,
		"./Layer/index": 67
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 7;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _addBodyItemsAndUpdateHeights = __webpack_require__(9);
	
	var _addBodyItemsAndUpdateHeights2 = _interopRequireDefault(_addBodyItemsAndUpdateHeights);
	
	var _addButtons = __webpack_require__(10);
	
	var _addButtons2 = _interopRequireDefault(_addButtons);
	
	var _collapseAll = __webpack_require__(11);
	
	var _collapseAll2 = _interopRequireDefault(_collapseAll);
	
	var _collapseItem = __webpack_require__(14);
	
	var _collapseItem2 = _interopRequireDefault(_collapseItem);
	
	var _convertToGraph = __webpack_require__(16);
	
	var _convertToGraph2 = _interopRequireDefault(_convertToGraph);
	
	var _convertToLayer = __webpack_require__(17);
	
	var _convertToLayer2 = _interopRequireDefault(_convertToLayer);
	
	var _dataFromGeneralToSpecific = __webpack_require__(18);
	
	var _dataFromGeneralToSpecific2 = _interopRequireDefault(_dataFromGeneralToSpecific);
	
	var _dataFromSpecificToGeneral = __webpack_require__(19);
	
	var _dataFromSpecificToGeneral2 = _interopRequireDefault(_dataFromSpecificToGeneral);
	
	var _expandAll = __webpack_require__(20);
	
	var _expandAll2 = _interopRequireDefault(_expandAll);
	
	var _expandItem = __webpack_require__(15);
	
	var _expandItem2 = _interopRequireDefault(_expandItem);
	
	var _expandOrCollapseAll = __webpack_require__(12);
	
	var _expandOrCollapseAll2 = _interopRequireDefault(_expandOrCollapseAll);
	
	var _filterByString = __webpack_require__(21);
	
	var _filterByString2 = _interopRequireDefault(_filterByString);
	
	var _generateContainer = __webpack_require__(22);
	
	var _generateContainer2 = _interopRequireDefault(_generateContainer);
	
	var _generateDefinition = __webpack_require__(25);
	
	var _generateDefinition2 = _interopRequireDefault(_generateDefinition);
	
	var _generateDefinitionWithSharedGet = __webpack_require__(26);
	
	var _generateDefinitionWithSharedGet2 = _interopRequireDefault(_generateDefinitionWithSharedGet);
	
	var _generateItem = __webpack_require__(23);
	
	var _generateItem2 = _interopRequireDefault(_generateItem);
	
	var _generateLink = __webpack_require__(27);
	
	var _generateLink2 = _interopRequireDefault(_generateLink);
	
	var _parseItemGenerationOptions = __webpack_require__(24);
	
	var _parseItemGenerationOptions2 = _interopRequireDefault(_parseItemGenerationOptions);
	
	var _traverseBodyDataAndRefresh = __webpack_require__(13);
	
	var _traverseBodyDataAndRefresh2 = _interopRequireDefault(_traverseBodyDataAndRefresh);
	
	var helpers = {
	  addBodyItemsAndUpdateHeights: _addBodyItemsAndUpdateHeights2['default'],
	  addButtons: _addButtons2['default'],
	  collapseAll: _collapseAll2['default'],
	  collapseItem: _collapseItem2['default'],
	  convertToGraph: _convertToGraph2['default'],
	  convertToLayer: _convertToLayer2['default'],
	  dataFromGeneralToSpecific: _dataFromGeneralToSpecific2['default'],
	  dataFromSpecificToGeneral: _dataFromSpecificToGeneral2['default'],
	  expandAll: _expandAll2['default'],
	  expandItem: _expandItem2['default'],
	  expandOrCollapseAll: _expandOrCollapseAll2['default'],
	  filterByString: _filterByString2['default'],
	  generateContainer: _generateContainer2['default'],
	  generateDefinition: _generateDefinition2['default'],
	  generateDefinitionWithSharedGet: _generateDefinitionWithSharedGet2['default'],
	  generateItem: _generateItem2['default'],
	  generateLink: _generateLink2['default'],
	  parseItemGenerationOptions: _parseItemGenerationOptions2['default'],
	  traverseBodyDataAndRefresh: _traverseBodyDataAndRefresh2['default']
	};
	
	exports['default'] = helpers;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var fn = null;
	
	/**
	 * Provides a placeholder to set the refresh function of the diagram
	 */
	exports["default"] = {
	  get: function get() {
	    return fn;
	  },
	  set: function set(newFn) {
	    return fn = newFn;
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	exports['default'] = function (creationId) {
	  var div = _diagrams2['default'].Diagram.addDivBeforeSvg();
	
	  div.appendButtonToDiv('diagrams-box-collapse-all-button', 'Collapse all', 'diagrams.box.collapseAll(' + creationId + ')');
	  div.appendButtonToDiv('diagrams-box-expand-all-button', 'Expand all', 'diagrams.box.expandAll(' + creationId + ')');
	};
	
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _expandOrCollapseAll = __webpack_require__(12);
	
	var _expandOrCollapseAll2 = _interopRequireDefault(_expandOrCollapseAll);
	
	exports['default'] = function (creationId) {
	  (0, _expandOrCollapseAll2['default'])(creationId, 'collapse');
	};
	
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _traverseBodyDataAndRefresh = __webpack_require__(13);
	
	var _traverseBodyDataAndRefresh2 = _interopRequireDefault(_traverseBodyDataAndRefresh);
	
	var _collapseItem = __webpack_require__(14);
	
	var _collapseItem2 = _interopRequireDefault(_collapseItem);
	
	var _expandItem = __webpack_require__(15);
	
	var _expandItem2 = _interopRequireDefault(_expandItem);
	
	var _ref = _;
	var partial = _ref.partial;
	
	var methods = {
	  collapseItem: _collapseItem2['default'],
	  expandItem: _expandItem2['default']
	};
	
	var traverseBodyOpts = {
	  withCollapsedItems: true
	};
	
	var itemCanBeCollapsedOrExpanded = function itemCanBeCollapsedOrExpanded(item) {
	  return item.hasOwnProperty('collapsed');
	};
	
	var expandOrCollapseItem = function expandOrCollapseItem(collapseOrExpand, item) {
	  if (itemCanBeCollapsedOrExpanded(item)) {
	    methods[collapseOrExpand + 'Item'](item);
	  }
	};
	
	exports['default'] = function (creationId, collapseOrExpand) {
	  (0, _traverseBodyDataAndRefresh2['default'])(creationId, traverseBodyOpts, partial(expandOrCollapseItem, collapseOrExpand));
	};
	
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _addBodyItemsAndUpdateHeights = __webpack_require__(9);
	
	var _addBodyItemsAndUpdateHeights2 = _interopRequireDefault(_addBodyItemsAndUpdateHeights);
	
	var _ref = _;
	var each = _ref.each;
	
	var recursiveFn = function recursiveFn(_ref2) {
	  var cb = _ref2.cb;
	  var items = _ref2.items;
	  var opts = _ref2.opts;
	  var parents = _ref2.parents;
	
	  each(items, function (item) {
	    if (cb) cb(item, parents);
	
	    if (item.items) recursiveFn({ cb: cb, items: item.items, opts: opts, parents: parents.concat(item) });
	
	    if (opts.withCollapsedItems && item.collapsedItems) recursiveFn({ cb: cb, items: item.collapsedItems, opts: opts, parents: parents.concat(item) });
	  });
	};
	
	exports['default'] = function (creationId, opts, cb) {
	  var conf = _diagrams2['default'].Diagram.getDataWithCreationId(creationId)[1];
	  var bodyData = conf.body;
	
	  opts = opts || {};
	
	  opts.withCollapsedItems = opts.withCollapsedItems || false;
	  recursiveFn({ cb: cb, items: bodyData, opts: opts, parents: [] });
	  _addBodyItemsAndUpdateHeights2['default'].get()();
	};
	
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports["default"] = function (item) {
	  if (item.items.length > 0) {
	    item.collapsedItems = item.items;
	    item.collapsed = true;
	    item.items = [];
	  }
	};
	
	module.exports = exports["default"];

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports["default"] = function (item) {
	  if (item.collapsedItems) {
	    item.items = item.collapsedItems;
	    delete item.collapsedItems;
	    item.collapsed = false;
	  }
	};
	
	module.exports = exports["default"];

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports["default"] = function (origConf) {
	  console.log("origConf", origConf);
	};
	
	module.exports = exports["default"];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _ref = _;
	var each = _ref.each;
	var isString = _ref.isString;
	
	var convertDataToLayers = function convertDataToLayers(items) {
	  each(items, function (item, index) {
	    if (isString(item)) {
	      item = items[index] = {
	        text: item
	      };
	    }
	
	    if (item.description) item.text += ': ' + item.description;
	
	    if (item.items) convertDataToLayers(item.items);else item.items = [];
	  });
	};
	
	var createLayers = function createLayers(layersData) {
	  var svg = d3.select('svg');
	
	  d3.selectAll('input.diagrams-diagram-button').remove();
	
	  svg.remove();
	  _diagrams2['default'].layer(layersData);
	};
	
	exports['default'] = function (origConf) {
	  var layersData = [];
	
	  layersData.push({
	    items: origConf.body,
	    text: origConf.name
	  });
	  convertDataToLayers(layersData[0].items);
	  createLayers(layersData);
	};
	
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	exports["default"] = function (generalData) {
	  var finalData = _diagrams2["default"].utils.dataFromGeneralToSpecificForATreeStructureType(generalData);
	
	  finalData.name = finalData.text;
	  finalData.body = finalData.items;
	
	  delete finalData.items;
	  delete finalData.text;
	
	  return finalData;
	};
	
	module.exports = exports["default"];

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _ref = _;
	var each = _ref.each;
	
	var recursiveFn = function recursiveFn(items, parentCreatedItem, context) {
	  each(items, function (item) {
	    var createdItem = {
	      description: item.description,
	      graphsData: {
	        box: {
	          options: item.options
	        }
	      },
	      id: ++context.maxId,
	      name: item.text
	    };
	
	    context.finalItems.push(createdItem);
	
	    if (parentCreatedItem) {
	      context.connections.push({
	        from: createdItem.id,
	        to: parentCreatedItem.id
	      });
	    } else {
	      context.connections.push({
	        from: createdItem.id,
	        to: 0
	      });
	    }
	
	    if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem, context);
	  });
	};
	
	exports["default"] = function (conf) {
	  var context = {
	    connections: [],
	    finalItems: [],
	    maxId: -1
	  };
	
	  context.finalItems.push({
	    id: ++context.maxId,
	    name: conf.name
	  });
	
	  recursiveFn(conf.body, null, context);
	
	  return {
	    connections: context.connections,
	    items: context.finalItems
	  };
	};
	
	module.exports = exports["default"];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _expandOrCollapseAll = __webpack_require__(12);
	
	var _expandOrCollapseAll2 = _interopRequireDefault(_expandOrCollapseAll);
	
	exports['default'] = function (creationId) {
	  (0, _expandOrCollapseAll2['default'])(creationId, 'expand');
	};
	
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _traverseBodyDataAndRefresh = __webpack_require__(13);
	
	var _traverseBodyDataAndRefresh2 = _interopRequireDefault(_traverseBodyDataAndRefresh);
	
	var _ref = _;
	var any = _ref.any;
	var debounce = _ref.debounce;
	var each = _ref.each;
	var partial = _ref.partial;
	
	var setItemVisibility = function setItemVisibility(_ref2, item) {
	  var isHidden = _ref2.isHidden;
	  return item.hidden = isHidden;
	};
	var showItem = partial(setItemVisibility, { isHidden: false });
	var hideItem = partial(setItemVisibility, { isHidden: true });
	
	var anyParentIsShown = function anyParentIsShown(parents) {
	  return any(parents, function (parent) {
	    return parent.hidden !== true;
	  });
	};
	
	var handleDisplayOfItem = function handleDisplayOfItem(opts, item, parents) {
	  var shouldShowItemBecauseOtherReasonsThanAMatch = opts.showChildren === true && anyParentIsShown(parents) === true;
	
	  if (shouldShowItemBecauseOtherReasonsThanAMatch) showItem(item);else handleDisplayOfItemDependingOnAMatch(opts, item, parents);
	};
	
	var handleDisplayOfItemDependingOnAMatch = function handleDisplayOfItemDependingOnAMatch(opts, item, parents) {
	  var isThereAMatch = new RegExp(opts.str, 'i').test(item.text);
	
	  if (isThereAMatch === false) hideItem(item);else {
	    each(parents, showItem);
	    showItem(item);
	  }
	};
	
	exports['default'] = debounce(function (opts, creationId) {
	  (0, _traverseBodyDataAndRefresh2['default'])(creationId, null, partial(handleDisplayOfItem, opts));
	}, 500);
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _generateItem = __webpack_require__(23);
	
	var _generateItem2 = _interopRequireDefault(_generateItem);
	
	/**
	 * Signatures:
	 * (text, description, items, options)
	 * (text, items, options)
	 */
	var _ref = _;
	var isArray = _ref.isArray;
	var generateContainer = function generateContainer() {
	  var _arguments = arguments;
	  var _again = true;
	
	  _function: while (_again) {
	    _again = false;
	
	    if (isArray(_arguments[1])) {
	      _arguments = [_arguments[0], null, _arguments[1], _arguments[2]];
	      _again = true;
	      continue _function;
	    }
	
	    return (0, _generateItem2['default'])({ description: _arguments[1], items: _arguments[2], options: _arguments[3], text: _arguments[0] });
	  }
	};
	
	exports['default'] = generateContainer;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _parseItemGenerationOptions = __webpack_require__(24);
	
	var _parseItemGenerationOptions2 = _interopRequireDefault(_parseItemGenerationOptions);
	
	var _ref = _;
	var defaults = _ref.defaults;
	
	var defaultOptions = {
	  isLink: false,
	  notCompleted: false
	};
	
	exports['default'] = function (_ref2) {
	  var _ref2$description = _ref2.description;
	  var description = _ref2$description === undefined ? null : _ref2$description;
	  var _ref2$items = _ref2.items;
	  var items = _ref2$items === undefined ? [] : _ref2$items;
	  var _ref2$options = _ref2.options;
	  var options = _ref2$options === undefined ? {} : _ref2$options;
	  var text = _ref2.text;
	
	  options = (0, _parseItemGenerationOptions2['default'])(options);
	
	  return {
	    description: description,
	    items: items,
	    options: defaults(options, defaultOptions),
	    text: text
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _ref = _;
	var isString = _ref.isString;
	var reduce = _ref.reduce;
	
	var getParsedOptionsOfStrCase = function getParsedOptionsOfStrCase(optionsStr) {
	  var options = optionsStr.split(' ');
	
	  return reduce(options, function (parsedOptions, optionsKey) {
	    // option-one -> optionOne
	    var newKey = optionsKey.replace(/-([a-z])/g, function (g) {
	      return g[1].toUpperCase();
	    });
	
	    parsedOptions[newKey] = true;
	  }, {});
	};
	
	exports['default'] = function (options) {
	  var parsedOptions = undefined;
	
	  options = options || {};
	
	  if (isString(options)) {
	    parsedOptions = getParsedOptionsOfStrCase(options);
	  } else parsedOptions = options;
	
	  return parsedOptions;
	};
	
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _generateItem = __webpack_require__(23);
	
	var _generateItem2 = _interopRequireDefault(_generateItem);
	
	exports['default'] = function (text, description) {
	  return (0, _generateItem2['default'])({ description: description, text: text });
	};
	
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _generateDefinition = __webpack_require__(25);
	
	var _generateDefinition2 = _interopRequireDefault(_generateDefinition);
	
	exports['default'] = function (text) {
	  var preffix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	
	  var sharedKey = preffix + text.split('(')[0];
	
	  return (0, _generateDefinition2['default'])(text, _diagrams2['default'].shared.get(sharedKey));
	};
	
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _generateItem = __webpack_require__(23);
	
	var _generateItem2 = _interopRequireDefault(_generateItem);
	
	exports['default'] = function (text, url) {
	  return (0, _generateItem2['default'])({ description: url, items: null, options: {
	      isLink: true
	    }, text: text });
	};
	
	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _helpers = __webpack_require__(8);
	
	var _helpers2 = _interopRequireDefault(_helpers);
	
	var _ref = _;
	var defer = _ref.defer;
	var each = _ref.each;
	var isNull = _ref.isNull;
	var isString = _ref.isString;
	var isUndefined = _ref.isUndefined;
	
	var textGId = 0;
	var triggerElId = 0;
	var bodyG = undefined;
	
	var fixedValues = {
	  depthWidth: 35,
	  nameHeight: 50,
	  rowHeight: 30
	};
	
	var collapseIfNecessary = function collapseIfNecessary(el, item) {
	  if (item.items.length > 0 || item.collapsedItems) {
	    (function () {
	      var textEl = el.select('text');
	      var yDim = textEl.attr('y');
	      var xDim = textEl.attr('x');
	      var triggerEl = el.append('g').attr({
	        'class': 'collapsible-trigger'
	      });
	      var collapseListener = function collapseListener() {
	        _helpers2['default'].collapseItem(item);
	        _helpers2['default'].addBodyItemsAndUpdateHeights.get()();
	      };
	      var expandListener = function expandListener() {
	        _helpers2['default'].expandItem(item);
	        _helpers2['default'].addBodyItemsAndUpdateHeights.get()();
	      };
	      var triggerTextEl = triggerEl.append('text').attr({
	        x: Number(xDim) - 20,
	        y: Number(yDim) + 5
	      });
	      var setCollapseTextAndListener = function setCollapseTextAndListener() {
	        triggerTextEl.text('-').attr('class', 'minus');
	        triggerEl.on('click', collapseListener);
	      };
	      var setExpandTextAndListener = function setExpandTextAndListener() {
	        triggerTextEl.text('+').attr({
	          'class': 'plus',
	          y: yDim
	        });
	        triggerEl.on('click', expandListener);
	      };
	      var clipPathId = undefined;
	
	      triggerElId += 1;
	      clipPathId = 'clippath-' + triggerElId;
	      triggerEl.append('clipPath').attr('id', clipPathId).append('rect').attr({
	        height: 15,
	        width: 20,
	        x: xDim - 20,
	        y: yDim - 17
	      });
	      triggerTextEl.attr('clip-path', 'url(#' + clipPathId + ')');
	
	      if (isUndefined(item.collapsed)) {
	        item.collapsed = false;
	        setCollapseTextAndListener();
	      } else {
	        if (item.collapsed === true) setExpandTextAndListener();else if (item.collapsed === false) setCollapseTextAndListener();
	      }
	    })();
	  }
	};
	
	var scrollToTarget = function scrollToTarget(target, conf) {
	  var targetFound = null;
	  var recursiveFindTarget = function recursiveFindTarget(items) {
	    each(items, function (item) {
	      if (isNull(targetFound)) {
	        if (isString(item.text) && item.text.indexOf(target) > -1) targetFound = item;else if (item.items) recursiveFindTarget(item.items);
	      }
	    });
	  };
	  var currentScroll = undefined,
	      scrollElTop = undefined;
	
	  recursiveFindTarget(conf.body);
	
	  if (targetFound) {
	    currentScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
	    scrollElTop = targetFound.textG[0][0].getBoundingClientRect().top;
	    defer(function () {
	      window.scrollTo(0, scrollElTop + currentScroll);
	    });
	  }
	  console.log("targetFound", targetFound);
	};
	
	var bodyPosition = undefined;
	
	var addBodyItems = function addBodyItems(_ref2) {
	  var conf = _ref2.conf;
	  var container = _ref2.container;
	  var depth = _ref2.depth;
	  var diagram = _ref2.diagram;
	  var items = _ref2.items;
	  var svg = _ref2.svg;
	
	  var newContainer = undefined,
	      textEl = undefined,
	      textWidth = undefined,
	      descriptionWidth = undefined,
	      containerText = undefined,
	      textElValue = undefined;
	
	  items = items || conf.body;
	  container = container || bodyG;
	  depth = depth || 1;
	
	  if (items === conf.body) bodyPosition = 1;
	
	  each(items, function (item, itemIndex) {
	    if (item.hidden !== true) {
	      var currentTextGId = 'diagrams-box-text-' + textGId++;
	
	      if (isString(item)) {
	        item = _helpers2['default'].generateItem({ text: item });
	        items[itemIndex] = item;
	      }
	      item.items = item.items || [];
	
	      if (item.items.length > 0) {
	        newContainer = container.append('g');
	        containerText = _diagrams2['default'].utils.formatShortDescription(item.text);
	
	        if (item.items && item.items.length > 0) containerText += ':';
	
	        if (item.description) {
	          item.fullText = _diagrams2['default'].utils.generateATextDescriptionStr(containerText, item.description);
	          containerText += ' (...)';
	        } else item.fullText = item.text;
	
	        textEl = newContainer.append('text').text(containerText).attr({
	          id: currentTextGId,
	          x: fixedValues.depthWidth * depth,
	          y: fixedValues.rowHeight * ++bodyPosition
	        });
	
	        addBodyItems({
	          bodyPosition: bodyPosition, conf: conf, container: newContainer, depth: depth + 1,
	          diagram: diagram, items: item.items, svg: svg
	        });
	      } else {
	        if (item.options && item.options.isLink === true) {
	          newContainer = container.append('svg:a').attr("xlink:href", item.description);
	          textEl = newContainer.append('text').text(_diagrams2['default'].utils.formatShortDescription(item.text)).attr({
	            fill: '#3962B8',
	            id: currentTextGId,
	            x: fixedValues.depthWidth * depth,
	            y: fixedValues.rowHeight * ++bodyPosition
	          });
	
	          item.fullText = item.text + ' (' + item.description + ')';
	        } else {
	          newContainer = container.append('g').attr({
	            id: currentTextGId
	          });
	          textEl = newContainer.append('text').text(_diagrams2['default'].utils.formatShortDescription(item.text)).attr({
	            'class': 'diagrams-box-definition-text',
	            x: fixedValues.depthWidth * depth,
	            y: fixedValues.rowHeight * ++bodyPosition
	          });
	
	          if (item.description) {
	            textWidth = textEl[0][0].getBoundingClientRect().width;
	            descriptionWidth = svg[0][0].getBoundingClientRect().width - textWidth - fixedValues.depthWidth * depth - 30;
	
	            newContainer.append('text').text('- ' + _diagrams2['default'].utils.formatShortDescription(item.description)).attr({
	              x: fixedValues.depthWidth * depth + textWidth + 5,
	              y: fixedValues.rowHeight * bodyPosition - 1
	            }).each(_diagrams2['default'].svg.textEllipsis(descriptionWidth));
	          }
	
	          item.fullText = _diagrams2['default'].utils.generateATextDescriptionStr(item.text, item.description);
	        }
	      }
	
	      collapseIfNecessary(newContainer, item);
	      item.textG = newContainer;
	      item.textEl = textEl;
	
	      if (item.options.notCompleted === true) {
	        item.textG.attr('class', '' + (item.textG.attr('class') || '') + ' diagrams-box-not-completed-block');
	        textElValue = item.textEl.text();
	        item.textEl.text('');
	        item.textEl.append('tspan').text(textElValue + ' ');
	        item.textEl.append('tspan').text('[NOT COMPLETED]').attr('class', 'diagrams-box-not-completed-tag');
	      }
	
	      diagram.addMouseListenersToEl(textEl, item);
	    }
	  });
	};
	
	var getAddBodyItemsFn = function getAddBodyItemsFn(_ref3) {
	  var boxG = _ref3.boxG;
	  var conf = _ref3.conf;
	  var diagram = _ref3.diagram;
	  var svg = _ref3.svg;
	  var width = _ref3.width;
	
	  return function () {
	    var currentScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
	
	    svg.attr('height', 10);
	
	    if (bodyG) bodyG.remove();
	    bodyG = boxG.append('g').attr({
	      transform: 'translate(0, ' + fixedValues.nameHeight + ')'
	    });
	    var bodyRect = bodyG.append('rect').attr({
	      fill: '#fff',
	      stroke: '#000',
	      width: width
	    }).style({
	      filter: 'url(#diagrams-drop-shadow-box)'
	    });
	
	    triggerElId = 0;
	    addBodyItems({ bodyG: bodyG, conf: conf, container: null, depth: null, diagram: diagram, items: null, svg: svg });
	    diagram.setRelationships(conf.body);
	    _diagrams2['default'].svg.updateHeigthOfElWithOtherEl(svg, boxG, 50);
	    _diagrams2['default'].svg.updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - fixedValues.nameHeight);
	
	    window.scrollTo(0, currentScroll);
	    diagram.emit('items-rendered');
	  };
	};
	
	var Box = (function (_d$Diagram) {
	  _inherits(Box, _d$Diagram);
	
	  function Box() {
	    _classCallCheck(this, Box);
	
	    _get(Object.getPrototypeOf(Box.prototype), 'constructor', this).apply(this, arguments);
	  }
	
	  _createClass(Box, [{
	    key: 'create',
	    value: function create(creationId, conf, opts) {
	      var diagram = this;
	      var svg = _diagrams2['default'].svg.generateSvg();
	      var width = svg.attr('width') - 40;
	      var boxG = svg.append('g').attr({
	        'class': 'box-diagram',
	        transform: 'translate(20, 20)'
	      });
	      var nameG = boxG.append('g');
	      var urlParams = _diagrams2['default'].utils.getUrlParams();
	
	      opts = opts || {};
	
	      _helpers2['default'].addBodyItemsAndUpdateHeights.set(getAddBodyItemsFn({ boxG: boxG, conf: conf, diagram: diagram, svg: svg, width: width }));
	
	      _diagrams2['default'].svg.addFilterColor({ container: svg, deviation: 3, id: 'box', slope: 4 });
	
	      nameG.append('rect').attr({
	        fill: '#fff',
	        height: fixedValues.nameHeight,
	        stroke: '#000',
	        width: width
	      }).style({
	        filter: 'url(#diagrams-drop-shadow-box)'
	      });
	      nameG.append('text').attr({
	        x: width / 2,
	        y: 30
	      }).text(conf.name).style({
	        'font-weight': 'bold',
	        'text-anchor': 'middle'
	      });
	
	      d3.select(document.body).style('opacity', 0);
	      _helpers2['default'].addBodyItemsAndUpdateHeights.get()();
	
	      if (opts.allCollapsed === true) _helpers2['default'].collapseAll(creationId);
	      _helpers2['default'].addButtons(creationId);
	      d3.select(document.body).style('opacity', 1);
	
	      if (urlParams.target) scrollToTarget(urlParams.target, conf);
	    }
	  }, {
	    key: 'setRelationships',
	    value: function setRelationships(items, container) {
	      var diagram = this;
	
	      each(items, function (item) {
	        diagram.generateEmptyRelationships(item);
	
	        if (container) {
	          diagram.addDependantRelationship(container, item.textG, item);
	          diagram.addDependencyRelationship(item, container.textG, container);
	        }
	
	        if (item.items && item.items.length > 0) diagram.setRelationships(item.items, item);
	      });
	    }
	  }]);
	
	  return Box;
	})(_diagrams2['default'].Diagram);
	
	exports['default'] = function () {
	  new Box({
	    helpers: _helpers2['default'],
	    name: 'box'
	  });
	};
	
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _addDiagramInfo = __webpack_require__(30);
	
	var _addDiagramInfo2 = _interopRequireDefault(_addDiagramInfo);
	
	var _connectionFnFactory = __webpack_require__(31);
	
	var _connectionFnFactory2 = _interopRequireDefault(_connectionFnFactory);
	
	var _dataFromGeneralToSpecific = __webpack_require__(32);
	
	var _dataFromGeneralToSpecific2 = _interopRequireDefault(_dataFromGeneralToSpecific);
	
	var _doWithMinIdAndMaxIdOfLinkNodes = __webpack_require__(33);
	
	var _doWithMinIdAndMaxIdOfLinkNodes2 = _interopRequireDefault(_doWithMinIdAndMaxIdOfLinkNodes);
	
	var _generateConnectionWithText = __webpack_require__(34);
	
	var _generateConnectionWithText2 = _interopRequireDefault(_generateConnectionWithText);
	
	var _generateFnNodeWithSharedGetAndBoldIfFile = __webpack_require__(35);
	
	var _generateFnNodeWithSharedGetAndBoldIfFile2 = _interopRequireDefault(_generateFnNodeWithSharedGetAndBoldIfFile);
	
	var _generateNode = __webpack_require__(37);
	
	var _generateNode2 = _interopRequireDefault(_generateNode);
	
	var _generateNodeOptions = __webpack_require__(38);
	
	var _generateNodeOptions2 = _interopRequireDefault(_generateNodeOptions);
	
	var _generateNodeWithSharedGet = __webpack_require__(36);
	
	var _generateNodeWithSharedGet2 = _interopRequireDefault(_generateNodeWithSharedGet);
	
	var _generateNodeWithTargetLink = __webpack_require__(40);
	
	var _generateNodeWithTargetLink2 = _interopRequireDefault(_generateNodeWithTargetLink);
	
	var _generateNodeWithTextAsTargetLink = __webpack_require__(41);
	
	var _generateNodeWithTextAsTargetLink2 = _interopRequireDefault(_generateNodeWithTextAsTargetLink);
	
	var _generatePrivateNode = __webpack_require__(42);
	
	var _generatePrivateNode2 = _interopRequireDefault(_generatePrivateNode);
	
	var _getLinksNumberMapItemWithLink = __webpack_require__(43);
	
	var _getLinksNumberMapItemWithLink2 = _interopRequireDefault(_getLinksNumberMapItemWithLink);
	
	var _linksNumberMapHandler = __webpack_require__(44);
	
	var _linksNumberMapHandler2 = _interopRequireDefault(_linksNumberMapHandler);
	
	var _mergeWithDefaultConnection = __webpack_require__(39);
	
	var _mergeWithDefaultConnection2 = _interopRequireDefault(_mergeWithDefaultConnection);
	
	var _setReRender = __webpack_require__(45);
	
	var _setReRender2 = _interopRequireDefault(_setReRender);
	
	var _updateLinksNumberMapWithLink = __webpack_require__(46);
	
	var _updateLinksNumberMapWithLink2 = _interopRequireDefault(_updateLinksNumberMapWithLink);
	
	exports['default'] = {
	  addDiagramInfo: _addDiagramInfo2['default'],
	  connectionFnFactory: _connectionFnFactory2['default'],
	  dataFromGeneralToSpecific: _dataFromGeneralToSpecific2['default'],
	  doWithMinIdAndMaxIdOfLinkNodes: _doWithMinIdAndMaxIdOfLinkNodes2['default'],
	  generateConnectionWithText: _generateConnectionWithText2['default'],
	  generateFnNodeWithSharedGetAndBoldIfFile: _generateFnNodeWithSharedGetAndBoldIfFile2['default'],
	  generateNode: _generateNode2['default'],
	  generateNodeOptions: _generateNodeOptions2['default'],
	  generateNodeWithSharedGet: _generateNodeWithSharedGet2['default'],
	  generateNodeWithTargetLink: _generateNodeWithTargetLink2['default'],
	  generateNodeWithTextAsTargetLink: _generateNodeWithTextAsTargetLink2['default'],
	  generatePrivateNode: _generatePrivateNode2['default'],
	  getLinksNumberMapItemWithLink: _getLinksNumberMapItemWithLink2['default'],
	  linksNumberMapHandler: _linksNumberMapHandler2['default'],
	  mergeWithDefaultConnection: _mergeWithDefaultConnection2['default'],
	  setReRender: _setReRender2['default'],
	  updateLinksNumberMapWithLink: _updateLinksNumberMapWithLink2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _ref = _;
	var isString = _ref.isString;
	
	var addConditionallyMouseListenersToEl = function addConditionallyMouseListenersToEl(_ref2) {
	  var diagram = _ref2.diagram;
	  var el = _ref2.el;
	  var hasDescription = _ref2.hasDescription;
	  var info = _ref2.info;
	
	  if (hasDescription) {
	    diagram.addMouseListenersToEl(el, {
	      el: el,
	      fullText: _diagrams2['default'].utils.generateATextDescriptionStr(info[0], info[1])
	    });
	  }
	};
	
	exports['default'] = function (diagram, svg, info) {
	  if (isString(info)) info = [info];
	  var hasDescription = info.length === 2;
	  var svgWidth = svg[0][0].getBoundingClientRect().width;
	  var infoText = info[0] + (hasDescription ? ' (...)' : '');
	  var el = svg.append('g').attr({
	    'class': 'graph-info',
	    transform: 'translate(10, 50)'
	  }).append('text').text(infoText).each(_diagrams2['default'].svg.textEllipsis(svgWidth));
	
	  addConditionallyMouseListenersToEl({ diagram: diagram, el: el, hasDescription: hasDescription, info: info });
	};
	
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _arguments = arguments;
	var _ref = _;
	var isArray = _ref.isArray;
	var map = _ref.map;
	
	var getSetValFn = function getSetValFn(_ref2) {
	  var changedProp = _ref2.changedProp;
	  var changedVal = _ref2.changedVal;
	  var connection = _ref2.connection;
	
	  return function (singleConnection) {
	    singleConnection[changedProp] = changedVal;
	
	    return connection;
	  };
	};
	
	exports["default"] = function (baseFn, changedProp, changedVal) {
	  return function () {
	    var connection = baseFn.apply(undefined, _arguments);
	    var setVal = getSetValFn({ changedProp: changedProp, changedVal: changedVal, connection: connection });
	
	    return isArray(connection) ? map(connection, setVal) : setVal(connection);
	  };
	};
	
	module.exports = exports["default"];

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _ref = _;
	var each = _ref.each;
	var map = _ref.map;
	
	var getNewConnection = function getNewConnection(_ref2) {
	  var connection = _ref2.connection;
	  var currentNode = _ref2.currentNode;
	  var otherNodeId = _ref2.otherNodeId;
	
	  if (connection.direction === 'out') return {
	    from: currentNode.id,
	    to: otherNodeId
	  };else if (connection.direction === 'in') return {
	    from: otherNodeId,
	    to: currentNode.id
	  };
	};
	
	var extractConnections = function extractConnections(currentNode, connection) {
	  return map(connection.nodesIds, function (otherNodeId) {
	    var newConnection = getNewConnection({ connection: connection, currentNode: currentNode, otherNodeId: otherNodeId });
	
	    return newConnection;
	  });
	};
	
	exports['default'] = function (data) {
	  var finalItems = [];
	  var connections = [];
	
	  each(data, function (node) {
	    finalItems.push({
	      description: node.description,
	      id: node.id,
	      name: node.name
	    });
	
	    each(node.connections, function (connection) {
	      connections = connections.concat(extractConnections(node, connection));
	    });
	  });
	
	  return {
	    connections: connections,
	    items: finalItems
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _ref = _;
	var isNumber = _ref.isNumber;
	var max = _ref.max;
	var min = _ref.min;
	
	exports["default"] = function (link, cb) {
	  var getIndex = function getIndex(item) {
	    return isNumber(item) ? item : item.index;
	  };
	  var ids = [getIndex(link.source), getIndex(link.target)];
	  var minIndex = min(ids);
	  var maxIndex = max(ids);
	
	  return cb(minIndex, maxIndex);
	};
	
	module.exports = exports["default"];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _generateConnectionWithText = __webpack_require__(34);
	
	var _generateConnectionWithText2 = _interopRequireDefault(_generateConnectionWithText);
	
	var _ref = _;
	var isArray = _ref.isArray;
	var isNumber = _ref.isNumber;
	var isString = _ref.isString;
	var map = _ref.map;
	
	exports['default'] = function (nodesIds, text) {
	  if (isArray(nodesIds) && isArray(nodesIds[0])) {
	    return map(nodesIds, function (args) {
	      return _generateConnectionWithText2['default'].apply({}, args);
	    });
	  }
	
	  if (isString(nodesIds)) nodesIds = nodesIds.split(' ').map(Number);else if (isNumber(nodesIds)) nodesIds = [nodesIds];
	
	  return _diagrams2['default'].graph.mergeWithDefaultConnection({ nodesIds: nodesIds, text: text });
	};
	
	module.exports = exports['default'];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _arguments = arguments;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _generateNodeWithSharedGet = __webpack_require__(36);
	
	var _generateNodeWithSharedGet2 = _interopRequireDefault(_generateNodeWithSharedGet);
	
	exports['default'] = function (file) {
	  return function () {
	    var opts = '';
	    var preffix = '';
	
	    if (_arguments[0].split('@')[0] === file) opts = 'b';
	
	    if (_arguments.length > 2) preffix = _arguments[2];
	
	    if (_arguments.length > 3) opts = _arguments[3] + ' ' + opts;
	
	    return (0, _generateNodeWithSharedGet2['default'])(_arguments[0], _arguments[1], preffix, opts);
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _arguments = arguments;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _generateNode = __webpack_require__(37);
	
	var _generateNode2 = _interopRequireDefault(_generateNode);
	
	exports['default'] = function () {
	  var text = _arguments[0];
	  var sharedKey = undefined,
	      preffix = undefined,
	      options = undefined;
	
	  preffix = _arguments.length > 2 ? _arguments[2] : '';
	  sharedKey = preffix + text.split('(')[0];
	  options = _arguments.length > 3 ? _arguments[3] : null;
	
	  return (0, _generateNode2['default'])(text, _arguments[1], _diagrams2['default'].shared.get(sharedKey), options);
	};
	
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _generateNodeOptions = __webpack_require__(38);
	
	var _generateNodeOptions2 = _interopRequireDefault(_generateNodeOptions);
	
	var _mergeWithDefaultConnection = __webpack_require__(39);
	
	var _mergeWithDefaultConnection2 = _interopRequireDefault(_mergeWithDefaultConnection);
	
	var _ref = _;
	var each = _ref.each;
	var isArray = _ref.isArray;
	var isNumber = _ref.isNumber;
	var isObject = _ref.isObject;
	var isString = _ref.isString;
	
	var addDefaultConnectionFromNumber = function addDefaultConnectionFromNumber(node, nodeId) {
	  node.connections.push((0, _mergeWithDefaultConnection2['default'])({
	    nodesIds: [nodeId]
	  }));
	};
	
	var addConnection = function addConnection(node, connection) {
	  if (isArray(connection)) each(connection, function (singleConnection) {
	    addConnection(node, singleConnection);
	  });else if (isNumber(connection)) addConnection({
	    nodesIds: [connection]
	  });else if (isObject(connection)) {
	    (0, _mergeWithDefaultConnection2['default'])(connection);
	    node.connections.push(connection);
	  }
	};
	
	var handleStrCase = function handleStrCase(node, origConnections) {
	  var connections = origConnections.split(' ').map(Number);
	
	  if (connections.length > 0) node.id = connections[0];
	
	  if (connections.length > 1) {
	    each(connections, function (nodeId, index) {
	      if (index > 0) addConnection(node, nodeId);
	    });
	  }
	};
	
	var handleArrCase = function handleArrCase(node, origConnections) {
	  var connections = origConnections.slice(1);
	
	  node.id = origConnections[0];
	  each(connections, function (connection) {
	    if (isNumber(connection)) addDefaultConnectionFromNumber(node, connection);else addConnection(node, connection);
	  });
	};
	
	var handleCases = function handleCases(node, origConnections) {
	  if (isString(origConnections)) {
	    handleStrCase(node, origConnections);
	  } else if (isArray(origConnections)) {
	    handleArrCase(node, origConnections);
	  } else if (isNumber(origConnections)) node.id = origConnections;
	};
	
	var generateComplexNode = function generateComplexNode(node, argsArr) {
	  var origConnections = argsArr[1];
	
	  handleCases(node, origConnections);
	
	  if (argsArr.length > 2) node.description = argsArr[2];
	
	  if (argsArr.length > 3) node.options = (0, _generateNodeOptions2['default'])(argsArr[3]);
	};
	
	exports['default'] = function () {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var node = {
	    name: args[0]
	  };
	
	  if (args.length > 1) {
	    node.connections = [];
	    generateComplexNode(node, args);
	  }
	
	  return node;
	};
	
	module.exports = exports['default'];

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _generateNodeOptions = __webpack_require__(38);
	
	var _generateNodeOptions2 = _interopRequireDefault(_generateNodeOptions);
	
	var _ref = _;
	var each = _ref.each;
	var isArray = _ref.isArray;
	var isString = _ref.isString;
	
	var getArrCaseHandler = function getArrCaseHandler(_ref2) {
	  var obj = _ref2.obj;
	
	  return function (opt) {
	    if (opt.substr(0, 2) === 's-') {
	      var shape = opt.substr(2, opt.length - 2);
	
	      if (shape === 't') obj.shape = 'triangle';else if (shape === 's') obj.shape = 'square';else obj.shape = 'circle';
	    } else if (opt === 'b') obj.bold = true;else if (opt.substr(0, 2) === 'l~') obj.linkToUrl = opt.substr(2, opt.length - 2);
	  };
	};
	
	exports['default'] = function (options) {
	  var obj = {};
	
	  if (isString(options)) return (0, _generateNodeOptions2['default'])(options.split(' '));else if (isArray(options)) {
	    each(options, getArrCaseHandler({ obj: obj }));
	
	    return obj;
	  }
	};
	
	module.exports = exports['default'];

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _ref = _;
	var defaults = _ref.defaults;
	
	exports['default'] = function (connection) {
	  var defaultConnection = {
	    direction: 'out',
	    line: 'plain',
	    symbol: 'arrow'
	  };
	
	  return defaults(connection, defaultConnection);
	};
	
	module.exports = exports['default'];

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _generateNode = __webpack_require__(37);
	
	var _generateNode2 = _interopRequireDefault(_generateNode);
	
	var _ref = _;
	var isUndefined = _ref.isUndefined;
	
	exports['default'] = function (file, target) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    if (isUndefined(args[3])) args[3] = '';else args[3] += ' ';
	    args[3] += 'l~' + file + '?target=' + encodeURIComponent(target);
	
	    return _generateNode2['default'].apply({}, args);
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _arguments = arguments;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	exports['default'] = function (file) {
	  return function () {
	    return _diagrams2['default'].graph.generateNodeWithTargetLink(file, _arguments[0]).apply({}, _arguments);
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _arguments = arguments;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	var _generateNode = __webpack_require__(37);
	
	var _generateNode2 = _interopRequireDefault(_generateNode);
	
	exports['default'] = function () {
	  var args = Array.prototype.slice.call(_arguments);
	
	  args[2] += '<br><strong>PRIVATE</strong>';
	  args[3] = 's-t';
	
	  return _generateNode2['default'].apply(undefined, _toConsumableArray(args));
	};
	
	module.exports = exports['default'];

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _doWithMinIdAndMaxIdOfLinkNodes = __webpack_require__(33);
	
	var _doWithMinIdAndMaxIdOfLinkNodes2 = _interopRequireDefault(_doWithMinIdAndMaxIdOfLinkNodes);
	
	var _linksNumberMapHandler = __webpack_require__(44);
	
	var _linksNumberMapHandler2 = _interopRequireDefault(_linksNumberMapHandler);
	
	exports['default'] = function (link) {
	  return (0, _doWithMinIdAndMaxIdOfLinkNodes2['default'])(link, function (minIndex, maxIndex) {
	    return (0, _linksNumberMapHandler2['default'])().get()[minIndex][maxIndex];
	  });
	};
	
	module.exports = exports['default'];

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var linksNumberMap = {};
	
	var handler = {
	  get: function get() {
	    return linksNumberMap;
	  },
	  reset: function reset() {
	    return linksNumberMap = {};
	  }
	};
	
	exports["default"] = function () {
	  return handler;
	};
	
	module.exports = exports["default"];

/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	exports['default'] = function (diagram, creationId, data) {
	  diagram.reRender = function (conf) {
	    diagram.unlisten('configuration-changed');
	    diagram.reRender = null;
	    diagram.removePreviousAndCreate(creationId, data, conf);
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _doWithMinIdAndMaxIdOfLinkNodes = __webpack_require__(33);
	
	var _doWithMinIdAndMaxIdOfLinkNodes2 = _interopRequireDefault(_doWithMinIdAndMaxIdOfLinkNodes);
	
	var _linksNumberMapHandler = __webpack_require__(44);
	
	var _linksNumberMapHandler2 = _interopRequireDefault(_linksNumberMapHandler);
	
	var _ref = _;
	var isUndefined = _ref.isUndefined;
	
	exports['default'] = function (link) {
	  (0, _doWithMinIdAndMaxIdOfLinkNodes2['default'])(link, function (minIndex, maxIndex) {
	    var linksNumberMap = (0, _linksNumberMapHandler2['default'])().get();
	
	    if (isUndefined(linksNumberMap[minIndex])) linksNumberMap[minIndex] = {};
	
	    if (isUndefined(linksNumberMap[minIndex][maxIndex])) {
	      linksNumberMap[minIndex][maxIndex] = 1;
	    } else linksNumberMap[minIndex][maxIndex] += 1;
	  });
	};
	
	module.exports = exports['default'];

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _helpers = __webpack_require__(29);
	
	var _helpers2 = _interopRequireDefault(_helpers);
	
	var SHY_CONNECTIONS = 'Show connections selectively';
	var GRAPH_ZOOM = 'dia graph zoom';
	var GRAPH_DRAG = 'Drag nodes on click (may make links difficult)';
	var CURVED_ARROWS = 'All arrows are curved';
	var graphZoomConfig = {
	  'private': true,
	  type: Number,
	  value: 1
	};
	var dPositionFn = _diagrams2['default'].utils.positionFn;
	var dTextFn = _diagrams2['default'].utils.textFn;
	
	exports['default'] = function () {
	  var _configuration;
	
	  var Graph = (function (_d$Diagram) {
	    _inherits(Graph, _d$Diagram);
	
	    function Graph() {
	      _classCallCheck(this, Graph);
	
	      _get(Object.getPrototypeOf(Graph.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(Graph, [{
	      key: 'create',
	      value: function create(creationId, data, conf) {
	        var diagram = this;
	        var bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	        var svg = _diagrams2['default'].svg.generateSvg();
	        var container = svg.append('g');
	        var width = svg.attr('width');
	        var dragNodesConfig = diagram.config(GRAPH_DRAG);
	        var curvedArrows = diagram.config(CURVED_ARROWS);
	        var force = undefined,
	            drag = undefined,
	            link = undefined,
	            linkOuter = undefined,
	            node = undefined,
	            zoom = undefined,
	            singleNodeEl = undefined,
	            shape = undefined,
	            shapeEl = undefined,
	            markers = undefined,
	            parsedData = undefined;
	
	        _helpers2['default'].linksNumberMapHandler().reset();
	
	        var height = _diagrams2['default'].svg.selectScreenHeightOrHeight(bodyHeight - 250);
	
	        var tick = function tick() {
	          var setPathToLink = function setPathToLink(pathClass) {
	            link.select('path.' + pathClass).attr("d", function (da) {
	              var linksNumber = _helpers2['default'].getLinksNumberMapItemWithLink(da);
	              var linkIndex = da.data.linkIndex;
	              var dx = da.target.x - da.source.x;
	              var dy = da.target.y - da.source.y;
	              var dr = Math.sqrt(dx * dx + dy * dy) * (curvedArrows ? 3.5 : 1) * (linkIndex + (curvedArrows ? 1 : 0) / (linksNumber * 3));
	
	              return 'M' + da.source.x + ',' + da.source.y + 'A' + (dr + ',' + dr + ' 0 0,1 ') + (da.target.x + ',' + da.target.y);
	            });
	          };
	
	          _.each(['link-path', 'link-path-outer'], setPathToLink);
	
	          node.each(function (singleNode) {
	            if (singleNode.shape === 'circle') {
	              node.select('circle').attr("cx", dPositionFn('x')).attr("cy", dPositionFn('y'));
	            } else {
	              if (singleNode.shape === 'triangle') shapeEl = node.select('path.triangle');else if (singleNode.shape === 'square') shapeEl = node.select('path.square');
	
	              _diagrams2['default'].utils.applySimpleTransform(shapeEl);
	            }
	          });
	          node.select('text').attr("x", dPositionFn('x')).attr("y", dPositionFn('y', -20));
	        };
	        var parseData = function parseData() {
	          var maxId = _.reduce(data, function (memo, tmpNode) {
	            var id = tmpNode.id || 0;
	
	            return memo > id ? memo : id;
	          }, 0);
	          var idsMap = {};
	          var nodesWithLinkMap = {};
	          var colors = d3.scale.category20();
	          var handleConnections = function handleConnections(tmpNode, nodeIndex) {
	            if (tmpNode.connections.length > 0) {
	              _.each(tmpNode.connections, function (connection) {
	                _.each(connection.nodesIds, function (otherNodeId) {
	                  otherNode = idsMap[otherNodeId];
	
	                  if (otherNode) {
	                    if (conf.hideNodesWithoutLinks) {
	                      nodesWithLinkMap[otherNode.index] = true;
	                      nodesWithLinkMap[nodeIndex] = true;
	                    }
	                    linkObj = {};
	
	                    if (connection.direction === 'out') {
	                      linkObj.source = nodeIndex;
	                      linkObj.target = otherNode.index;
	                    } else {
	                      linkObj.source = otherNode.index;
	                      linkObj.target = nodeIndex;
	                    }
	                    linkObj.data = connection;
	                    linkObj.color = parsedData.nodes[linkObj.source].color;
	                    _helpers2['default'].updateLinksNumberMapWithLink(linkObj);
	                    linkObj.data.linkIndex = _helpers2['default'].getLinksNumberMapItemWithLink(linkObj) - 1;
	
	                    if (linkObj.data.text) linkObj.data.fullText = linkObj.data.text;
	                    parsedData.links.push(linkObj);
	                  }
	                });
	              });
	            }
	          };
	          var nodeId = undefined,
	              color = undefined,
	              options = undefined,
	              otherNode = undefined,
	              linkObj = undefined;
	
	          parsedData = {
	            links: [],
	            nodes: []
	          };
	          markers = [];
	          _.each(data, function (dataNode, nodeIndex) {
	            nodeId = _.isUndefined(dataNode.id) ? maxId++ : dataNode.id;
	            color = colors(nodeIndex);
	            options = dataNode.options || {};
	            parsedData.nodes.push({
	              bold: options.bold || false,
	              color: color,
	              connections: dataNode.connections || [],
	              description: dataNode.description || null,
	              id: nodeId,
	              linkToUrl: options.linkToUrl || null,
	              name: dataNode.name,
	              shape: options.shape || 'circle'
	            });
	            idsMap[nodeId] = {
	              index: nodeIndex
	            };
	            idsMap[nodeId].color = color;
	            markers.push({
	              color: color,
	              id: nodeId
	            });
	          });
	
	          diagram.config(conf);
	
	          if (conf.info) _helpers2['default'].addDiagramInfo(diagram, svg, conf.info);
	
	          _.each(parsedData.nodes, handleConnections);
	
	          if (conf.hideNodesWithoutLinks === true) {
	            _.each(parsedData.nodes, function (pdNode, nodeIndex) {
	              if (nodesWithLinkMap[nodeIndex] !== true) pdNode.hidden = true;
	            });
	          }
	        };
	
	        var zoomed = function zoomed(translate, scale) {
	          scale = scale || 1;
	          container.attr("transform", 'translate(' + translate + ')scale(' + scale + ')');
	          graphZoomConfig.value = scale;
	          diagram.config(GRAPH_ZOOM, graphZoomConfig);
	        };
	
	        var dragstarted = function dragstarted() {
	          d3.event.sourceEvent.stopPropagation();
	          d3.select(this).classed("dragging", true);
	          force.start();
	        };
	
	        var dragged = function dragged(da) {
	          d3.select(this).attr("cx", da.x = d3.event.x).attr("cy", da.y = d3.event.y);
	        };
	
	        var dragended = function dragended() {
	          d3.select(this).classed("dragging", false);
	        };
	
	        var setRelationships = function setRelationships() {
	          _.each(parsedData.nodes, diagram.generateEmptyRelationships, diagram);
	          _.each(parsedData.nodes, function (pdNode) {
	            diagram.addSelfRelationship(pdNode, pdNode.shapeEl, pdNode);
	          });
	          _.each(parsedData.links, function (pdLink) {
	            diagram.addDependencyRelationship(pdLink.source, pdLink.target.shapeEl, pdLink.target);
	            diagram.addDependantRelationship(pdLink.target, pdLink.source.shapeEl, pdLink.source);
	          });
	        };
	
	        var getAllLinks = function getAllLinks() {
	          return container.selectAll(".link");
	        };
	
	        var getLinksWithIsHiding = function getLinksWithIsHiding() {
	          return getAllLinks().filter(function (da) {
	            return da.data.hasOwnProperty('shyIsHiding');
	          });
	        };
	
	        var setLinkIsHidingIfNecessary = function setLinkIsHidingIfNecessary(isHiding, tmpLink) {
	          var linksWithIsHiding = undefined;
	
	          if (diagram.config(SHY_CONNECTIONS)) {
	            if (isHiding === false) tmpLink.data.shyIsHiding = isHiding;else if (isHiding === true) {
	              linksWithIsHiding = getLinksWithIsHiding();
	              linksWithIsHiding.each(function (da) {
	                da.data.shyIsHiding = true;
	              });
	            }
	            tmpLink.data.shyIsHidingChanged = true;
	          }
	        };
	
	        var setDisplayOfShyConnections = function setDisplayOfShyConnections(display, tmpNode) {
	          var isShowing = display === 'show';
	          var isHiding = display === 'hide';
	          var nodeData = tmpNode.data;
	          var linksWithIsHiding = getLinksWithIsHiding();
	          var nodeLinks = getAllLinks().filter(function (da) {
	            return da.source.id === nodeData.id || da.target.id === nodeData.id;
	          });
	          var setDisplay = function setDisplay(links, show) {
	            links.classed('shy-link-hidden', !show);
	            links.classed('shy-link-showed', show);
	          };
	          var hideLinks = function hideLinks(links) {
	            setDisplay(links, false);
	            links.each(function (da) {
	              delete da.data.shyIsHiding;
	            });
	          };
	          var futureConditionalHide = function futureConditionalHide() {
	            setTimeout(function () {
	              allAreHiding = true;
	              shyIsHidingIsSame = true;
	              nodeLinks.each(function (da) {
	                allAreHiding = allAreHiding && da.data.shyIsHiding;
	
	                if (da.data.shyIsHidingChanged) {
	                  shyIsHidingIsSame = false;
	                  delete da.data.shyIsHidingChanged;
	                }
	              });
	
	              if (allAreHiding && shyIsHidingIsSame) hideLinks(nodeLinks);else futureConditionalHide();
	            }, 500);
	          };
	          var allAreHiding = undefined,
	              shyIsHidingIsSame = undefined;
	
	          if (linksWithIsHiding[0].length === 0) {
	            if (isShowing) setDisplay(nodeLinks, true);else if (isHiding) {
	              nodeLinks.each(function (da) {
	                da.data.shyIsHiding = true;
	              });
	              futureConditionalHide();
	            }
	          } else {
	            if (isShowing) {
	              linksWithIsHiding.each(function (da, index) {
	                if (index === 0) da.data.shyIsHiding = false;
	              });
	            } else if (isHiding) setLinkIsHidingIfNecessary(true, linksWithIsHiding.data()[0]);
	          }
	        };
	
	        var setReRender = _.partial(_helpers2['default'].setReRender, diagram, creationId, data, _);
	
	        diagram.markRelatedFn = function (item) {
	          item.el.style('stroke-width', '20px');
	        };
	        diagram.unmarkAllItems = function () {
	          _.each(parsedData.nodes, function (pdNode) {
	            pdNode.shapeEl.style('stroke-width', '1px');
	          });
	        };
	
	        conf = conf || {};
	        parseData();
	
	        svg.attr({
	          'class': 'graph-diagram',
	          height: height
	        });
	
	        zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", function () {
	          zoomed(d3.event.translate, d3.event.scale);
	        });
	
	        svg.call(zoom);
	
	        zoom.translate([100, 100]).scale(diagram.config(GRAPH_ZOOM).value);
	
	        zoomed(zoom.translate(), zoom.scale());
	
	        force = d3.layout.force().size([width, height]).charge(conf.charge || -10000).linkDistance(conf.linkDistance || 140).on("tick", tick);
	
	        drag = d3.behavior.drag().origin(function (da) {
	          return da;
	        }).on("dragstart", dragstarted).on("drag", dragged).on("dragend", dragended);
	
	        force.nodes(parsedData.nodes).links(parsedData.links).start();
	
	        container.append("svg:defs").selectAll("marker").data(markers).enter().append("svg:marker").attr({
	          'class': 'arrow-head',
	          fill: dTextFn('color'),
	          id: dTextFn('id', 'arrow-head-'),
	          markerHeight: 8,
	          markerWidth: 8,
	          orient: 'auto',
	          refX: 19,
	          refY: curvedArrows ? -1.5 : 0,
	          viewBox: '0 -5 10 10'
	        }).append("svg:path").attr("d", "M0,-5L10,0L0,5");
	
	        link = container.selectAll(".link").data(parsedData.links).enter().append('g').attr("class", function () {
	          var finalClass = 'link';
	
	          if (diagram.config(SHY_CONNECTIONS)) finalClass += ' shy-link shy-link-hidden';
	
	          return finalClass;
	        });
	        link.append("svg:path").attr({
	          'class': 'link-path',
	          'marker-end': function markerEnd(da) {
	            return 'url(#arrow-head-' + da.source.id + ')';
	          }
	        }).style({
	          stroke: dTextFn('color'),
	          'stroke-dasharray': function strokeDasharray(da) {
	            if (da.data.line === 'plain') return null;else if (da.data.line === 'dotted') return '5,5';
	          }
	        });
	
	        linkOuter = link.append('g');
	        linkOuter.append('svg:path').attr('class', 'link-path-outer');
	        linkOuter.each(function (da) {
	          diagram.addMouseListenersToEl(d3.select(this), da.data, {
	            mouseenter: function mouseenter(eLink) {
	              setLinkIsHidingIfNecessary(false, eLink);
	            },
	            mouseleave: function mouseleave(eLink) {
	              setLinkIsHidingIfNecessary(true, eLink);
	            }
	          });
	        });
	
	        node = container.selectAll(".node").data(parsedData.nodes).enter().append('g').attr({
	          'class': function _class(da) {
	            var finalClass = 'node';
	
	            if (da.hidden === true) finalClass += ' node-hidden';
	
	            return finalClass;
	          },
	          id: dTextFn('id', 'node-')
	        });
	
	        node.each(function (singleNode) {
	          var singleNodeClasses = '';
	
	          singleNodeEl = d3.select(this);
	          singleNode.fullText = _diagrams2['default'].utils.generateATextDescriptionStr(singleNode.name, singleNode.description);
	
	          if (singleNode.shape === 'circle') {
	            shapeEl = singleNodeEl.append("circle").attr({
	              fill: dTextFn('color'),
	              r: 12
	            });
	          } else {
	            shape = d3.svg.symbol().size(750);
	            shapeEl = singleNodeEl.append("path");
	
	            if (singleNode.shape === 'triangle') {
	              shape = shape.type('triangle-up');
	              singleNodeClasses += ' triangle';
	            } else if (singleNode.shape === 'square') {
	              shape = shape.type('square');
	              singleNodeClasses += ' square';
	            }
	            shapeEl = shapeEl.attr({
	              d: shape,
	              fill: dTextFn('color')
	            });
	            _diagrams2['default'].utils.applySimpleTransform(shapeEl);
	          }
	
	          if (dragNodesConfig === true) shapeEl.call(drag);
	
	          if (singleNode.bold === true) singleNodeClasses += ' bold';else singleNodeClasses += ' thin';
	          shapeEl.attr('class', singleNodeClasses);
	
	          singleNode.shapeEl = shapeEl;
	          diagram.addMouseListenersToEl(shapeEl, singleNode, {
	            click: function click(eNode) {
	              if (eNode.data.linkToUrl) window.open(eNode.data.linkToUrl);
	            },
	            mouseenter: function mouseenter(nodeData) {
	              if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('show', nodeData);
	            },
	            mouseleave: function mouseleave(nodeData) {
	              if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('hide', nodeData);
	            }
	          });
	        });
	
	        node.append("text").text(dTextFn('name'));
	
	        setRelationships();
	        setReRender(conf);
	        diagram.listen('configuration-changed', function (config) {
	          if (config.key === SHY_CONNECTIONS || config.key === GRAPH_DRAG) {
	            setReRender(config);
	            diagram.removePreviousAndCreate(creationId, data, config);
	          }
	        });
	      }
	    }]);
	
	    return Graph;
	  })(_diagrams2['default'].Diagram);
	
	  new Graph({
	    configuration: (_configuration = {}, _defineProperty(_configuration, CURVED_ARROWS, false), _defineProperty(_configuration, GRAPH_DRAG, false), _defineProperty(_configuration, GRAPH_ZOOM, graphZoomConfig), _defineProperty(_configuration, SHY_CONNECTIONS, true), _defineProperty(_configuration, 'info', null), _configuration),
	    configurationKeys: {
	      SHY_CONNECTIONS: SHY_CONNECTIONS
	    },
	    helpers: _helpers2['default'],
	    name: 'graph'
	  });
	};
	
	module.exports = exports['default'];

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _methodsWithCode2 = __webpack_require__(49);
	
	var _methodsWithCode3 = _interopRequireDefault(_methodsWithCode2);
	
	var _Grid = __webpack_require__(50);
	
	var _Grid2 = _interopRequireDefault(_Grid);
	
	var _calculateLayerWithChildrenDimensions = __webpack_require__(51);
	
	var _calculateLayerWithChildrenDimensions2 = _interopRequireDefault(_calculateLayerWithChildrenDimensions);
	
	var _connectWithOpt = __webpack_require__(53);
	
	var _connectWithOpt2 = _interopRequireDefault(_connectWithOpt);
	
	var _connectWithOptAndIdOpt = __webpack_require__(54);
	
	var _connectWithOptAndIdOpt2 = _interopRequireDefault(_connectWithOptAndIdOpt);
	
	var _dataFromGeneralToSpecific = __webpack_require__(55);
	
	var _dataFromGeneralToSpecific2 = _interopRequireDefault(_dataFromGeneralToSpecific);
	
	var _dataFromSpecificToGeneral = __webpack_require__(56);
	
	var _dataFromSpecificToGeneral2 = _interopRequireDefault(_dataFromSpecificToGeneral);
	
	var _extendOpts = __webpack_require__(57);
	
	var _extendOpts2 = _interopRequireDefault(_extendOpts);
	
	var _generateLayersData = __webpack_require__(60);
	
	var _generateLayersData2 = _interopRequireDefault(_generateLayersData);
	
	var _getConfig = __webpack_require__(61);
	
	var _getConfig2 = _interopRequireDefault(_getConfig);
	
	var _getFinalLayerDimensions = __webpack_require__(64);
	
	var _getFinalLayerDimensions2 = _interopRequireDefault(_getFinalLayerDimensions);
	
	var _getStaticOptsLetters = __webpack_require__(59);
	
	var _getStaticOptsLetters2 = _interopRequireDefault(_getStaticOptsLetters);
	
	var _handleConnectedToNextCaseIfNecessary = __webpack_require__(62);
	
	var _handleConnectedToNextCaseIfNecessary2 = _interopRequireDefault(_handleConnectedToNextCaseIfNecessary);
	
	var _idOpt = __webpack_require__(58);
	
	var _idOpt2 = _interopRequireDefault(_idOpt);
	
	var _idsHandler = __webpack_require__(63);
	
	var _idsHandler2 = _interopRequireDefault(_idsHandler);
	
	var _itemsOfLayerShouldBeSorted = __webpack_require__(52);
	
	var _itemsOfLayerShouldBeSorted2 = _interopRequireDefault(_itemsOfLayerShouldBeSorted);
	
	var _newLayer = __webpack_require__(65);
	
	var _newLayer2 = _interopRequireDefault(_newLayer);
	
	var _newLayerConnectedToNext = __webpack_require__(66);
	
	var _newLayerConnectedToNext2 = _interopRequireDefault(_newLayerConnectedToNext);
	
	var _ref = _;
	var each = _ref.each;
	
	var helpers = {
	  Grid: _Grid2["default"],
	  calculateLayerWithChildrenDimensions: _calculateLayerWithChildrenDimensions2["default"],
	  connectWithOpt: _connectWithOpt2["default"],
	  connectWithOptAndIdOpt: _connectWithOptAndIdOpt2["default"],
	  dataFromGeneralToSpecific: _dataFromGeneralToSpecific2["default"],
	  dataFromSpecificToGeneral: _dataFromSpecificToGeneral2["default"],
	  extendOpts: _extendOpts2["default"],
	  generateLayersData: _generateLayersData2["default"],
	  getConfig: _getConfig2["default"],
	  getFinalLayerDimensions: _getFinalLayerDimensions2["default"],
	  getStaticOptsLetters: _getStaticOptsLetters2["default"],
	  handleConnectedToNextCaseIfNecessary: _handleConnectedToNextCaseIfNecessary2["default"],
	  idOpt: _idOpt2["default"],
	  idsHandler: _idsHandler2["default"],
	  itemsOfLayerShouldBeSorted: _itemsOfLayerShouldBeSorted2["default"],
	  newLayer: _newLayer2["default"],
	  newLayerConnectedToNext: _newLayerConnectedToNext2["default"]
	};
	
	each(['newLayer', 'newLayerConnectedToNext'], function (helpersMethod) {
	  return (0, _methodsWithCode3["default"])(helpers, helpersMethod);
	});
	
	exports["default"] = helpers;
	module.exports = exports["default"];

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	exports["default"] = function (helpers, helpersMethod) {
	  helpers[helpersMethod + "WithCode"] = function (codeLanguage) {
	    var codeFn = _diagrams2["default"].utils.codeBlockOfLanguageFn(codeLanguage);
	
	    return function () {
	      arguments[0] = codeFn(arguments[0]);
	
	      return helpers[helpersMethod].apply(helpers, arguments);
	    };
	  };
	
	  helpers[helpersMethod + "WithParagraphAndCode"] = function (codeLanguage) {
	    var codeFn = _diagrams2["default"].utils.codeBlockOfLanguageFn(codeLanguage);
	
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      var paragraphText = args[0];
	      var code = args[1];
	      var text = _diagrams2["default"].utils.wrapInParagraph(paragraphText) + codeFn(code);
	
	      args = args.splice(2);
	      args.unshift(text);
	
	      return helpers[helpersMethod].apply(this, args);
	    };
	  };
	};
	
	module.exports = exports["default"];

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ref = _;
	var isUndefined = _ref.isUndefined;
	
	var Grid = (function () {
	  function Grid(fixedWidth) {
	    _classCallCheck(this, Grid);
	
	    this.position = {
	      x: 0,
	      y: 0
	    };
	    this.width = fixedWidth;
	    this.cells = [];
	  }
	
	  _createClass(Grid, [{
	    key: "addItemAtNewRow",
	    value: function addItemAtNewRow(item) {
	      var counter = 0;
	
	      this.position.x = 0;
	      while (counter < 1000) {
	        this.position.y += 1;
	
	        if (this.itemFitsAtCurrentPos(item)) break;
	      }
	      this.addItemAtCurrentPos(item);
	    }
	  }, {
	    key: "addItemAtCurrentPos",
	    value: function addItemAtCurrentPos(item) {
	      this.addItemAtPos(item, this.position);
	    }
	  }, {
	    key: "createRowIfNecessary",
	    value: function createRowIfNecessary(posY) {
	      if (isUndefined(this.cells[posY])) this.cells[posY] = [];
	    }
	  }, {
	    key: "addItemAtPos",
	    value: function addItemAtPos(item, pos) {
	      var row = undefined;
	
	      item.x = pos.x;
	      item.y = pos.y;
	
	      for (var i = 0; i < item.height; i++) {
	        this.createRowIfNecessary(i + pos.y);
	        row = this.cells[i + pos.y];
	
	        for (var j = 0; j < item.width; j++) {
	          row[j + pos.x] = true;
	        }
	      }
	      this.updatePosition();
	    }
	  }, {
	    key: "updatePosition",
	    value: function updatePosition() {
	      var counter = 0;
	
	      while (counter < 1000) {
	        this.position.x += 1;
	
	        if (this.position.x === this.width) {
	          this.position.x = -1;
	          this.position.y += 1;
	          this.createRowIfNecessary(this.position.y);
	        } else if (this.cells[this.position.y][this.position.x] !== true) {
	          break;
	        }
	        counter++;
	      }
	    }
	  }, {
	    key: "itemFitsAtPos",
	    value: function itemFitsAtPos(item, pos) {
	      var row = undefined;
	
	      for (var i = 0; i < item.height; i++) {
	        row = this.cells[i + pos.y];
	
	        if (isUndefined(row)) return true;
	
	        for (var j = 0; j < item.width; j++) {
	          if (row[j + pos.x] === true) return false;
	
	          if (j + pos.x + 1 > this.width) return false;
	        }
	      }
	
	      return true;
	    }
	  }, {
	    key: "itemFitsAtCurrentPos",
	    value: function itemFitsAtCurrentPos(item) {
	      return this.itemFitsAtPos(item, this.position);
	    }
	  }, {
	    key: "movePositionToNextRow",
	    value: function movePositionToNextRow() {
	      this.position.y++;
	      this.position.x = 0;
	      this.createRowIfNecessary(this.position.y);
	    }
	  }, {
	    key: "lastRowIsEmpty",
	    value: function lastRowIsEmpty() {
	      var rows = this.cells.length;
	
	      for (var i = 0; i < this.width; i++) {
	        if (this.cells[rows - 1][i] === true) return false;
	      }
	
	      return true;
	    }
	  }, {
	    key: "getSize",
	    value: function getSize() {
	      var rows = this.cells.length;
	
	      return {
	        height: this.lastRowIsEmpty() ? rows - 1 : rows,
	        width: this.width
	      };
	    }
	  }]);
	
	  return Grid;
	})();
	
	exports["default"] = Grid;
	module.exports = exports["default"];

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Grid = __webpack_require__(50);
	
	var _Grid2 = _interopRequireDefault(_Grid);
	
	var _itemsOfLayerShouldBeSorted = __webpack_require__(52);
	
	var _itemsOfLayerShouldBeSorted2 = _interopRequireDefault(_itemsOfLayerShouldBeSorted);
	
	var _ref = _;
	var each = _ref.each;
	
	exports['default'] = function (diagram, layer) {
	  var itemsOfLayer = undefined,
	      grid = undefined,
	      itemsOfLayerIndex = undefined,
	      width = undefined,
	      gridSize = undefined,
	      itemsShouldBeSorted = undefined;
	  var totalWidth = 0;
	  var totalHeight = 0;
	  var maxWidth = 0;
	  var maxHeight = 0;
	  var whileCounter = 0;
	  var itemsArray = [];
	  var addedItemToGrid = function addedItemToGrid(index) {
	    if (itemsOfLayer[index].inNewRow === true) {
	      grid.addItemAtNewRow(itemsOfLayer[index]);
	      itemsOfLayer.splice(index, 1);
	
	      return true;
	    } else if (grid.itemFitsAtCurrentPos(itemsOfLayer[index])) {
	      grid.addItemAtCurrentPos(itemsOfLayer[index]);
	      itemsOfLayer.splice(index, 1);
	
	      return true;
	    } else {
	      return false;
	    }
	  };
	
	  each(layer.items, function (item) {
	    totalWidth += item.width;
	    totalHeight += item.height;
	    maxHeight = item.height > maxHeight ? item.height : maxHeight;
	    maxWidth = item.width > maxWidth ? item.width : maxWidth;
	    itemsArray.push(item);
	  });
	
	  if (totalWidth / 2 >= maxWidth) {
	    if (totalHeight > totalWidth) {
	      if (totalHeight / 2 < layer.items.length) width = Math.ceil(totalWidth / 2);else width = totalWidth;
	    } else width = Math.ceil(totalWidth / 2);
	  } else width = maxWidth;
	
	  width = diagram.maxUnityWidth < width ? diagram.maxUnityWidth : width;
	
	  grid = new _Grid2['default'](width);
	
	  itemsShouldBeSorted = (0, _itemsOfLayerShouldBeSorted2['default'])(itemsArray);
	
	  if (itemsShouldBeSorted) {
	    itemsOfLayer = itemsArray.sort(function (itemA, itemB) {
	      if (itemA.width === itemB.width) {
	        return itemA.height < itemB.height;
	      } else {
	        return itemA.width < itemB.width;
	      }
	    });
	  } else itemsOfLayer = itemsArray;
	  addedItemToGrid(0);
	  itemsOfLayerIndex = 0;
	  while (itemsOfLayer.length > 0 && whileCounter < 1000) {
	    if (addedItemToGrid(itemsOfLayerIndex)) {
	      itemsOfLayerIndex = 0;
	    } else {
	      if (itemsShouldBeSorted) {
	        itemsOfLayerIndex++;
	
	        if (itemsOfLayerIndex === itemsOfLayer.length) {
	          itemsOfLayerIndex = 0;
	          grid.movePositionToNextRow();
	        }
	      } else {
	        grid.movePositionToNextRow();
	      }
	    }
	    whileCounter++;
	  }
	
	  gridSize = grid.getSize();
	  // This two values only persist if the layer is a top one
	  layer.x = 0;
	  layer.y = 0;
	  layer.width = gridSize.width;
	  layer.height = layer.items.length > 0 ? gridSize.height + 1 : gridSize.height;
	};
	
	module.exports = exports['default'];

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _ref = _;
	var each = _ref.each;
	
	exports['default'] = function (itemsArray) {
	  var ret = true;
	
	  each(itemsArray, function (item) {
	    if (item.hasOwnProperty('connectedTo')) ret = false;
	
	    if (item.hasOwnProperty('connectToNext')) ret = false;
	  });
	
	  return ret;
	};
	
	module.exports = exports['default'];

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _ref = _;
	var each = _ref.each;
	var isNumber = _ref.isNumber;
	var isUndefined = _ref.isUndefined;
	
	exports['default'] = function (ids, result, type) {
	  var objs = [];
	
	  if (isNumber(ids)) ids = [ids];
	  type = type || 'standard';
	
	  each(ids, function (id) {
	    objs.push({
	      id: 'layer-' + id + '-custom',
	      type: type
	    });
	  });
	
	  if (isUndefined(result.connectedTo) === true) result.connectedTo = objs;else result.connectedTo = result.connectedTo.concat(objs);
	};
	
	module.exports = exports['default'];

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _ref = _;
	var extend = _ref.extend;
	
	exports["default"] = function (ids, id) {
	  var connectWithOpt = _diagrams2["default"].layer.connectWithOpt(ids);
	  var idOpt = _diagrams2["default"].layer.idOpt(id);
	
	  return extend(connectWithOpt, idOpt);
	};
	
	module.exports = exports["default"];

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	exports["default"] = function (generalData) {
	  return _diagrams2["default"].utils.dataFromGeneralToSpecificForATreeStructureType(generalData);
	};
	
	module.exports = exports["default"];

/***/ },
/* 56 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _ref = _;
	var each = _ref.each;
	
	exports["default"] = function (conf) {
	  var maxId = -1;
	  var finalItems = [];
	  var connections = [];
	  var recursiveFn = function recursiveFn(items, parentCreatedItem) {
	    each(items, function (item) {
	      var firstOccurrence = /(\. |:)/.exec(item.fullText);
	      var name = undefined,
	          description = undefined,
	          splittedText = undefined,
	          createdItem = undefined;
	
	      if (firstOccurrence) {
	        splittedText = item.fullText.split(firstOccurrence[0]);
	        name = splittedText[0];
	        description = splittedText.slice(1).join(firstOccurrence);
	      }
	      createdItem = {
	        description: description || null,
	        graphsData: {
	          layer: {
	            id: item.id,
	            relationships: item.options
	          }
	        },
	        id: ++maxId,
	        name: name || item.fullText
	      };
	      finalItems.push(createdItem);
	
	      if (parentCreatedItem) {
	        connections.push({
	          from: createdItem.id,
	          to: parentCreatedItem.id
	        });
	      }
	
	      if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem);
	    });
	  };
	
	  recursiveFn([conf]);
	
	  return {
	    connections: connections,
	    items: finalItems
	  };
	};
	
	module.exports = exports["default"];

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _idOpt = __webpack_require__(58);
	
	var _idOpt2 = _interopRequireDefault(_idOpt);
	
	var _getStaticOptsLetters = __webpack_require__(59);
	
	var _getStaticOptsLetters2 = _interopRequireDefault(_getStaticOptsLetters);
	
	var _connectWithOpt = __webpack_require__(53);
	
	var _connectWithOpt2 = _interopRequireDefault(_connectWithOpt);
	
	var _ref = _;
	var each = _ref.each;
	var extend = _ref.extend;
	var isObject = _ref.isObject;
	
	exports["default"] = function () {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var result = {};
	
	  each(args, function (arg) {
	    if (typeof arg === 'string') {
	      each(arg.split(' '), function (opt) {
	        if (opt.substr(0, 3) === 'id-') result = extend(result, (0, _idOpt2["default"])(opt.substr(3, opt.length)));else if (opt.substr(0, 3) === 'ct-') (0, _connectWithOpt2["default"])(Number(opt.substr(3, opt.length)), result);else if (opt.substr(0, 4) === 'ctd-') (0, _connectWithOpt2["default"])(Number(opt.substr(4, opt.length)), result, 'dashed');else result = extend(result, (0, _getStaticOptsLetters2["default"])()[opt]);
	      });
	    } else if (isObject(arg)) {
	      result = extend(result, arg);
	    }
	  });
	
	  return result;
	};
	
	module.exports = exports["default"];

/***/ },
/* 58 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports["default"] = function (id) {
	  return {
	    id: "layer-" + id + "-custom"
	  };
	};
	
	module.exports = exports["default"];

/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	exports['default'] = function () {
	  return {
	    cn: {
	      connectedWithNext: true
	    },
	    cnd: {
	      connectedWithNext: {
	        type: 'dashed'
	      }
	    },
	    co: {
	      conditional: true
	    },
	    nr: {
	      inNewRow: true
	    },
	    sn: {
	      showNumbers: true
	    },
	    sna: {
	      showNumbersAll: true
	    }
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _calculateLayerWithChildrenDimensions = __webpack_require__(51);
	
	var _calculateLayerWithChildrenDimensions2 = _interopRequireDefault(_calculateLayerWithChildrenDimensions);
	
	var _getConfig = __webpack_require__(61);
	
	var _getConfig2 = _interopRequireDefault(_getConfig);
	
	var _handleConnectedToNextCaseIfNecessary = __webpack_require__(62);
	
	var _handleConnectedToNextCaseIfNecessary2 = _interopRequireDefault(_handleConnectedToNextCaseIfNecessary);
	
	var _ref = _;
	var each = _ref.each;
	
	var generateLayersData = function generateLayersData(diagram, layers, currentDepth) {
	  var config = (0, _getConfig2['default'])();
	  var maxDepth = undefined,
	      itemsDepth = undefined;
	
	  currentDepth = currentDepth || 1;
	  maxDepth = currentDepth;
	  each(layers, function (layer, layerIndex) {
	    if (layer.showNumbersAll === true) config.showNumbersAll = true;
	    layer.depth = currentDepth;
	    (0, _handleConnectedToNextCaseIfNecessary2['default'])(layers, layerIndex);
	
	    if (layer.items.length > 0) {
	      itemsDepth = generateLayersData(diagram, layer.items, currentDepth + 1);
	      layer.maxLayerDepthBelow = itemsDepth - currentDepth;
	      (0, _calculateLayerWithChildrenDimensions2['default'])(diagram, layer);
	      maxDepth = maxDepth < itemsDepth ? itemsDepth : maxDepth;
	    } else {
	      layer.maxLayerDepthBelow = 0;
	      layer.width = 1;
	      layer.height = 1;
	      maxDepth = maxDepth < itemsDepth ? itemsDepth : maxDepth;
	    }
	    layer.alreadyConnections = [];
	  });
	
	  return maxDepth;
	};
	
	exports['default'] = generateLayersData;
	module.exports = exports['default'];

/***/ },
/* 61 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports["default"] = function () {
	  return {
	    depthHeightFactor: 2,
	    depthWidthFactor: 4,
	    heightSize: 60,
	    showNumbersAll: false,
	    widthSize: 350
	  };
	};
	
	module.exports = exports["default"];

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _idsHandler = __webpack_require__(63);
	
	var _idsHandler2 = _interopRequireDefault(_idsHandler);
	
	var _ref = _;
	var isObject = _ref.isObject;
	
	exports["default"] = function (layers, currentIndex) {
	  var layer = layers[currentIndex];
	  var nextLayer = layers[currentIndex + 1];
	  var connectedTo = undefined,
	      newId = undefined;
	
	  if (layer.hasOwnProperty('connectedWithNext') === true && nextLayer) {
	    if (nextLayer.id) newId = nextLayer.id;else {
	      newId = "to-next-" + String(_idsHandler2["default"].increase());
	      nextLayer.id = newId;
	    }
	
	    if (isObject(layer.connectedWithNext) && layer.connectedWithNext.type) {
	      connectedTo = {
	        id: newId,
	        type: layer.connectedWithNext.type
	      };
	    } else connectedTo = newId;
	
	    if (layer.connectedTo) layer.connectedTo.push(connectedTo);else layer.connectedTo = [connectedTo];
	  }
	};
	
	module.exports = exports["default"];

/***/ },
/* 63 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ids = 0;
	
	exports["default"] = {
	  increase: function increase() {
	    return ++ids;
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _getConfig = __webpack_require__(61);
	
	var _getConfig2 = _interopRequireDefault(_getConfig);
	
	exports['default'] = function (layer) {
	  var config = (0, _getConfig2['default'])();
	  var height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2;
	  var width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2;
	  var transform = 'translate(' + config.depthWidthFactor * layer.depth + ',' + (config.depthHeightFactor * layer.depth + ')');
	  var fill = 'url(#color-' + String(layer.depth - 1) + ')';
	  var dimensions = { fill: fill, height: height, transform: transform, width: width };
	
	  if (config.showNumbersAll === true || layer.containerData && layer.containerData.showNumbers === true) {
	    dimensions.numberTransform = 'translate(' + (String(width - 15 + config.depthWidthFactor * layer.depth) + ',') + (String(config.depthHeightFactor * layer.depth + height + 0) + ')');
	  }
	
	  return dimensions;
	};
	
	module.exports = exports['default'];

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _idsHandler = __webpack_require__(63);
	
	var _idsHandler2 = _interopRequireDefault(_idsHandler);
	
	var _extendOpts = __webpack_require__(57);
	
	var _extendOpts2 = _interopRequireDefault(_extendOpts);
	
	var _ref = _;
	var extend = _ref.extend;
	var isArray = _ref.isArray;
	var isObject = _ref.isObject;
	var isString = _ref.isString;
	var isUndefined = _ref.isUndefined;
	
	exports['default'] = function (text, opts, items) {
	  var layer = { text: text };
	
	  if (isArray(opts)) items = opts;else {
	    if (isString(opts)) opts = (0, _extendOpts2['default'])(opts);
	
	    if (isObject(opts)) layer = extend(layer, opts);
	  }
	
	  if (items) layer.items = items;
	
	  // Have to limit the id by the two sides to enable .indexOf to work
	  if (isUndefined(layer.id)) layer.id = 'layer-' + _idsHandler2['default'].increase() + '-auto';
	
	  return layer;
	};
	
	module.exports = exports['default'];

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _newLayer = __webpack_require__(65);
	
	var _newLayer2 = _interopRequireDefault(_newLayer);
	
	exports['default'] = function () {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var argsLength = args.length;
	
	  if (argsLength === 1) return (0, _newLayer2['default'])(args[0], 'cn');else if (argsLength === 2) {
	    if (typeof args[1] === 'object') return (0, _newLayer2['default'])(args[0], 'cn', args[1]);else if (typeof (args[1] === 'string')) return (0, _newLayer2['default'])(args[0], args[1] + ' cn');
	  } else if (argsLength === 3) return (0, _newLayer2['default'])(args[0], args[1] + ' cn', args[2]);
	};
	
	module.exports = exports['default'];

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _helpers = __webpack_require__(48);
	
	var _helpers2 = _interopRequireDefault(_helpers);
	
	exports['default'] = function () {
	  var layerGId = 0;
	  var dTextFn = _diagrams2['default'].utils.textFn;
	
	  var Layer = (function (_d$Diagram) {
	    _inherits(Layer, _d$Diagram);
	
	    function Layer() {
	      _classCallCheck(this, Layer);
	
	      _get(Object.getPrototypeOf(Layer.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(Layer, [{
	      key: 'create',
	      value: function create(creationId, conf) {
	        var diagram = this;
	        var config = _helpers2['default'].getConfig();
	        var colors = ['#ECD078', '#D95B43', '#C02942', '#78E4B7', '#53777A', '#00A8C6', '#AEE239', '#FAAE8A'];
	        var addItemsPropToBottomItems = function addItemsPropToBottomItems(layers) {
	          _.each(layers, function (layer) {
	            if (layer.hasOwnProperty('items') === false) {
	              layer.items = [];
	            } else addItemsPropToBottomItems(layer.items);
	          });
	        };
	        var calculateTheMostOptimalConnection = function calculateTheMostOptimalConnection(layerA, layerBObj) {
	          // There are 12 possible: 4 sides to 3 each
	          var getTopSidePos = function getTopSidePos(layer) {
	            return {
	              x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
	              y: layer.y * config.heightSize + config.depthHeightFactor * layer.depth
	            };
	          };
	          var getBottomSidePos = function getBottomSidePos(layer) {
	            return {
	              x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
	              y: (layer.y + layer.height) * config.heightSize - config.depthHeightFactor * layer.depth
	            };
	          };
	          var getLeftSidePos = function getLeftSidePos(layer) {
	            return {
	              x: layer.x * config.widthSize + config.depthWidthFactor * layer.depth,
	              y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
	            };
	          };
	          var getRightSidePos = function getRightSidePos(layer) {
	            return {
	              x: (layer.x + layer.width) * config.widthSize - config.depthWidthFactor * layer.depth,
	              y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
	            };
	          };
	          var getSidesPos = function getSidesPos(layer) {
	            return {
	              bottom: getBottomSidePos(layer),
	              left: getLeftSidePos(layer),
	              right: getRightSidePos(layer),
	              top: getTopSidePos(layer)
	            };
	          };
	          var distance = {
	            val: Infinity
	          };
	          var doesNotCrossAnyOfTwoLayers = function doesNotCrossAnyOfTwoLayers(_ref) {
	            var posA = _ref.posA;
	            var posB = _ref.posB;
	            var sideA = _ref.sideA;
	            var sideB = _ref.sideB;
	
	            if ((sideA === 'bottom' || sideA === 'left' || sideA === 'top') && sideB === 'right') {
	              if (posA.x < posB.x) return false;
	            } else if ((sideA === 'bottom' || sideA === 'right' || sideA === 'top') && sideB === 'left') {
	              if (posA.x > posB.x) return false;
	            } else if ((sideA === 'bottom' || sideA === 'right' || sideA === 'left') && sideB === 'top') {
	              if (posA.y > posB.y) return false;
	            } else if ((sideA === 'left' || sideA === 'right' || sideA === 'top') && sideB === 'bottom') {
	              if (posA.y < posB.y) return false;
	            }
	
	            return true;
	          };
	          var calcDistanceAndUpdate = function calcDistanceAndUpdate(posA, posB) {
	            var e2 = function e2(num) {
	              return Math.pow(num, 2);
	            };
	            var newDistance = Math.sqrt(e2(posA.x - posB.x) + e2(posA.y - posB.y));
	
	            if (newDistance < distance.val) {
	              distance.val = newDistance;
	              distance.from = posA;
	              distance.to = posB;
	
	              return true;
	            } else {
	              return false;
	            }
	          };
	          var eachSide = function eachSide(cb) {
	            _.each(['top', 'bottom', 'left', 'right'], function (side) {
	              cb(side);
	            });
	          };
	          var sameTypeOfSides = function sameTypeOfSides(sideA, sideB) {
	            var result = false;
	
	            _.each([[sideA, sideB], [sideB, sideA]], function (sides) {
	              if (sides[0] === 'top' && sides[1] === 'bottom') result = true;else if (sides[0] === 'left' && sides[1] === 'right') result = true;
	            });
	
	            return result;
	          };
	          var loopSidesToGetConnection = function loopSidesToGetConnection(sameTypeOfSidesCondition) {
	            eachSide(function (sideA) {
	              eachSide(function (sideB) {
	                if (_.isUndefined(layerB.alreadyConnections)) layerB.alreadyConnections = [];
	
	                if (sideA !== sideB && layerA.alreadyConnections.indexOf(sideA) < 0 && layerB.alreadyConnections.indexOf(sideB) < 0) {
	                  if (sameTypeOfSidesCondition === false && sameTypeOfSides(sideA, sideB) === false || sameTypeOfSides(sideA, sideB)) {
	                    if (doesNotCrossAnyOfTwoLayers({ posA: layerAPos[sideA],
	                      posB: layerBPos[sideB], sideA: sideA, sideB: sideB })) {
	                      changed = calcDistanceAndUpdate(layerAPos[sideA], layerBPos[sideB]);
	
	                      if (changed === true) {
	                        distance.sideA = sideA;
	                        distance.sideB = sideB;
	                      }
	                    }
	                  }
	                }
	              });
	            });
	          };
	          var layerB = layerBObj.layer;
	          var layerAPos = getSidesPos(layerA);
	          var layerBPos = getSidesPos(layerB);
	          var changed = undefined;
	
	          loopSidesToGetConnection(true);
	
	          if (changed !== true) loopSidesToGetConnection(false);
	
	          layerA.alreadyConnections.push(distance.sideA);
	          layerB.alreadyConnections.push(distance.sideB);
	
	          return distance;
	        };
	        var drawConnection = function drawConnection(connection) {
	          var container = connection.layer.container;
	          var containerData = connection.layer.containerData;
	          var connectionG = undefined,
	              connectionId = undefined,
	              connectionCoords = undefined,
	              linkLine = undefined,
	              connectionPath = undefined;
	
	          _.each(connection.connectedTo, function (connectedToLayer) {
	            connectionCoords = calculateTheMostOptimalConnection(connection.layer, connectedToLayer);
	            linkLine = d3.svg.line().x(dTextFn('x')).y(dTextFn('y'));
	            connectionId = connection.layer.id + '-' + connectedToLayer.layer.id;
	            connectionG = container.append('g').attr('id', connectionId);
	
	            if (connectionCoords.from && connectionCoords.to) {
	              connectionPath = connectionG.append('path').attr('d', linkLine([connectionCoords.from, connectionCoords.to])).style({
	                fill: 'none',
	                stroke: '#000'
	              });
	
	              if (connectedToLayer.type === 'dashed') connectionPath.style('stroke-dasharray', '5, 5');
	
	              connectionG.append("circle").attr({
	                cx: connectionCoords.to.x,
	                cy: connectionCoords.to.y,
	                fill: colors[connection.layer.depth - 1],
	                r: 5
	              }).style({
	                stroke: '#000'
	              });
	
	              containerData.connections = containerData.connections || [];
	              containerData.connections.push({
	                el: connectionG,
	                id: connectionId
	              });
	            }
	          });
	        };
	        var drawConnectionsIfAny = function drawConnectionsIfAny(layers) {
	          layers = layers || conf;
	
	          _.chain(layers).filter(function (layer) {
	            return layer.hasOwnProperty('connectedTo');
	          }).map(function (layer) {
	            var layersConnectedTo = [];
	            var layerConnectedObj = undefined,
	                layerConnectedId = undefined,
	                layerConnectedType = undefined;
	
	            _.each(layer.connectedTo, function (layerConnected) {
	              layerConnectedId = _.isObject(layerConnected) ? layerConnected.id : layerConnected;
	              layerConnectedType = _.isObject(layerConnected) && layerConnected.type ? layerConnected.type : 'standard';
	
	              layerConnectedObj = _.where(layers, {
	                id: layerConnectedId
	              })[0];
	
	              layersConnectedTo.push({
	                layer: layerConnectedObj,
	                type: layerConnectedType
	              });
	            });
	
	            return {
	              connectedTo: layersConnectedTo,
	              layer: layer
	            };
	          }).each(function (connection) {
	            drawConnection(connection);
	          }).value();
	
	          _.chain(layers).filter(function (layer) {
	            return layer.items.length > 0;
	          }).each(function (layer) {
	            drawConnectionsIfAny(layer.items);
	          }).value();
	        };
	        var updateSvgHeight = function updateSvgHeight() {
	          var getBottomPointOfLayer = function getBottomPointOfLayer(layer) {
	            return layer.y + layer.height;
	          };
	          var bottomLayer = _.max(conf, getBottomPointOfLayer);
	          var bottomPoint = getBottomPointOfLayer(bottomLayer);
	          var bottomPointPxs = bottomPoint * config.heightSize + 20;
	
	          svg.attr('height', bottomPointPxs);
	        };
	        var calcMaxUnityWidth = function calcMaxUnityWidth() {
	          var bodyWidth = document.body.getBoundingClientRect().width;
	
	          diagram.maxUnityWidth = Math.floor(bodyWidth / config.widthSize);
	        };
	        var drawLayersInContainer = function drawLayersInContainer(layers, container, containerData) {
	          var widthSize = config.widthSize;
	          var heightSize = config.heightSize;
	          var layerG = undefined,
	              layerNode = undefined,
	              layerDims = undefined,
	              layerText = undefined;
	
	          layers = layers || conf;
	          container = container || svg;
	
	          _.each(layers, function (layer, layerIndex) {
	            var currentLayerId = 'diagrams-layer-g-' + layerGId++;
	            var numberG = undefined;
	
	            layerG = container.append('g').attr({
	              'class': 'layer-node',
	              id: currentLayerId,
	              transform: 'translate(' + layer.x * widthSize + ', ' + layer.y * heightSize + ')'
	            });
	
	            layer.layerG = layerG;
	            layer.container = container;
	            layer.containerData = containerData;
	
	            layerDims = _helpers2['default'].getFinalLayerDimensions(layer);
	            layerNode = layerG.append('g');
	
	            if (layer.conditional === true) {
	              layerNode.append('path').attr({
	                d: _diagrams2['default'].shapes.hexagon({
	                  height: layerDims.height,
	                  width: layerDims.width,
	                  widthPercent: 97 + Math.abs(3 - layer.depth)
	                }),
	                fill: layerDims.fill,
	                stroke: '#f00',
	                transform: layerDims.transform
	              });
	            } else {
	              layerNode.append('rect').attr({
	                fill: layerDims.fill,
	                height: layerDims.height,
	                transform: layerDims.transform,
	                width: layerDims.width
	              }).style({
	                filter: 'url(#diagrams-drop-shadow-layer)'
	              });
	            }
	
	            layerText = layerNode.append('text').attr({
	              transform: layerDims.transform,
	              x: layer.depth,
	              y: layer.height * heightSize - 3 * layer.depth - 10
	            }).text(function () {
	              return _diagrams2['default'].utils.formatShortDescription(layer.text);
	            });
	
	            layer.fullText = layer.text;
	            // Missing to add show all layers connections and hide
	            diagram.addMouseListenersToEl(layerNode, layer);
	            layerText.each(_diagrams2['default'].svg.textEllipsis(layer.width * widthSize - config.depthWidthFactor * layer.depth * 2));
	
	            if (layerDims.numberTransform) {
	              numberG = layerNode.append('g').attr({
	                'class': 'number',
	                transform: layerDims.numberTransform
	              });
	              numberG.append('circle').attr({
	                cx: 4,
	                cy: -4,
	                fill: colors[layer.depth - 1],
	                filter: 'none',
	                r: 10,
	                stroke: '#000',
	                'stroke-width': 2
	              });
	              numberG.append('text').text(layerIndex + 1).attr('fill', '#000');
	            }
	
	            if (layer.items.length > 0) {
	              drawLayersInContainer(layer.items, layerG, layer);
	            }
	          });
	        };
	        var svg = _diagrams2['default'].svg.generateSvg({
	          margin: '20px 0 0 20px'
	        });
	
	        diagram.markRelatedFn = function (item) {
	          item.data.origFill = item.data.origFill || item.el.select('rect').style('fill');
	          item.el.select('rect').style({
	            fill: 'rgb(254, 255, 209)'
	          });
	        };
	        diagram.unmarkAllItems = function () {
	          var recursiveFn = function recursiveFn(items) {
	            _.each(items, function (item) {
	              item.layerG.style({
	                'stroke-width': '1px'
	              });
	
	              if (item.origFill) {
	                item.layerG.select('rect').style('fill', item.origFill);
	              }
	
	              if (item.items) recursiveFn(item.items);
	            });
	          };
	
	          recursiveFn(conf);
	        };
	
	        _.each(colors, function (color, index) {
	          _diagrams2['default'].svg.addVerticalGradientFilter(svg, 'color-' + index, ['#fff', color]);
	        });
	
	        svg.attr('class', 'layers-diagram');
	
	        if (_.isArray(conf) === false) conf = [conf];
	        _diagrams2['default'].svg.addFilterColor({ container: svg, deviation: 3, id: 'layer', slope: 2 });
	
	        addItemsPropToBottomItems(conf);
	        calcMaxUnityWidth();
	        _helpers2['default'].generateLayersData(diagram, conf);
	        drawLayersInContainer();
	        drawConnectionsIfAny();
	        updateSvgHeight();
	        diagram.generateRelationships(conf);
	      }
	    }, {
	      key: 'generateRelationships',
	      value: function generateRelationships(layers, containerLayer) {
	        var diagram = this;
	
	        _.each(layers, function (layer) {
	          diagram.generateEmptyRelationships(layer);
	          diagram.addSelfRelationship(layer, layer.layerG, layer);
	
	          if (containerLayer) {
	            diagram.addDependantRelationship(containerLayer, layer.layerG, layer);
	            diagram.addDependencyRelationship(layer, containerLayer.layerG, containerLayer);
	          }
	
	          if (layer.items && layer.items.length > 0) {
	            diagram.generateRelationships(layer.items, layer);
	          }
	        });
	      }
	    }]);
	
	    return Layer;
	  })(_diagrams2['default'].Diagram);
	
	  new Layer({
	    helpers: _helpers2['default'],
	    name: 'layer'
	  });
	};
	
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=diagrams.js.map