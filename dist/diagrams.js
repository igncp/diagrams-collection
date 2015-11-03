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
	
	(function (scope) {
	  _diagrams2['default'].utils = __webpack_require__(2);
	  _diagrams2['default'].events = _diagrams2['default'].utils.createAnEventEmitter();
	  _diagrams2['default'].shared = __webpack_require__(3);
	  _diagrams2['default'].shapes = __webpack_require__(4);
	  _diagrams2['default'].svg = __webpack_require__(5);
	  _diagrams2['default'].Diagram = __webpack_require__(6)();
	
	  _.each(['Box', 'Graph', 'Layer'], function (diagramName) {
	    return __webpack_require__(7)("./" + diagramName)();
	  });
	
	  scope.diagrams = _diagrams2['default'];
	})(window);

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
	var utils = {};
	
	utils.d3DefaultReturnFn = function (props, preffix, suffix) {
	  props = props.split('.');
	  return function (d) {
	    var position = _.reduce(props, function (memo, property) {
	      return memo[property];
	    }, d);
	    return preffix || suffix ? preffix + position + suffix : position;
	  };
	};
	utils.applySimpleTransform = function (el) {
	  el.attr('transform', function (d) {
	    return "translate(" + d.x + "," + d.y + ")";
	  });
	};
	utils.positionFn = function (props, offset) {
	  offset = offset || 0;
	  return utils.d3DefaultReturnFn(props, 0, offset);
	};
	utils.textFn = function (props, preffix, suffix) {
	  preffix = preffix || '';
	  suffix = suffix || '';
	  return utils.d3DefaultReturnFn(props, preffix, suffix);
	};
	utils.runIfReady = function (fn) {
	  if (document.readyState === 'complete') fn();else window.onload = fn;
	};
	utils.replaceCodeFragmentOfText = function (text, predicate) {
	  var codeRegex = /``([\s\S]*?)``([\s\S]*?)``/g,
	      allMatches = text.match(codeRegex);
	
	  return text.replace(codeRegex, function (matchStr, language, codeBlock) {
	    return predicate(matchStr, language, codeBlock, allMatches);
	  });
	};
	utils.formatTextFragment = function (text) {
	  var tagsToEncode = ['strong', 'code', 'pre', 'br', 'span', 'p'],
	      encodeOrDecodeTags = function encodeOrDecodeTags(action, tag) {
	    var encodeOrDecodeTagsWithAction = _.partial(encodeOrDecodeTags, action),
	        beginningTagArr = ['<' + tag + '(.*?)>', '<' + tag + '$1>', tag + 'DIAGSA(.*?)DIAGSB' + tag + 'DIAGSC', tag + 'DIAGSA$1DIAGSB' + tag + 'DIAGSC'],
	        endingTagReal = '</' + tag + '>',
	        endingTagFake = tag + 'ENDREPLACEDDIAGRAMS',
	        endingTagArr = [endingTagReal, endingTagReal, endingTagFake, endingTagFake],
	        replaceText = function replaceText(from, to) {
	      text = text.replace(new RegExp(from, 'g'), to);
	    };
	
	    if (_.isArray(tag)) _.each(tag, encodeOrDecodeTagsWithAction);else {
	      _.each([beginningTagArr, endingTagArr], function (arr) {
	        if (action === 'encode') replaceText(arr[0], arr[3]);else if (action === 'decode') replaceText(arr[2], arr[1]);
	      });
	    }
	  };
	  text = utils.replaceCodeFragmentOfText(text, function (matchStr, language, code, allMatches) {
	    var lastMatch = matchStr === _.last(allMatches);
	    return '<pre' + (lastMatch ? ' class="last-code-block" ' : '') + '><code>' + hljs.highlight(language, code).value + '</pre></code>';
	  });
	
	  encodeOrDecodeTags('encode', tagsToEncode);
	  text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	  encodeOrDecodeTags('decode', tagsToEncode);
	
	  return text;
	};
	utils.codeBlockOfLanguageFn = function (language, commentsSymbol) {
	  commentsSymbol = commentsSymbol || '';
	  return function (codeBlock, where, withInlineStrs) {
	    if (withInlineStrs === true) codeBlock = commentsSymbol + " ...\n" + codeBlock + "\n" + commentsSymbol + " ...";
	    if (_.isString(where)) codeBlock = commentsSymbol + ' @' + where + "\n" + codeBlock;
	    return '``' + language + '``' + codeBlock + '``';
	  };
	};
	// This function is created to be able to reference it in the diagrams
	utils.wrapInParagraph = function (text) {
	  return '<p>' + text + '</p>';
	};
	
	utils.composeWithEventEmitter = function (constructor) {
	  var _subjects = [],
	      createName = function createName(name) {
	    return '$' + name;
	  };
	
	  constructor.prototype.emit = function (name, data) {
	    var fnName = createName(name);
	    _subjects[fnName] || (_subjects[fnName] = new Rx.Subject());
	    _subjects[fnName].onNext(data);
	  };
	
	  constructor.prototype.listen = function (name, handler) {
	    var fnName = createName(name);
	    _subjects[fnName] || (_subjects[fnName] = new Rx.Subject());
	    return _subjects[fnName].subscribe(handler);
	  };
	
	  constructor.prototype.dispose = function () {
	    var subjects = _subjects;
	    for (var prop in subjects) {
	      if (({}).hasOwnProperty.call(subjects, prop)) {
	        subjects[prop].dispose();
	      }
	    }
	
	    _subjects = {};
	  };
	};
	
	utils.createAnEventEmitter = function () {
	  var constructor = function EventEmitter() {};
	
	  utils.composeWithEventEmitter(constructor);
	
	  return new constructor();
	};
	
	utils.generateATextDescriptionStr = function (text, description) {
	  return '<strong>' + text + '</strong>' + (description ? '<br>' + description : '');
	};
	
	utils.formatShortDescription = function (text) {
	  text = text.replace(/<p>/g, '');
	  text = text.replace(/<br>/g, ' ');
	  text = text.replace(/<\/p>/g, '. ');
	  text = utils.replaceCodeFragmentOfText(text, function (matchStr, language, codeBlock) {
	    if (matchStr === text && /\n/.test(matchStr) === false) return codeBlock;else return ' <CODE...>';
	  });
	  return text;
	};
	
	utils.dataFromGeneralToSpecificForATreeStructureType = function (generalData) {
	  // FPN: Find Parent Node
	  var FPNRecursiveFailed = false,
	      itemsIdToItemsMap = {},
	      nodesData = {},
	      findParentNodeFn = function findParentNodeFn() {
	    var itemsChecked,
	        itemsIdToFromConnectionMap = {},
	        FPNRecursiveFn = function FPNRecursiveFn(item) {
	      var connection, parentItemId, parentItem;
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
	  },
	      buildNodesDataRecursiveFn = function buildNodesDataRecursiveFn(transformedData, item) {
	    var text, children;
	
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
	  },
	      parentNode;
	
	  findParentNodeFn();
	  if (FPNRecursiveFailed) {
	    alert('The data structure is not suitable for this diagram');
	    return [];
	  } else {
	    buildNodesDataRecursiveFn(nodesData, parentNode);
	    return nodesData;
	  }
	};
	
	utils.getUrlParams = function () {
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
	};
	
	utils.joinWithLastDifferent = function (arr, separator, lastSeparator) {
	  return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1];
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
	var shared = {
	  get: function get(key) {
	    shared.throwIfSharedMethodAlreadyExists(key);
	    return shared[key];
	  },
	  set: function set(data) {
	    shared.throwIfSharedMethodAlreadyExists(data);
	
	    for (var prop in data) {
	      if (data.hasOwnProperty(prop)) shared[prop] = data[prop];
	    }
	  },
	  getWithStartingBreakLine: function getWithStartingBreakLine() {
	    return "<br>" + shared.get.apply(shared, arguments);
	  },
	  throwIfSharedMethodAlreadyExists: function throwIfSharedMethodAlreadyExists(data) {
	    var keys;
	    if (_.isObject(data)) {
	      keys = Object.keys(data);
	      _.each(keys, shared.throwIfSharedMethodAlreadyExists);
	    } else if (_.isString(data)) {
	      if (shared[methodsVarName].indexOf(data) > 0) throw new Error('Reserved keyword: ' + data);
	    }
	  }
	};
	
	var methodsVarName = 'builtInMethods';
	shared[methodsVarName] = Object.keys(shared);
	shared[methodsVarName].push(methodsVarName);
	
	exports['default'] = shared;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var shapes = {};
	
	shapes.hexagon = function (opts) {
	  var halfHeight = opts.height / 2,
	      halfWidth = opts.width / 2,
	      gap = opts.widthPercent ? (1 - opts.widthPercent / 100) * opts.width : (opts.width - opts.height) / 2,
	      result = '',
	      center,
	      cx,
	      cy;
	
	  center = opts.center || [halfWidth, halfHeight];
	  cx = center[0];
	  cy = center[1];
	
	  result += 'M' + (cx - halfWidth) + ',' + cy;
	  result += 'L' + (cx - halfWidth + gap) + ',' + (cy + halfHeight);
	  result += 'L' + (cx + halfWidth - gap) + ',' + (cy + halfHeight);
	  result += 'L' + (cx + halfWidth) + ',' + cy;
	  result += 'L' + (cx + halfWidth - gap) + ',' + (cy - halfHeight);
	  result += 'L' + (cx - halfWidth + gap) + ',' + (cy - halfHeight);
	  result += 'Z';
	
	  return result;
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
	
	var svg = {};
	
	svg.addVerticalGradientFilter = function (container, id, colors) {
	  var defs = container.append('defs'),
	      linearGradient = defs.append('linearGradient').attr({
	    id: id,
	    x1: '0%',
	    y1: '0%',
	    x2: '0%',
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
	};
	
	svg.addFilterColor = function (id, container, deviation, slope, extra) {
	  var defs = container.append('defs'),
	      filter = defs.append('filter').attr({
	    id: 'diagrams-drop-shadow-' + id
	  });
	
	  if (extra) filter.attr({
	    width: '500%',
	    height: '500%',
	    x: '-200%',
	    y: '-200%'
	  });
	  filter.append('feOffset').attr({
	    result: 'offOut',
	    'in': 'SourceGraphic',
	    dx: 0.5,
	    dy: 0.5
	  });
	  filter.append('feGaussianBlur').attr({
	    result: 'blurOut',
	    'in': 'offOut',
	    stdDeviation: deviation
	  });
	  filter.append('feBlend').attr({
	    'in': 'SourceGraphic',
	    in2: 'blurOut',
	    mode: 'normal'
	  });
	  filter.append('feComponentTransfer').append('feFuncA').attr({
	    type: 'linear',
	    slope: slope
	  });
	};
	
	svg.getDiagramWrapperStr = function () {
	  return _diagrams2['default'].diagramsWrapperSelector || 'body';
	};
	
	svg.generateSvg = function (style) {
	  var selector = svg.getDiagramWrapperStr();
	  var bodyDims = document.body.getBoundingClientRect();
	
	  return d3.select(selector).append('svg').attr({
	    width: bodyDims.width - 40,
	    height: 4000
	  }).style(style);
	};
	
	svg.updateHeigthOfElWithOtherEl = function (el, otherEl, offset) {
	  el.attr({
	    height: otherEl[0][0].getBoundingClientRect().height + (offset || 0)
	  });
	};
	
	svg.textEllipsis = function (width) {
	  return function () {
	    var self = d3.select(this),
	        textLength = self.node().getComputedTextLength(),
	        text = self.text();
	
	    while (textLength > width && text.length > 0) {
	      text = text.slice(0, -4);
	      self.text(text + '...');
	      textLength = self.node().getComputedTextLength();
	    }
	  };
	};
	
	svg.insertInBodyBeforeSvg = function (tag) {
	  var diagramWrapper = svg.getDiagramWrapperStr();
	  var body = d3.select('body');
	  var elementAfterName = diagramWrapper === 'body' ? 'svg' : diagramWrapper;
	  var el = body.insert(tag, elementAfterName);
	
	  return el;
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
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	var _svg = __webpack_require__(5);
	
	var _svg2 = _interopRequireDefault(_svg);
	
	var defaultDiagramConfiguration = {};
	var createdDiagramsMaxId = 0;
	
	_diagrams2['default'].diagramsRegistry = [];
	
	var getDiagramClass = function getDiagramClass() {
	  var Diagram = (function () {
	    _createClass(Diagram, null, [{
	      key: 'convertDiagram',
	      value: function convertDiagram(creationId, toDiagramType) {
	        var item = Diagram.getRegistryItemWithCreationId(creationId),
	            newArgs = item.data.slice(1),
	            generalData,
	            specificData;
	
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
	
	        div.appendButtonToDiv = function (cls, value, onClickFn) {
	          div.append('input').attr({
	            type: 'button',
	            'class': cls + ' diagrams-diagram-button btn btn-default',
	            value: value,
	            onclick: onClickFn
	          });
	        };
	
	        return div;
	      }
	    }, {
	      key: 'getRegistryItemWithCreationId',
	      value: function getRegistryItemWithCreationId(creationId) {
	        var items = _.where(_diagrams2['default'].diagramsRegistry, {
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
	
	      var diagram = this,
	          prototype = Object.getPrototypeOf(diagram);
	
	      diagram.name = opts.name;
	      diagram._configuration = opts.configuration || {};
	
	      prototype.configurationKeys = opts.configurationKeys || {};
	
	      _.each(Object.keys(opts.helpers), function (helperName) {
	        if (_.isFunction(opts.helpers[helperName])) {
	          opts.helpers[helperName] = _.bind(opts.helpers[helperName], diagram);
	        }
	      });
	      _.merge(diagram._configuration, defaultDiagramConfiguration);
	      _.each(Object.keys(diagram._configuration), function (confKey) {
	        diagram.configCheckingLocalStorage(confKey, diagram._configuration[confKey]);
	      });
	      _.defaults(prototype, opts.helpers);
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
	        var diagram = this,
	            emitFn = function emitFn(d3Event, emitedEvent) {
	          emitedEvent = emitedEvent || d3Event;
	          el.on(d3Event, function () {
	            diagram.emit(emitedEvent, emitContent);
	            if (callbacks && callbacks[d3Event]) callbacks[d3Event](emitContent);
	          });
	        },
	            emitContent = {
	          el: el,
	          data: data
	        };
	
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
	        var argsLength = arguments.length,
	            optsType = typeof opts,
	            optsKey;
	
	        if (argsLength === 0) return this._configuration;else if (argsLength === 1) {
	          if (_.isFunction(optsType)) optsKey = opts();else if (_.isString(opts)) optsKey = opts;else if (_.isObject(opts)) {
	            for (var key in opts) {
	              if (opts.hasOwnProperty(key)) this.config(key, opts[key]);
	            }
	            return opts;
	          }
	          return this._configuration[optsKey];
	        } else if (argsLength === 2) {
	          this._configuration[opts] = optValue;
	          if (_.isObject(optValue)) this.setToLocalStorage(opts, optValue.value);else this.setToLocalStorage(opts, optValue);
	
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
	        var diagram = this,
	            finalValue = diagram.getFromLocalStorage(key, defaultValue);
	
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
	        var diagram = this,
	            getAndConvertStrBoolean = function getAndConvertStrBoolean(defaultValue) {
	          var rv = localStorage.getItem(diagram.generateLocalStorageKeyPreffix(originalKey)) || defaultValue;
	          if (rv === 'false') rv = false;else if (rv === 'true') rv = true;
	          return rv;
	        },
	            finalValue = defaultItem;
	
	        if (localStorage && localStorage.getItem) {
	          if (_.isObject(finalValue)) {
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
	        return {
	          el: el,
	          data: data
	        };
	      }
	    }, {
	      key: 'getAllRelatedItemsOfItem',
	      value: function getAllRelatedItemsOfItem(item, relationshipType) {
	        var diagram = this,
	            relatedItems = [],
	            recursiveFn = function recursiveFn(relatedItemData, depth) {
	          _.each(relatedItemData.relationships[relationshipType], function (relatedItemChild) {
	            if (depth < 100) {
	              if (relatedItems.indexOf(relatedItemChild) < 0 && relatedItemChild.data !== relatedItemData) {
	                // Handle circular loops
	                relatedItems.push(relatedItemChild);
	                recursiveFn(relatedItemChild.data, depth + 1);
	              }
	            }
	          });
	        },
	            returnObj;
	
	        if (relationshipType) {
	          recursiveFn(item, 0);
	          return relatedItems;
	        } else {
	          returnObj = {};
	          _.each(['dependants', 'dependencies'], function (relationshipName) {
	            returnObj[relationshipName] = diagram.getAllRelatedItemsOfItem(item, relationshipName);
	          });
	          return returnObj;
	        }
	      }
	    }, {
	      key: 'markRelatedItems',
	      value: function markRelatedItems(item, opts) {
	        var diagram = this,
	            relatedItemsGroup,
	            pushToRelatedItemsGroup = function pushToRelatedItemsGroup(args) {
	          relatedItemsGroup.push(diagram.getAllRelatedItemsOfItem.apply(diagram, [item].concat(args)));
	        };
	
	        opts = opts || {};
	        if (diagram.markRelatedFn && item.relationships) {
	          relatedItemsGroup = [];
	
	          if (opts.filter) pushToRelatedItemsGroup([opts.filter]);else _.each([['dependants'], ['dependencies']], pushToRelatedItemsGroup);
	
	          _.each(relatedItemsGroup, function (relatedItems) {
	            _.each(relatedItems, diagram.markRelatedFn);
	          });
	
	          diagram.markRelatedFn(item.relationships.self);
	        }
	      }
	    }, {
	      key: 'register',
	      value: function register() {
	        var diagram = this;
	        _diagrams2['default'].diagramTypes = _diagrams2['default'].diagramTypes || [];
	        _diagrams2['default'].diagramTypes.push(diagram.name);
	        _diagrams2['default'][diagram.name] = function () {
	          var args = Array.prototype.slice.call(arguments);
	          _diagrams2['default'].utils.runIfReady(function () {
	            createdDiagramsMaxId++;
	            _diagrams2['default'].diagramsRegistry.push({
	              diagram: diagram,
	              data: args,
	              id: createdDiagramsMaxId
	            });
	            diagram.diagramId = createdDiagramsMaxId;
	            diagram.addConversionButtons();
	            args.unshift(createdDiagramsMaxId);
	            diagram.create.apply(diagram, args);
	            _diagrams2['default'].events.emit('diagram-created', diagram);
	          });
	        };
	
	        _.defaults(_diagrams2['default'][diagram.name], Object.getPrototypeOf(diagram));
	      }
	    }, {
	      key: 'addConversionButtons',
	      value: function addConversionButtons() {
	        var diagram = this,
	            div = Diagram.addDivBeforeSvg(),
	            onClickFn;
	
	        _.each(_diagrams2['default'].diagramTypes, function (diagramType) {
	          if (diagramType !== diagram.name) {
	            onClickFn = 'diagrams.Diagram.convertDiagram(' + diagram.diagramId + ', \'' + diagramType + '\')';
	            div.appendButtonToDiv('diagrams-box-conversion-button', 'To ' + diagramType + ' diagram', onClickFn);
	          }
	        });
	      }
	    }]);
	
	    return Diagram;
	  })();
	
	  _diagrams2['default'].utils.composeWithEventEmitter(Diagram);
	
	  return Diagram;
	};
	
	exports['default'] = getDiagramClass;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Box": 8,
		"./Box.js": 8,
		"./Graph": 9,
		"./Graph.js": 9,
		"./Layer": 10,
		"./Layer.js": 10
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
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	exports['default'] = function () {
	  var helpers = {
	    filterByString: _.debounce(function (opts, creationId) {
	      var getHiddenValueSetter = function getHiddenValueSetter(value) {
	        return function (item) {
	          item.hidden = value;
	        };
	      },
	          isNotHidden = function isNotHidden(item) {
	        return item.hidden !== true;
	      },
	          setHiddenToFalse = getHiddenValueSetter(false);
	
	      helpers.traverseBodyDataAndRefresh(creationId, null, function (item, parents) {
	        var anyParentIsShowed = _.any(parents, isNotHidden);
	        if (opts.showChildren === false || anyParentIsShowed === false) {
	          if (new RegExp(opts.str, 'i').test(item.text) === false) getHiddenValueSetter(true)(item);else {
	            _.each(parents, setHiddenToFalse);
	            setHiddenToFalse(item);
	          }
	        } else setHiddenToFalse(item);
	      });
	    }, 500),
	    generateDefinitionWithSharedGet: function generateDefinitionWithSharedGet() {
	      var text = arguments[0],
	          sharedKey,
	          preffix;
	
	      preffix = arguments.length > 1 ? arguments[1] : '';
	      sharedKey = preffix + text.split('(')[0];
	
	      return Box.generateDefinition(text, _diagrams2['default'].shared.get(sharedKey));
	    },
	
	    addButtons: function addButtons(creationId) {
	      var div = _diagrams2['default'].Diagram.addDivBeforeSvg();
	
	      div.appendButtonToDiv('diagrams-box-collapse-all-button', 'Collapse all', 'diagrams.box.collapseAll(' + creationId + ')');
	      div.appendButtonToDiv('diagrams-box-expand-all-button', 'Expand all', 'diagrams.box.expandAll(' + creationId + ')');
	    },
	
	    expandOrCollapseAll: function expandOrCollapseAll(creationId, collapseOrExpand) {
	      helpers.traverseBodyDataAndRefresh(creationId, {
	        withCollapsedItems: true
	      }, function (item) {
	        if (item.hasOwnProperty('collapsed')) helpers[collapseOrExpand + 'Item'](item);
	      });
	    },
	
	    traverseBodyDataAndRefresh: function traverseBodyDataAndRefresh(creationId, opts, cb) {
	      var conf = _diagrams2['default'].Diagram.getDataWithCreationId(creationId)[1],
	          bodyData = conf.body,
	          recursiveFn = function recursiveFn(items, parents) {
	        _.each(items, function (item) {
	          if (cb) cb(item, parents);
	          if (item.items) recursiveFn(item.items, parents.concat(item));
	          if (opts.withCollapsedItems && item.collapsedItems) recursiveFn(item.collapsedItems, parents.concat(item));
	        });
	      };
	
	      opts = opts || {};
	
	      opts.withCollapsedItems = opts.withCollapsedItems || false;
	      recursiveFn(bodyData, []);
	      helpers.addBodyItemsAndUpdateHeights();
	    },
	
	    collapseAll: function collapseAll(creationId) {
	      helpers.expandOrCollapseAll(creationId, 'collapse');
	    },
	
	    expandAll: function expandAll(creationId) {
	      helpers.expandOrCollapseAll(creationId, 'expand');
	    },
	
	    convertToGraph: function convertToGraph(origConf) {
	      console.log("origConf", origConf);
	    },
	
	    convertToLayer: function convertToLayer(origConf) {
	      var convertDataToLayers = function convertDataToLayers(items) {
	        _.each(items, function (item, index) {
	          if (_.isString(item)) {
	            item = items[index] = {
	              text: item
	            };
	          }
	          if (item.description) item.text += ': ' + item.description;
	          if (item.items) convertDataToLayers(item.items);else item.items = [];
	        });
	      },
	          createLayers = function createLayers() {
	        var svg = d3.select('svg');
	
	        d3.selectAll('input.diagrams-diagram-button').remove();
	
	        svg.remove();
	        _diagrams2['default'].layer(layersData);
	      },
	          layersData = [];
	
	      layersData.push({
	        text: origConf.name,
	        items: origConf.body
	      });
	      convertDataToLayers(layersData[0].items);
	      createLayers();
	    },
	
	    collapseItem: function collapseItem(item) {
	      if (item.items.length > 0) {
	        item.collapsedItems = item.items;
	        item.collapsed = true;
	        item.items = [];
	      }
	    },
	
	    expandItem: function expandItem(item) {
	      if (item.collapsedItems) {
	        item.items = item.collapsedItems;
	        delete item.collapsedItems;
	        item.collapsed = false;
	      }
	    },
	
	    parseItemGenerationOptions: function parseItemGenerationOptions(options) {
	      var parsedOptions;
	
	      if (_.isString(options)) {
	        options = options.split(' ');
	        parsedOptions = {};
	        _.each(options, function (optionsKey) {
	          var newKey = optionsKey.replace(/-([a-z])/g, function (g) {
	            return g[1].toUpperCase();
	          }); // option-one -> optionOne
	          parsedOptions[newKey] = true;
	        });
	      } else parsedOptions = options;
	
	      return parsedOptions;
	    },
	
	    generateItem: function generateItem(text, description, items, options) {
	      var defaultOptions = {
	        isLink: false,
	        notCompleted: false
	      };
	
	      options = options || {};
	      options = helpers.parseItemGenerationOptions(options);
	
	      return {
	        text: text,
	        description: description || null,
	        options: _.defaults(options, defaultOptions),
	        items: items || []
	      };
	    },
	
	    generateContainer: function generateContainer(text, description, items, options) {
	      options = options || null;
	
	      if (_.isArray(description)) {
	        options = items;
	        items = description;
	        description = null;
	      }
	
	      return helpers.generateItem(text, description, items, options);
	    },
	
	    generateLink: function generateLink(text, url) {
	      return helpers.generateItem(text, url, null, {
	        isLink: true
	      });
	    },
	
	    generateDefinition: function generateDefinition(text, description) {
	      return helpers.generateItem(text, description);
	    },
	
	    dataFromSpecificToGeneral: function dataFromSpecificToGeneral(conf) {
	      var maxId = -1,
	          finalItems = [],
	          connections = [],
	          recursiveFn = function recursiveFn(items, parentCreatedItem) {
	        _.each(items, function (item) {
	          var createdItem = {
	            name: item.text,
	            description: item.description,
	            graphsData: {
	              box: {
	                options: item.options
	              }
	            },
	            id: ++maxId
	          };
	          finalItems.push(createdItem);
	          if (parentCreatedItem) {
	            connections.push({
	              from: createdItem.id,
	              to: parentCreatedItem.id
	            });
	          } else {
	            connections.push({
	              from: createdItem.id,
	              to: 0
	            });
	          }
	          if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem);
	        });
	      };
	      finalItems.push({
	        name: conf.name,
	        id: ++maxId
	      });
	      recursiveFn(conf.body);
	
	      return {
	        items: finalItems,
	        connections: connections
	      };
	    },
	    dataFromGeneralToSpecific: function dataFromGeneralToSpecific(generalData) {
	      var finalData = _diagrams2['default'].utils.dataFromGeneralToSpecificForATreeStructureType(generalData);
	
	      finalData.name = finalData.text;
	      finalData.body = finalData.items;
	
	      delete finalData.items;
	      delete finalData.text;
	
	      return finalData;
	    }
	  };
	
	  var textGId = 0;
	  var Box = (function (_d$Diagram) {
	    _inherits(Box, _d$Diagram);
	
	    function Box() {
	      _classCallCheck(this, Box);
	
	      _get(Object.getPrototypeOf(Box.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(Box, [{
	      key: 'create',
	      value: function create(creationId, conf, opts) {
	        var diagram = this,
	            svg = _diagrams2['default'].svg.generateSvg(),
	            width = svg.attr('width') - 40,
	            nameHeight = 50,
	            boxG = svg.append('g').attr({
	          transform: 'translate(20, 20)',
	          'class': 'box-diagram'
	        }),
	            nameG = boxG.append('g'),
	            rowHeight = 30,
	            depthWidth = 35,
	            urlParams = _diagrams2['default'].utils.getUrlParams(),
	            collapseIfNecessary = function collapseIfNecessary(el, item) {
	          if (item.items.length > 0 || item.collapsedItems) {
	            var textEl = el.select('text'),
	                yDim = textEl.attr('y'),
	                xDim = textEl.attr('x'),
	                triggerEl = el.append('g').attr({
	              'class': 'collapsible-trigger'
	            }),
	                collapseListener = function collapseListener() {
	              helpers.collapseItem(item);
	              helpers.addBodyItemsAndUpdateHeights();
	            },
	                expandListener = function expandListener() {
	              helpers.expandItem(item);
	              helpers.addBodyItemsAndUpdateHeights();
	            },
	                triggerTextEl = triggerEl.append('text').attr({
	              y: Number(yDim) + 5,
	              x: Number(xDim) - 20
	            }),
	                setCollapseTextAndListener = function setCollapseTextAndListener() {
	              triggerTextEl.text('-').attr('class', 'minus');
	              triggerEl.on('click', collapseListener);
	            },
	                setExpandTextAndListener = function setExpandTextAndListener() {
	              triggerTextEl.text('+').attr({
	                'class': 'plus',
	                y: yDim
	              });
	              triggerEl.on('click', expandListener);
	            },
	                clipPathId;
	
	            triggerElId += 1;
	            clipPathId = 'clippath-' + triggerElId;
	            triggerEl.append('clipPath').attr('id', clipPathId).append('rect').attr({
	              height: 15,
	              width: 20,
	              y: yDim - 17,
	              x: xDim - 20
	            });
	            triggerTextEl.attr('clip-path', 'url(#' + clipPathId + ')');
	
	            if (_.isUndefined(item.collapsed)) {
	              item.collapsed = false;
	              setCollapseTextAndListener();
	            } else {
	              if (item.collapsed === true) setExpandTextAndListener();else if (item.collapsed === false) setCollapseTextAndListener();
	            }
	          }
	        },
	            addBodyItems = function addBodyItems(items, container, depth) {
	          var newContainer, textEl, textWidth, descriptionWidth, containerText, textElValue;
	
	          items = items || conf.body;
	          container = container || bodyG;
	          depth = depth || 1;
	
	          if (items === conf.body) bodyPosition = 1;
	
	          _.each(items, function (item, itemIndex) {
	            if (item.hidden !== true) {
	              var currentTextGId;
	
	              currentTextGId = 'diagrams-box-text-' + textGId++;
	              if (_.isString(item)) {
	                item = helpers.generateItem(item);
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
	                  x: depthWidth * depth,
	                  y: rowHeight * ++bodyPosition,
	                  id: currentTextGId
	                });
	
	                addBodyItems(item.items, newContainer, depth + 1);
	              } else {
	                if (item.options && item.options.isLink === true) {
	                  newContainer = container.append('svg:a').attr("xlink:href", item.description);
	                  textEl = newContainer.append('text').text(_diagrams2['default'].utils.formatShortDescription(item.text)).attr({
	                    id: currentTextGId,
	                    x: depthWidth * depth,
	                    y: rowHeight * ++bodyPosition,
	                    fill: '#3962B8'
	                  });
	
	                  item.fullText = item.text + ' (' + item.description + ')';
	                } else {
	                  newContainer = container.append('g').attr({
	                    id: currentTextGId
	                  });
	                  textEl = newContainer.append('text').text(_diagrams2['default'].utils.formatShortDescription(item.text)).attr({
	                    x: depthWidth * depth,
	                    y: rowHeight * ++bodyPosition,
	                    'class': 'diagrams-box-definition-text'
	                  });
	                  if (item.description) {
	                    textWidth = textEl[0][0].getBoundingClientRect().width;
	                    descriptionWidth = svg[0][0].getBoundingClientRect().width - textWidth - depthWidth * depth - 30;
	
	                    newContainer.append('text').text('- ' + _diagrams2['default'].utils.formatShortDescription(item.description)).attr({
	                      x: depthWidth * depth + textWidth + 5,
	                      y: rowHeight * bodyPosition - 1
	                    }).each(_diagrams2['default'].svg.textEllipsis(descriptionWidth));
	                  }
	
	                  item.fullText = _diagrams2['default'].utils.generateATextDescriptionStr(item.text, item.description);
	                }
	              }
	
	              collapseIfNecessary(newContainer, item);
	              item.textG = newContainer;
	              item.textEl = textEl;
	
	              if (item.options.notCompleted === true) {
	                item.textG.attr('class', (item.textG.attr('class') || '') + ' diagrams-box-not-completed-block');
	                textElValue = item.textEl.text();
	                item.textEl.text('');
	                item.textEl.append('tspan').text(textElValue + ' ');
	                item.textEl.append('tspan').text('[NOT COMPLETED]').attr('class', 'diagrams-box-not-completed-tag');
	              }
	
	              diagram.addMouseListenersToEl(textEl, item);
	            }
	          });
	        },
	            scrollToTarget = function scrollToTarget(target) {
	          var targetFound = null,
	              recursiveFindTarget = function recursiveFindTarget(items) {
	            _.each(items, function (item) {
	              if (_.isNull(targetFound)) {
	                if (_.isString(item.text) && item.text.indexOf(target) > -1) targetFound = item;else if (item.items) recursiveFindTarget(item.items);
	              }
	            });
	          },
	              currentScroll,
	              scrollElTop;
	
	          recursiveFindTarget(conf.body);
	          if (targetFound) {
	            currentScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
	            scrollElTop = targetFound.textG[0][0].getBoundingClientRect().top;
	            _.defer(function () {
	              window.scrollTo(0, scrollElTop + currentScroll);
	            });
	          }
	          console.log("targetFound", targetFound);
	        },
	            triggerElId,
	            bodyG,
	            bodyPosition,
	            bodyRect;
	
	        opts = opts || {};
	
	        helpers.addBodyItemsAndUpdateHeights = _.bind(function () {
	          var diagram = this,
	              currentScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
	          svg.attr('height', 10);
	          if (bodyG) bodyG.remove();
	          bodyG = boxG.append('g').attr({
	            transform: 'translate(0, ' + nameHeight + ')'
	          });
	          bodyRect = bodyG.append('rect').attr({
	            width: width,
	            stroke: '#000',
	            fill: '#fff'
	          }).style({
	            filter: 'url(#diagrams-drop-shadow-box)'
	          });
	          triggerElId = 0;
	          addBodyItems();
	          diagram.setRelationships(conf.body);
	          _diagrams2['default'].svg.updateHeigthOfElWithOtherEl(svg, boxG, 50);
	          _diagrams2['default'].svg.updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - nameHeight);
	
	          window.scrollTo(0, currentScroll);
	          diagram.emit('items-rendered');
	        }, this);
	
	        _diagrams2['default'].svg.addFilterColor('box', svg, 3, 4);
	
	        nameG.append('rect').attr({
	          height: nameHeight,
	          width: width,
	          stroke: '#000',
	          fill: '#fff'
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
	        helpers.addBodyItemsAndUpdateHeights();
	        if (opts.allCollapsed === true) helpers.collapseAll(creationId);
	        helpers.addButtons(creationId);
	        d3.select(document.body).style('opacity', 1);
	
	        if (urlParams.target) scrollToTarget(urlParams.target);
	      }
	    }, {
	      key: 'setRelationships',
	      value: function setRelationships(items, container) {
	        var diagram = this;
	        _.each(items, function (item) {
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
	
	  new Box({
	    name: 'box',
	    helpers: helpers
	  });
	};
	
	module.exports = exports['default'];

/***/ },
/* 9 */
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
	
	exports['default'] = function () {
	  var _configuration;
	
	  var linksNumberMap = {},
	      SHY_CONNECTIONS = 'Show connections selectively',
	      GRAPH_ZOOM = 'dia graph zoom',
	      GRAPH_DRAG = 'Drag nodes on click (may make links difficult)',
	      CURVED_ARROWS = 'All arrows are curved',
	      graphZoomConfig = {
	    'private': true,
	    'type': Number,
	    value: 1
	  },
	      dPositionFn = _diagrams2['default'].utils.positionFn,
	      dTextFn = _diagrams2['default'].utils.textFn,
	      helpers = {
	    generateConnectionWithText: function generateConnectionWithText(nodesIds, text) {
	      if (_.isArray(nodesIds) && _.isArray(nodesIds[0])) {
	        return _.map(nodesIds, function (args) {
	          return helpers.generateConnectionWithText.apply({}, args);
	        });
	      }
	      if (_.isString(nodesIds)) nodesIds = nodesIds.split(' ').map(Number);else if (_.isNumber(nodesIds)) nodesIds = [nodesIds];
	      return _diagrams2['default'].graph.mergeWithDefaultConnection({
	        nodesIds: nodesIds,
	        text: text
	      });
	    },
	    connectionFnFactory: function connectionFnFactory(baseFn, changedProp, changedVal) {
	      return function () {
	        var connection = baseFn.apply({}, arguments),
	            setVal = function setVal(singleConnection) {
	          singleConnection[changedProp] = changedVal;
	          return connection;
	        };
	
	        return _.isArray(connection) ? _.map(connection, setVal) : setVal(connection);
	      };
	    },
	    generateNodeOptions: function generateNodeOptions(options) {
	      var obj = {},
	          shape;
	      if (_.isString(options)) return helpers.generateNodeOptions(options.split(' '));else if (_.isArray(options)) {
	        _.each(options, function (opt) {
	          if (opt.substr(0, 2) === 's-') {
	            shape = opt.substr(2, opt.length - 2);
	            obj.shape = shape === 't' ? 'triangle' : shape === 's' ? 'square' : 'circle';
	          } else if (opt === 'b') obj.bold = true;else if (opt.substr(0, 2) === 'l~') obj.linkToUrl = opt.substr(2, opt.length - 2);
	        });
	        return obj;
	      }
	    },
	    mergeWithDefaultConnection: function mergeWithDefaultConnection(connection) {
	      var defaultConnection = {
	        direction: 'out',
	        symbol: 'arrow',
	        line: 'plain'
	      };
	
	      return _.defaults(connection, defaultConnection);
	    },
	    generateNodeWithTargetLink: function generateNodeWithTargetLink(file, target) {
	      return function () {
	        var args = Array.prototype.slice.call(arguments);
	        if (_.isUndefined(args[3])) args[3] = '';else args[3] += ' ';
	        args[3] += 'l~' + file + '?target=' + encodeURIComponent(target);
	        return helpers.generateNode.apply({}, args);
	      };
	    },
	    generateNodeWithTextAsTargetLink: function generateNodeWithTextAsTargetLink(file) {
	      return function () {
	        return _diagrams2['default'].graph.generateNodeWithTargetLink(file, arguments[0]).apply({}, arguments);
	      };
	    },
	    generatePrivateNode: function generatePrivateNode() {
	      var args = Array.prototype.slice.call(arguments);
	      args[2] = args[2] + '<br><strong>PRIVATE</strong>';
	      args[3] = 's-t';
	      return helpers.generateNode.apply({}, args);
	    },
	    generateNode: function generateNode() {
	      var node = {
	        name: arguments[0]
	      },
	          addDefaultConnectionFromNumber = function addDefaultConnectionFromNumber(nodeId) {
	        node.connections.push(helpers.mergeWithDefaultConnection({
	          nodesIds: [nodeId]
	        }));
	      },
	          addConnection = function addConnection(connection) {
	        if (_.isArray(connection)) _.each(connection, addConnection);else if (_.isNumber(connection)) addConnection({
	          nodesIds: [connection]
	        });else if (_.isObject(connection)) {
	          helpers.mergeWithDefaultConnection(connection);
	          node.connections.push(connection);
	        }
	      },
	          connections;
	
	      if (arguments.length > 1) {
	        connections = arguments[1];
	        node.connections = [];
	        if (_.isString(connections)) {
	          connections = connections.split(' ').map(Number);
	          if (connections.length > 0) node.id = connections[0];
	          if (connections.length > 1) {
	            _.each(connections, function (nodeId, index) {
	              if (index > 0) addConnection(nodeId);
	            });
	          }
	        } else if (_.isArray(connections)) {
	          node.id = connections[0];
	          connections = connections.slice(1);
	          _.each(connections, function (connection) {
	            if (_.isNumber(connection)) addDefaultConnectionFromNumber(connection);else addConnection(connection);
	          });
	        } else if (_.isNumber(connections)) node.id = connections;
	
	        if (arguments.length > 2) node.description = arguments[2];
	        if (arguments.length > 3) node.options = helpers.generateNodeOptions(arguments[3]);
	      }
	
	      return node;
	    },
	    generateNodeWithSharedGet: function generateNodeWithSharedGet() {
	      var text = arguments[0],
	          sharedKey,
	          preffix,
	          options;
	
	      preffix = arguments.length > 2 ? arguments[2] : '';
	      sharedKey = preffix + text.split('(')[0];
	      options = arguments.length > 3 ? arguments[3] : null;
	
	      return helpers.generateNode(text, arguments[1], _diagrams2['default'].shared.get(sharedKey), options);
	    },
	    generateFnNodeWithSharedGetAndBoldIfFile: function generateFnNodeWithSharedGetAndBoldIfFile(file) {
	      return function () {
	        var opts = '',
	            preffix = '';
	        if (arguments[0].split('@')[0] === file) opts = 'b';
	        if (arguments.length > 2) preffix = arguments[2];
	        if (arguments.length > 3) opts = arguments[3] + ' ' + opts;
	        return helpers.generateNodeWithSharedGet(arguments[0], arguments[1], preffix, opts);
	      };
	    },
	    dataFromGeneralToSpecific: function dataFromGeneralToSpecific(generalData) {
	      var finalItems = [],
	          idToIndexMap = {},
	          targetItem;
	
	      _.each(generalData.items, function (item, index) {
	        finalItems.push({
	          name: item.name,
	          id: item.id,
	          description: item.description
	        });
	        idToIndexMap[item.id] = index;
	      });
	
	      _.each(generalData.connections, function (connection) {
	        targetItem = finalItems[idToIndexMap[connection.to]];
	        targetItem.connections = targetItem.connections || [];
	        targetItem.connections.push({
	          direction: 'in',
	          nodesIds: [connection.from]
	        });
	      });
	
	      return finalItems;
	    },
	    dataFromSpecificToGeneral: function dataFromSpecificToGeneral(data) {
	      var finalItems = [],
	          connections = [],
	          newConnection;
	
	      _.each(data, function (node) {
	        finalItems.push({
	          id: node.id,
	          name: node.name,
	          description: node.description
	        });
	        _.each(node.connections, function (connection) {
	          _.each(connection.nodesIds, function (otherNodeId) {
	            newConnection = {};
	            if (connection.direction === 'out') {
	              newConnection.from = node.id;
	              newConnection.to = otherNodeId;
	            } else if (connection.direction === 'in') {
	              newConnection.from = otherNodeId;
	              newConnection.to = node.id;
	            }
	
	            connections.push(newConnection);
	          });
	        });
	      });
	
	      return {
	        items: finalItems,
	        connections: connections
	      };
	    },
	    doWithMinIdAndMaxIdOfLinkNodes: function doWithMinIdAndMaxIdOfLinkNodes(link, cb) {
	      var getIndex = function getIndex(item) {
	        return _.isNumber(item) ? item : item.index;
	      },
	          ids = [getIndex(link.source), getIndex(link.target)],
	          minIndex = _.min(ids),
	          maxIndex = _.max(ids);
	
	      return cb(minIndex, maxIndex);
	    },
	    updateLinksNumberMapWithLink: function updateLinksNumberMapWithLink(link) {
	      helpers.doWithMinIdAndMaxIdOfLinkNodes(link, function (minIndex, maxIndex) {
	        if (_.isUndefined(linksNumberMap[minIndex])) linksNumberMap[minIndex] = {};
	
	        if (_.isUndefined(linksNumberMap[minIndex][maxIndex])) linksNumberMap[minIndex][maxIndex] = 1;else linksNumberMap[minIndex][maxIndex] += 1;
	      });
	    },
	    getLinksNumberMapItemWithLink: function getLinksNumberMapItemWithLink(link) {
	      return helpers.doWithMinIdAndMaxIdOfLinkNodes(link, function (minIndex, maxIndex) {
	        return linksNumberMap[minIndex][maxIndex];
	      });
	    },
	    addDiagramInfo: function addDiagramInfo(diagram, svg, info) {
	      if (_.isString(info)) info = [info];
	      var hasDescription = info.length === 2;
	      var svgWidth = svg[0][0].getBoundingClientRect().width;
	      var infoText = info[0] + (hasDescription ? ' (...)' : '');
	      var el = svg.append('g').attr({
	        transform: 'translate(10, 50)',
	        'class': 'graph-info'
	      }).append('text').text(infoText).each(_diagrams2['default'].svg.textEllipsis(svgWidth));
	
	      if (hasDescription) {
	        diagram.addMouseListenersToEl(el, {
	          el: el,
	          fullText: _diagrams2['default'].utils.generateATextDescriptionStr(info[0], info[1])
	        });
	      }
	    },
	    setReRender: function setReRender(diagram, creationId, data, conf) {
	      diagram.reRender = _.partial(diagram.removePreviousAndCreate, creationId, data, conf);
	    }
	  },
	      Graph;
	
	  Graph = (function (_d$Diagram) {
	    _inherits(Graph, _d$Diagram);
	
	    function Graph() {
	      _classCallCheck(this, Graph);
	
	      _get(Object.getPrototypeOf(Graph.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(Graph, [{
	      key: 'create',
	      value: function create(creationId, data, conf) {
	        var diagram = this,
	            bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
	            svg = _diagrams2['default'].svg.generateSvg(),
	            container = svg.append('g'),
	            width = svg.attr('width'),
	            dragNodesConfig = diagram.config(GRAPH_DRAG),
	            curvedArrows = diagram.config(CURVED_ARROWS);
	
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
	
	        var height = _diagrams2['default'].svg.selectScreenHeightOrHeight(bodyHeight - 250);
	
	        var tick = function tick() {
	          var setPathToLink = function setPathToLink(pathClass) {
	            link.select('path.' + pathClass).attr("d", function (d) {
	              var linksNumber = helpers.getLinksNumberMapItemWithLink(d),
	                  linkIndex = d.data.linkIndex,
	                  dx = d.target.x - d.source.x,
	                  dy = d.target.y - d.source.y,
	                  dr = Math.sqrt(dx * dx + dy * dy) * (curvedArrows ? 3.5 : 1) * (linkIndex + (curvedArrows ? 1 : 0) / (linksNumber * 3));
	
	              return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
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
	          var maxId = _.reduce(data, function (memo, node) {
	            var id = node.id || 0;
	            return memo > id ? memo : id;
	          }, 0),
	              idsMap = {},
	              nodesWithLinkMap = {},
	              colors = d3.scale.category20(),
	              nodeId,
	              color,
	              options,
	              otherNode,
	              linkObj;
	          parsedData = {
	            links: [],
	            nodes: []
	          };
	          markers = [];
	          _.each(data, function (node, nodeIndex) {
	            nodeId = _.isUndefined(node.id) ? maxId++ : node.id;
	            color = colors(nodeIndex);
	            options = node.options || {};
	
	            parsedData.nodes.push({
	              name: node.name,
	              id: nodeId,
	              connections: node.connections || [],
	              description: node.description || null,
	              color: color,
	              shape: options.shape || 'circle',
	              linkToUrl: options.linkToUrl || null,
	              bold: options.bold || false
	            });
	            idsMap[nodeId] = {
	              index: nodeIndex
	            };
	            idsMap[nodeId].color = color;
	            markers.push({
	              id: nodeId,
	              color: color
	            });
	          });
	
	          diagram.config(conf);
	          if (conf.info) helpers.addDiagramInfo(diagram, svg, conf.info);
	
	          _.each(parsedData.nodes, function (node, nodeIndex) {
	            if (node.connections.length > 0) {
	              _.each(node.connections, function (connection) {
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
	                    helpers.updateLinksNumberMapWithLink(linkObj);
	                    linkObj.data.linkIndex = helpers.getLinksNumberMapItemWithLink(linkObj) - 1;
	                    if (linkObj.data.text) linkObj.data.fullText = linkObj.data.text;
	                    parsedData.links.push(linkObj);
	                  }
	                });
	              });
	            }
	          });
	
	          if (conf.hideNodesWithoutLinks === true) {
	            _.each(parsedData.nodes, function (node, nodeIndex) {
	              if (nodesWithLinkMap[nodeIndex] !== true) node.hidden = true;
	            });
	          }
	        };
	
	        var zoomed = function zoomed(translate, scale) {
	          scale = scale || 1;
	          container.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
	          graphZoomConfig.value = scale;
	          diagram.config(GRAPH_ZOOM, graphZoomConfig);
	        };
	
	        var dragstarted = function dragstarted() {
	          d3.event.sourceEvent.stopPropagation();
	          d3.select(this).classed("dragging", true);
	          force.start();
	        };
	
	        var dragged = function dragged(d) {
	          d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
	        };
	
	        var dragended = function dragended() {
	          d3.select(this).classed("dragging", false);
	        };
	
	        var setRelationships = function setRelationships() {
	          _.each(parsedData.nodes, diagram.generateEmptyRelationships, diagram);
	          _.each(parsedData.nodes, function (node) {
	            diagram.addSelfRelationship(node, node.shapeEl, node);
	          });
	          _.each(parsedData.links, function (link) {
	            diagram.addDependencyRelationship(link.source, link.target.shapeEl, link.target);
	            diagram.addDependantRelationship(link.target, link.source.shapeEl, link.source);
	          });
	        };
	
	        var getAllLinks = function getAllLinks() {
	          return container.selectAll(".link");
	        };
	
	        var getLinksWithIsHiding = function getLinksWithIsHiding() {
	          return getAllLinks().filter(function (d) {
	            return d.data.hasOwnProperty('shyIsHiding');
	          });
	        };
	
	        var setLinkIsHidingIfNecessary = function setLinkIsHidingIfNecessary(isHiding, link) {
	          var linksWithIsHiding;
	          if (diagram.config(SHY_CONNECTIONS)) {
	            if (isHiding === false) link.data.shyIsHiding = isHiding;else if (isHiding === true) {
	              linksWithIsHiding = getLinksWithIsHiding();
	              linksWithIsHiding.each(function (d) {
	                d.data.shyIsHiding = true;
	              });
	            }
	            link.data.shyIsHidingChanged = true;
	          }
	        };
	
	        var setDisplayOfShyConnections = function setDisplayOfShyConnections(display, node) {
	          var isShowing = display === 'show',
	              isHiding = display === 'hide',
	              nodeData = node.data,
	              linksWithIsHiding = getLinksWithIsHiding(),
	              nodeLinks = getAllLinks().filter(function (d) {
	            return d.source.id === nodeData.id || d.target.id === nodeData.id;
	          }),
	              setDisplay = function setDisplay(links, show) {
	            links.classed('shy-link-hidden', !show);
	            links.classed('shy-link-showed', show);
	          },
	              hideLinks = function hideLinks(links) {
	            setDisplay(links, false);
	            links.each(function (d) {
	              delete d.data.shyIsHiding;
	            });
	          },
	              futureConditionalHide = function futureConditionalHide() {
	            setTimeout(function () {
	              allAreHiding = true;
	              shyIsHidingIsSame = true;
	              nodeLinks.each(function (d) {
	                allAreHiding = allAreHiding && d.data.shyIsHiding;
	                if (d.data.shyIsHidingChanged) {
	                  shyIsHidingIsSame = false;
	                  delete d.data.shyIsHidingChanged;
	                }
	              });
	              if (allAreHiding && shyIsHidingIsSame) hideLinks(nodeLinks);else futureConditionalHide();
	            }, 500);
	          },
	              allAreHiding,
	              shyIsHidingIsSame;
	
	          if (linksWithIsHiding[0].length === 0) {
	            if (isShowing) setDisplay(nodeLinks, true);else if (isHiding) {
	              nodeLinks.each(function (d) {
	                d.data.shyIsHiding = true;
	              });
	              futureConditionalHide();
	            }
	          } else {
	            if (isShowing) {
	              linksWithIsHiding.each(function (d, index) {
	                if (index === 0) d.data.shyIsHiding = false;
	              });
	            } else if (isHiding) setLinkIsHidingIfNecessary(true, linksWithIsHiding.data()[0]);
	          }
	        };
	
	        var setReRender = _.partial(helpers.setReRender, diagram, creationId, data, _);
	
	        diagram.markRelatedFn = function (item) {
	          item.el.style('stroke-width', '20px');
	        };
	        diagram.unmarkAllItems = function () {
	          _.each(parsedData.nodes, function (node) {
	            node.shapeEl.style('stroke-width', '1px');
	          });
	        };
	
	        conf = conf || {};
	        parseData();
	
	        svg.attr({
	          height: height,
	          'class': 'graph-diagram'
	        });
	
	        zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", function () {
	          zoomed(d3.event.translate, d3.event.scale);
	        });
	
	        svg.call(zoom);
	
	        zoom.translate([100, 100]).scale(diagram.config(GRAPH_ZOOM).value);
	
	        zoomed(zoom.translate(), zoom.scale());
	
	        force = d3.layout.force().size([width, height]).charge(conf.charge || -10000).linkDistance(conf.linkDistance || 140).on("tick", tick);
	
	        drag = d3.behavior.drag().origin(function (d) {
	          return d;
	        }).on("dragstart", dragstarted).on("drag", dragged).on("dragend", dragended);
	
	        force.nodes(parsedData.nodes).links(parsedData.links).start();
	
	        container.append("svg:defs").selectAll("marker").data(markers).enter().append("svg:marker").attr({
	          id: dTextFn('id', 'arrow-head-'),
	          'class': 'arrow-head',
	          fill: dTextFn('color'),
	          viewBox: '0 -5 10 10',
	          refX: 19,
	          refY: curvedArrows ? -1.5 : 0,
	          markerWidth: 8,
	          markerHeight: 8,
	          orient: 'auto'
	        }).append("svg:path").attr("d", "M0,-5L10,0L0,5");
	
	        link = container.selectAll(".link").data(parsedData.links).enter().append('g').attr("class", function () {
	          var finalClass = 'link';
	          if (diagram.config(SHY_CONNECTIONS)) finalClass += ' shy-link shy-link-hidden';
	          return finalClass;
	        });
	        link.append("svg:path").attr({
	          'class': 'link-path',
	          "marker-end": function markerEnd(d) {
	            return 'url(#arrow-head-' + d.source.id + ')';
	          }
	        }).style({
	          'stroke': dTextFn('color'),
	          'stroke-dasharray': function strokeDasharray(d) {
	            if (d.data.line === 'plain') return null;else if (d.data.line === 'dotted') return '5,5';
	          }
	        });
	
	        linkOuter = link.append('g');
	        linkOuter.append('svg:path').attr('class', 'link-path-outer');
	        linkOuter.each(function (d) {
	          diagram.addMouseListenersToEl(d3.select(this), d.data, {
	            mouseenter: function mouseenter(link) {
	              setLinkIsHidingIfNecessary(false, link);
	            },
	            mouseleave: function mouseleave(link) {
	              setLinkIsHidingIfNecessary(true, link);
	            }
	          });
	        });
	
	        node = container.selectAll(".node").data(parsedData.nodes).enter().append('g').attr({
	          'class': function _class(d) {
	            var finalClass = 'node';
	            if (d.hidden === true) finalClass += ' node-hidden';
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
	              r: 12,
	              fill: dTextFn('color')
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
	            mouseenter: function mouseenter(data) {
	              if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('show', data);
	            },
	            mouseleave: function mouseleave(data) {
	              if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('hide', data);
	            },
	            click: function click(node) {
	              if (node.data.linkToUrl) window.open(node.data.linkToUrl);
	            }
	          });
	        });
	
	        node.append("text").text(dTextFn('name'));
	
	        setRelationships();
	        setReRender(conf);
	        diagram.listen('configuration-changed', function (conf) {
	          if (conf.key === SHY_CONNECTIONS || conf.key === GRAPH_DRAG) {
	            setReRender(conf);
	            diagram.removePreviousAndCreate(creationId, data, conf);
	          }
	        });
	      }
	    }]);
	
	    return Graph;
	  })(_diagrams2['default'].Diagram);
	
	  new Graph({
	    name: 'graph',
	    helpers: helpers,
	    configurationKeys: {
	      SHY_CONNECTIONS: SHY_CONNECTIONS
	    },
	    configuration: (_configuration = {}, _defineProperty(_configuration, SHY_CONNECTIONS, true), _defineProperty(_configuration, GRAPH_ZOOM, graphZoomConfig), _defineProperty(_configuration, GRAPH_DRAG, false), _defineProperty(_configuration, 'info', null), _defineProperty(_configuration, CURVED_ARROWS, false), _configuration)
	  });
	};
	
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _diagrams = __webpack_require__(1);
	
	var _diagrams2 = _interopRequireDefault(_diagrams);
	
	exports['default'] = function () {
	  var layerGId = 0,
	      dTextFn = _diagrams2['default'].utils.textFn,
	      helpers = {
	    ids: 0,
	    Grid: (function () {
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
	        key: 'addItemAtNewRow',
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
	        key: 'addItemAtCurrentPos',
	        value: function addItemAtCurrentPos(item) {
	          this.addItemAtPos(item, this.position);
	        }
	      }, {
	        key: 'createRowIfNecessary',
	        value: function createRowIfNecessary(posY) {
	          if (_.isUndefined(this.cells[posY])) this.cells[posY] = [];
	        }
	      }, {
	        key: 'addItemAtPos',
	        value: function addItemAtPos(item, pos) {
	          var row;
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
	        key: 'updatePosition',
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
	        key: 'itemFitsAtPos',
	        value: function itemFitsAtPos(item, pos) {
	          var row;
	          for (var i = 0; i < item.height; i++) {
	            row = this.cells[i + pos.y];
	            if (_.isUndefined(row)) return true;
	            for (var j = 0; j < item.width; j++) {
	              if (row[j + pos.x] === true) return false;
	              if (j + pos.x + 1 > this.width) return false;
	            }
	          }
	          return true;
	        }
	      }, {
	        key: 'itemFitsAtCurrentPos',
	        value: function itemFitsAtCurrentPos(item) {
	          return this.itemFitsAtPos(item, this.position);
	        }
	      }, {
	        key: 'movePositionToNextRow',
	        value: function movePositionToNextRow() {
	          this.position.y++;
	          this.position.x = 0;
	          this.createRowIfNecessary(this.position.y);
	        }
	      }, {
	        key: 'lastRowIsEmpty',
	        value: function lastRowIsEmpty() {
	          var rows = this.cells.length;
	          for (var i = 0; i < this.width; i++) {
	            if (this.cells[rows - 1][i] === true) return false;
	          }
	          return true;
	        }
	      }, {
	        key: 'getSize',
	        value: function getSize() {
	          var rows = this.cells.length;
	          return {
	            width: this.width,
	            height: this.lastRowIsEmpty() ? rows - 1 : rows
	          };
	        }
	      }]);
	
	      return Grid;
	    })(),
	
	    config: {
	      widthSize: 350,
	      heightSize: 60,
	      depthWidthFactor: 4,
	      depthHeightFactor: 2,
	      showNumbersAll: false
	    },
	
	    handleConnectedToNextCaseIfNecessary: function handleConnectedToNextCaseIfNecessary(layers, currentIndex) {
	      var layer = layers[currentIndex],
	          nextLayer = layers[currentIndex + 1],
	          connectedTo,
	          newId;
	
	      if (layer.hasOwnProperty('connectedWithNext') === true && nextLayer) {
	        if (nextLayer.id) newId = nextLayer.id;else {
	          newId = 'to-next-' + String(++helpers.ids);
	          nextLayer.id = newId;
	        }
	
	        if (_.isObject(layer.connectedWithNext) && layer.connectedWithNext.type) {
	          connectedTo = {
	            id: newId,
	            type: layer.connectedWithNext.type
	          };
	        } else connectedTo = newId;
	
	        if (layer.connectedTo) layer.connectedTo.push(connectedTo);else layer.connectedTo = [connectedTo];
	      }
	    },
	
	    itemsOfLayerShouldBeSorted: function itemsOfLayerShouldBeSorted(itemsArray) {
	      var ret = true;
	      _.each(itemsArray, function (item) {
	        if (item.hasOwnProperty('connectedTo')) ret = false;
	        if (item.hasOwnProperty('connectToNext')) ret = false;
	      });
	      return ret;
	    },
	
	    calculateLayerWithChildrenDimensions: function calculateLayerWithChildrenDimensions(layer) {
	      var totalWidth = 0,
	          totalHeight = 0,
	          maxWidth = 0,
	          maxHeight = 0,
	          itemsArray = [],
	          whileCounter = 0,
	          itemsOfLayer,
	          grid,
	          itemsOfLayerIndex,
	          width,
	          gridSize,
	          itemsShouldBeSorted,
	          addedItemToGrid = function addedItemToGrid(index) {
	        if (itemsOfLayer[index].inNewRow === true) {
	          grid.addItemAtNewRow(itemsOfLayer[index]);
	          itemsOfLayer.splice(index, 1);
	          return true;
	        } else if (grid.itemFitsAtCurrentPos(itemsOfLayer[index])) {
	          grid.addItemAtCurrentPos(itemsOfLayer[index]);
	          itemsOfLayer.splice(index, 1);
	          return true;
	        } else return false;
	      };
	
	      _.each(layer.items, function (item) {
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
	
	      width = helpers.maxUnityWidth < width ? helpers.maxUnityWidth : width;
	
	      grid = new helpers.Grid(width);
	
	      itemsShouldBeSorted = helpers.itemsOfLayerShouldBeSorted(itemsArray);
	      if (itemsShouldBeSorted) {
	        itemsOfLayer = itemsArray.sort(function (itemA, itemB) {
	          if (itemA.width === itemB.width) {
	            return itemA.height < itemB.height;
	          } else return itemA.width < itemB.width;
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
	    },
	
	    generateLayersData: function generateLayersData(layers, currentDepth) {
	      var config = helpers.config,
	          maxDepth,
	          itemsDepth;
	
	      currentDepth = currentDepth || 1;
	      maxDepth = currentDepth;
	      _.each(layers, function (layer, layerIndex) {
	        if (layer.showNumbersAll === true) config.showNumbersAll = true;
	        layer.depth = currentDepth;
	        helpers.handleConnectedToNextCaseIfNecessary(layers, layerIndex);
	        if (layer.items.length > 0) {
	          itemsDepth = helpers.generateLayersData(layer.items, currentDepth + 1);
	          layer.maxLayerDepthBelow = itemsDepth - currentDepth;
	          helpers.calculateLayerWithChildrenDimensions(layer);
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
	    },
	
	    getFinalLayerDimensions: function getFinalLayerDimensions(layer) {
	      var config = helpers.config,
	          height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2,
	          width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2,
	          transform = 'translate(' + config.depthWidthFactor * layer.depth + ',' + config.depthHeightFactor * layer.depth + ')',
	          fill = 'url(#color-' + String(layer.depth - 1) + ')',
	          dimensions = {
	        height: height,
	        width: width,
	        transform: transform,
	        fill: fill
	      };
	      if (config.showNumbersAll === true || layer.containerData && layer.containerData.showNumbers === true) {
	        dimensions.numberTransform = 'translate(' + String(width - 15 + config.depthWidthFactor * layer.depth) + ',' + String(config.depthHeightFactor * layer.depth + height + 0) + ')';
	      }
	
	      return dimensions;
	    },
	
	    dataFromSpecificToGeneral: function dataFromSpecificToGeneral(conf) {
	      var maxId = -1,
	          finalItems = [],
	          connections = [],
	          recursiveFn = function recursiveFn(items, parentCreatedItem) {
	        _.each(items, function (item) {
	          var firstOccurrence = /(\. |:)/.exec(item.fullText),
	              name,
	              description,
	              splittedText,
	              createdItem;
	          if (firstOccurrence) {
	            splittedText = item.fullText.split(firstOccurrence[0]);
	            name = splittedText[0];
	            description = splittedText.slice(1).join(firstOccurrence);
	          }
	          createdItem = {
	            name: name || item.fullText,
	            description: description || null,
	            graphsData: {
	              layer: {
	                relationships: item.options,
	                id: item.id
	              }
	            },
	            id: ++maxId
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
	        items: finalItems,
	        connections: connections
	      };
	    },
	
	    dataFromGeneralToSpecific: function dataFromGeneralToSpecific(generalData) {
	      return _diagrams2['default'].utils.dataFromGeneralToSpecificForATreeStructureType(generalData);
	    },
	
	    newLayer: function newLayer(text, opts, items) {
	      var layer = {
	        text: text
	      };
	
	      if (_.isArray(opts)) items = opts;else {
	        if (_.isString(opts)) opts = helpers.extendOpts(opts);
	        if (_.isObject(opts)) layer = _.extend(layer, opts);
	      }
	
	      if (items) layer.items = items;
	      if (_.isUndefined(layer.id)) layer.id = 'layer-' + ++helpers.ids + '-auto'; // Have to limit the id by the two sides to enable .indexOf to work
	
	      return layer;
	    },
	
	    newLayerConnectedToNext: function newLayerConnectedToNext() {
	      var args = arguments.length;
	
	      if (args === 1) return helpers.newLayer(arguments[0], 'cn');else if (args === 2) {
	        if (typeof arguments[1] === 'object') return helpers.newLayer(arguments[0], 'cn', arguments[1]);else if (typeof (arguments[1] === 'string')) return helpers.newLayer(arguments[0], arguments[1] + ' cn');
	      } else if (args === 3) return helpers.newLayer(arguments[0], arguments[1] + ' cn', arguments[2]);
	    },
	
	    staticOptsLetters: {
	      co: {
	        conditional: true
	      },
	      cn: {
	        connectedWithNext: true
	      },
	      sna: {
	        showNumbersAll: true
	      },
	      sn: {
	        showNumbers: true
	      },
	      cnd: {
	        connectedWithNext: {
	          type: 'dashed'
	        }
	      },
	      nr: {
	        inNewRow: true
	      }
	    },
	
	    idOpt: function idOpt(id) {
	      return {
	        id: 'layer-' + id + '-custom'
	      };
	    },
	
	    extendOpts: function extendOpts() {
	      var result = {};
	
	      _.each(arguments, function (arg) {
	        if (typeof arg === 'string') {
	          _.each(arg.split(' '), function (opt) {
	            if (opt.substr(0, 3) === 'id-') result = _.extend(result, helpers.idOpt(opt.substr(3, opt.length)));else if (opt.substr(0, 3) === 'ct-') helpers.connectWithOpt(Number(opt.substr(3, opt.length)), result);else if (opt.substr(0, 4) === 'ctd-') helpers.connectWithOpt(Number(opt.substr(4, opt.length)), result, 'dashed');else result = _.extend(result, helpers.staticOptsLetters[opt]);
	          });
	        } else if (_.isObject(arg)) {
	          result = _.extend(result, arg);
	        }
	      });
	
	      return result;
	    },
	
	    connectWithOpt: function connectWithOpt(ids, result, type) {
	      var objs = [];
	      if (_.isNumber(ids)) ids = [ids];
	      type = type || 'standard';
	
	      _.each(ids, function (id) {
	        objs.push({
	          id: 'layer-' + id + '-custom',
	          type: type
	        });
	      });
	
	      if (_.isUndefined(result.connectedTo) === true) result.connectedTo = objs;else result.connectedTo = result.connectedTo.concat(objs);
	    },
	
	    connectWithOptAndIdOpt: function connectWithOptAndIdOpt(ids, id) {
	      var connectWithOpt = _diagrams2['default'].layer.connectWithOpt(ids),
	          idOpt = _diagrams2['default'].layer.idOpt(id);
	
	      return _.extend(connectWithOpt, idOpt);
	    }
	  },
	      Layer;
	
	  _.each(['newLayer', 'newLayerConnectedToNext'], function (helpersMethod) {
	    helpers[helpersMethod + 'WithCode'] = function (codeLanguage) {
	      var codeFn = _diagrams2['default'].utils.codeBlockOfLanguageFn(codeLanguage);
	      return function () {
	        var args = arguments;
	        args[0] = codeFn(args[0]);
	        return helpers[helpersMethod].apply(this, args);
	      };
	    };
	
	    helpers[helpersMethod + 'WithParagraphAndCode'] = function (codeLanguage) {
	      var codeFn = _diagrams2['default'].utils.codeBlockOfLanguageFn(codeLanguage);
	      return function () {
	        var args = [].splice.call(arguments, 0),
	            paragraphText = args[0],
	            code = args[1],
	            text = _diagrams2['default'].utils.wrapInParagraph(paragraphText) + codeFn(code);
	
	        args = args.splice(2);
	        args.unshift(text);
	        return helpers[helpersMethod].apply(this, args);
	      };
	    };
	  });
	
	  Layer = (function (_d$Diagram) {
	    _inherits(Layer, _d$Diagram);
	
	    function Layer() {
	      _classCallCheck(this, Layer);
	
	      _get(Object.getPrototypeOf(Layer.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(Layer, [{
	      key: 'create',
	      value: function create(creationId, conf) {
	        var diagram = this,
	            config = helpers.config,
	            colors = ['#ECD078', '#D95B43', '#C02942', '#78E4B7', '#53777A', '#00A8C6', '#AEE239', '#FAAE8A'],
	            addItemsPropToBottomItems = function addItemsPropToBottomItems(layers) {
	          _.each(layers, function (layer) {
	            if (layer.hasOwnProperty('items') === false) {
	              layer.items = [];
	            } else addItemsPropToBottomItems(layer.items);
	          });
	        },
	            calculateTheMostOptimalConnection = function calculateTheMostOptimalConnection(layerA, layerBObj) {
	          // There are 12 possible: 4 sides to 3 each
	          var getTopSidePos = function getTopSidePos(layer) {
	            return {
	              x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
	              y: layer.y * config.heightSize + config.depthHeightFactor * layer.depth
	            };
	          },
	              getBottomSidePos = function getBottomSidePos(layer) {
	            return {
	              x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
	              y: (layer.y + layer.height) * config.heightSize - config.depthHeightFactor * layer.depth
	            };
	          },
	              getLeftSidePos = function getLeftSidePos(layer) {
	            return {
	              x: layer.x * config.widthSize + config.depthWidthFactor * layer.depth,
	              y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
	            };
	          },
	              getRightSidePos = function getRightSidePos(layer) {
	            return {
	              x: (layer.x + layer.width) * config.widthSize - config.depthWidthFactor * layer.depth,
	              y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
	            };
	          },
	              getSidesPos = function getSidesPos(layer) {
	            return {
	              top: getTopSidePos(layer),
	              bottom: getBottomSidePos(layer),
	              left: getLeftSidePos(layer),
	              right: getRightSidePos(layer)
	            };
	          },
	              distance = {
	            val: Infinity
	          },
	              doesNotCrossAnyOfTwoLayers = function doesNotCrossAnyOfTwoLayers(posA, posB, sideA, sideB) {
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
	          },
	              calcDistanceAndUpdate = function calcDistanceAndUpdate(posA, posB) {
	            var e2 = function e2(num) {
	              return Math.pow(num, 2);
	            },
	                newDistance = Math.sqrt(e2(posA.x - posB.x) + e2(posA.y - posB.y));
	            if (newDistance < distance.val) {
	              distance.val = newDistance;
	              distance.from = posA;
	              distance.to = posB;
	              return true;
	            } else return false;
	          },
	              eachSide = function eachSide(cb) {
	            _.each(['top', 'bottom', 'left', 'right'], function (side) {
	              cb(side);
	            });
	          },
	              sameTypeOfSides = function sameTypeOfSides(sideA, sideB) {
	            var result = false;
	            _.each([[sideA, sideB], [sideB, sideA]], function (sides) {
	              if (sides[0] === 'top' && sides[1] === 'bottom') result = true;else if (sides[0] === 'left' && sides[1] === 'right') result = true;
	            });
	            return result;
	          },
	              loopSidesToGetConnection = function loopSidesToGetConnection(sameTypeOfSidesCondition) {
	            eachSide(function (sideA) {
	              eachSide(function (sideB) {
	                if (_.isUndefined(layerB.alreadyConnections)) layerB.alreadyConnections = [];
	                if (sideA !== sideB && layerA.alreadyConnections.indexOf(sideA) < 0 && layerB.alreadyConnections.indexOf(sideB) < 0) {
	                  if (sameTypeOfSidesCondition === false && sameTypeOfSides(sideA, sideB) === false || sameTypeOfSides(sideA, sideB)) {
	                    if (doesNotCrossAnyOfTwoLayers(layerAPos[sideA], layerBPos[sideB], sideA, sideB)) {
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
	          },
	              layerB = layerBObj.layer,
	              layerAPos = getSidesPos(layerA),
	              layerBPos = getSidesPos(layerB),
	              changed;
	
	          loopSidesToGetConnection(true);
	          if (changed !== true) loopSidesToGetConnection(false);
	
	          layerA.alreadyConnections.push(distance.sideA);
	          layerB.alreadyConnections.push(distance.sideB);
	          return distance;
	        },
	            drawConnection = function drawConnection(connection) {
	          var container = connection.layer.container,
	              containerData = connection.layer.containerData,
	              connectionG,
	              connectionId,
	              connectionCoords,
	              linkLine,
	              connectionPath;
	
	          _.each(connection.connectedTo, function (connectedToLayer) {
	            connectionCoords = calculateTheMostOptimalConnection(connection.layer, connectedToLayer);
	
	            linkLine = d3.svg.line().x(dTextFn('x')).y(dTextFn('y'));
	            connectionId = connection.layer.id + '-' + connectedToLayer.layer.id;
	            connectionG = container.append('g').attr('id', connectionId);
	            if (connectionCoords.from && connectionCoords.to) {
	              connectionPath = connectionG.append('path').attr('d', linkLine([connectionCoords.from, connectionCoords.to])).style({
	                stroke: '#000',
	                fill: 'none'
	              });
	
	              if (connectedToLayer.type === 'dashed') connectionPath.style('stroke-dasharray', '5, 5');
	
	              connectionG.append("circle").attr({
	                cx: connectionCoords.to.x,
	                cy: connectionCoords.to.y,
	                r: 5,
	                fill: colors[connection.layer.depth - 1]
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
	        },
	            drawConnectionsIfAny = function drawConnectionsIfAny(layers) {
	          layers = layers || conf;
	
	          _.chain(layers).filter(function (layer) {
	            return layer.hasOwnProperty('connectedTo');
	          }).map(function (layer) {
	            var layersConnectedTo = [],
	                layerConnectedObj,
	                layerConnectedId,
	                layerConnectedType;
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
	              layer: layer,
	              connectedTo: layersConnectedTo
	            };
	          }).each(function (connection) {
	            drawConnection(connection);
	          }).value();
	
	          _.chain(layers).filter(function (layer) {
	            return layer.items.length > 0;
	          }).each(function (layer) {
	            drawConnectionsIfAny(layer.items);
	          }).value();
	        },
	            updateSvgHeight = function updateSvgHeight() {
	          var getBottomPointOfLayer = function getBottomPointOfLayer(layer) {
	            return layer.y + layer.height;
	          },
	              bottomLayer = _.max(conf, getBottomPointOfLayer),
	              bottomPoint = getBottomPointOfLayer(bottomLayer),
	              bottomPointPxs = bottomPoint * config.heightSize + 20;
	
	          svg.attr('height', bottomPointPxs);
	        },
	            calcMaxUnityWidth = function calcMaxUnityWidth() {
	          var bodyWidth = document.body.getBoundingClientRect().width;
	
	          helpers.maxUnityWidth = Math.floor(bodyWidth / config.widthSize);
	        },
	            showAllLayerContainerConnections = function showAllLayerContainerConnections(childLayer) {
	          if (childLayer.containerData) {
	            var connections = childLayer.containerData.connections;
	            if (connections) {
	              _.each(connections, function (connection) {
	                connection.el.style('opacity', 1);
	              });
	            }
	          }
	        },
	            hideAllLayerContainerConnectionsExceptOfLayer = function hideAllLayerContainerConnectionsExceptOfLayer(childLayer) {
	          if (childLayer.containerData) {
	            var connections = childLayer.containerData.connections;
	            if (connections) {
	              _.each(connections, function (connection) {
	                if (connection.id.indexOf(childLayer.id) === -1) connection.el.style('opacity', 0.2);
	              });
	            }
	          }
	        },
	            formatLayerTextIfNecessary = function formatLayerTextIfNecessary(text) {
	          text = text.replace(/<p>/g, '');
	          text = text.replace(/<\/p>/g, '. ');
	          text = _diagrams2['default'].utils.replaceCodeFragmentOfText(text, function (matchStr, language, codeBlock) {
	            if (matchStr === text && /\n/.test(matchStr) === false) return codeBlock;else return '<CODE...>';
	          });
	          return text;
	        },
	            drawLayersInContainer = function drawLayersInContainer(layers, container, containerData) {
	          var widthSize = config.widthSize,
	              heightSize = config.heightSize,
	              layerG,
	              layerNode,
	              layerDims,
	              layerText;
	
	          layers = layers || conf;
	          container = container || svg;
	
	          _.each(layers, function (layer, layerIndex) {
	
	            var currentLayerId = 'diagrams-layer-g-' + layerGId++,
	                numberG;
	
	            layerG = container.append('g').attr({
	              transform: 'translate(' + String(layer.x * widthSize) + ', ' + layer.y * heightSize + ')',
	              'class': 'layer-node',
	              id: currentLayerId
	            });
	
	            layer.layerG = layerG;
	            layer.container = container;
	            layer.containerData = containerData;
	
	            layerDims = helpers.getFinalLayerDimensions(layer);
	            layerNode = layerG.append('g');
	            if (layer.conditional === true) {
	              layerNode.append('path').attr({
	                d: _diagrams2['default'].shapes.hexagon({
	                  height: layerDims.height,
	                  width: layerDims.width,
	                  widthPercent: 97 + Math.abs(3 - layer.depth)
	                }),
	                transform: layerDims.transform,
	                fill: layerDims.fill,
	                stroke: '#f00'
	              });
	            } else {
	              layerNode.append('rect').attr({
	                width: layerDims.width,
	                transform: layerDims.transform,
	                height: layerDims.height,
	                fill: layerDims.fill
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
	                r: 10,
	                cx: 4,
	                cy: -4,
	                fill: colors[layer.depth - 1],
	                'stroke-width': 2,
	                stroke: '#000',
	                filert: 'none'
	              });
	              numberG.append('text').text(layerIndex + 1).attr('fill', '#000');
	            }
	
	            if (layer.items.length > 0) {
	              drawLayersInContainer(layer.items, layerG, layer);
	            }
	          });
	        },
	            svg = _diagrams2['default'].svg.generateSvg({
	          margin: '20px 0 0 20px'
	        });
	
	        diagram.markRelatedFn = function (item) {
	          item.data.origFill = item.data.origFill || item.el.select('rect').style('fill');
	          item.el.select('rect').style({
	            'fill': 'rgb(254, 255, 209)'
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
	        _diagrams2['default'].svg.addFilterColor('layer', svg, 3, 2);
	
	        addItemsPropToBottomItems(conf);
	        calcMaxUnityWidth();
	        helpers.generateLayersData(conf);
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
	          if (layer.items && layer.items.length > 0) diagram.generateRelationships(layer.items, layer);
	        });
	      }
	    }]);
	
	    return Layer;
	  })(_diagrams2['default'].Diagram);
	
	  new Layer({
	    name: 'layer',
	    helpers: helpers
	  });
	};
	
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=diagrams.js.map