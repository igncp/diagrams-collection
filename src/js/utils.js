// This file is always concatenated at the beginning of the library.
// Maybe it would be worth to separate public and private utils (relatively to the external clients)

d.utils = {};
d.utils.d3DefaultReturnFn = function(props, preffix, suffix) {
  props = props.split('.');
  return function(d) {
    var position = _.reduce(props, function(memo, property) {
      return memo[property];
    }, d);
    return (preffix || suffix) ? preffix + position + suffix : position;
  };
};
d.utils.applySimpleTransform = function(el) {
  el.attr('transform', function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
};
d.utils.positionFn = function(props, offset) {
  offset = offset || 0;
  return d.utils.d3DefaultReturnFn(props, 0, offset);
};
d.utils.textFn = function(props, preffix, suffix) {
  preffix = preffix || '';
  suffix = suffix || '';
  return d.utils.d3DefaultReturnFn(props, preffix, suffix);
};
d.utils.runIfReady = function(fn) {
  if (document.readyState === 'complete') fn();
  else window.onload = fn;
};
d.utils.replaceCodeFragmentOfText = function(text, predicate) {
  var codeRegex = /``([\s\S]*?)``([\s\S]*?)``/g,
    allMatches = text.match(codeRegex);

  return text.replace(codeRegex, function(matchStr, language, codeBlock) {
    return predicate(matchStr, language, codeBlock, allMatches);
  });
};
d.utils.formatTextFragment = function(text) {
  text = d.utils.replaceCodeFragmentOfText(text, function(matchStr, language, code, allMatches) {
    var lastMatch = (matchStr === _.last(allMatches));
    return '<pre' + (lastMatch ? ' class="last-code-block" ' : '') + '><code>' + hljs.highlight(language, code).value + '</pre></code>';
  });
  return text;
};
d.utils.codeBlockOfLanguageFn = function(language, commentsSymbol) {
  commentsSymbol = commentsSymbol || '';
  return function(codeBlock, where, withInlineStrs) {
    if (withInlineStrs === true) codeBlock = commentsSymbol + " ...\n" + codeBlock + "\n" + commentsSymbol + " ...";
    if (_.isString(where)) codeBlock = commentsSymbol + ' @' + where + "\n" + codeBlock;
    return '``' + language + '``' + codeBlock + '``';
  };
};
// This function is created to be able to reference it in the diagrams
d.utils.wrapInParagraph = function(text) {
  return '<p>' + text + '</p>';
};

d.utils.composeWithEventEmitter = function(constructor) {
  var _subjects = [],
    createName = function(name) {
      return '$' + name;
    };

  constructor.prototype.emit = function(name, data) {
    var fnName = createName(name);
    _subjects[fnName] || (_subjects[fnName] = new Rx.Subject());
    _subjects[fnName].onNext(data);
  };

  constructor.prototype.listen = function(name, handler) {
    var fnName = createName(name);
    _subjects[fnName] || (_subjects[fnName] = new Rx.Subject());
    return _subjects[fnName].subscribe(handler);
  };

  constructor.prototype.dispose = function() {
    var subjects = _subjects;
    for (var prop in subjects) {
      if ({}.hasOwnProperty.call(subjects, prop)) {
        subjects[prop].dispose();
      }
    }

    _subjects = {};
  };
};

d.utils.createAnEventEmitter = function() {
  var constructor = function EventEmitter() {};

  d.utils.composeWithEventEmitter(constructor);

  return new constructor();
};

d.utils.generateATextDescriptionStr = function(text, description) {
  return '<strong>' + text + '</strong>' + (description ? '<br>' + description : '');
};

d.utils.formatShortDescription = function(text) {
  text = text.replace(/<p>/g, '');
  text = text.replace(/<br>/g, ' ');
  text = text.replace(/<\/p>/g, '. ');
  text = d.utils.replaceCodeFragmentOfText(text, function(matchStr, language, codeBlock) {
    if (matchStr === text && /\n/.test(matchStr) === false) return codeBlock;
    else return ' <CODE...>';
  });
  return text;
};