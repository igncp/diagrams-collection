const utils = {
  d3DefaultReturnFn(props, preffix, suffix) {
    props = props.split('.');

    return (d) => {
      const position = _.reduce(props, (memo, property) => memo[property], d);

      return (preffix || suffix) ? preffix + position + suffix : position;
    };
  },

  applySimpleTransform(el) {
    el.attr('transform', d => `translate(${d.x},${d.y})`);
  },

  positionFn(props, offset) {
    offset = offset || 0;

    return utils.d3DefaultReturnFn(props, 0, offset);
  },

  textFn(props, preffix, suffix) {
    preffix = preffix || '';
    suffix = suffix || '';

    return utils.d3DefaultReturnFn(props, preffix, suffix);
  },

  runIfReady(fn) {
    if (document.readyState === 'complete') fn();
    else window.onload = fn;
  },

  replaceCodeFragmentOfText(text, predicate) {
    const codeRegex = /``([\s\S]*?)``([\s\S]*?)``/g;
    const allMatches = text.match(codeRegex);

    return text.replace(codeRegex, (matchStr, language, codeBlock) => {
      return predicate({ matchStr, language, codeBlock, allMatches });
    });
  },

  formatTextFragment(text) {
    const tagsToEncode = ['strong', 'code', 'pre', 'br', 'span', 'p'];
    const encodeOrDecodeTags = (action, tag) => {
      const encodeOrDecodeTagsWithAction = _.partial(encodeOrDecodeTags, action);
      const beginningTagArr = [
        `<${tag}(.*?)>`,
        `<${tag}$1>`,
        `${tag}DIAGSA(.*?)DIAGSB${tag}DIAGSC`,
        `${tag}DIAGSA$1DIAGSB${tag}DIAGSC`,
      ];
      const endingTagReal = `</${tag}>`;
      const endingTagFake = `${tag}ENDREPLACEDDIAGRAMS`;
      const endingTagArr = [endingTagReal, endingTagReal, endingTagFake, endingTagFake];
      const replaceText = function(from, to) {
        text = text.replace(new RegExp(from, 'g'), to);
      };

      if (_.isArray(tag)) _.each(tag, encodeOrDecodeTagsWithAction);
      else {
        _.each([beginningTagArr, endingTagArr], (arr) => {
          if (action === 'encode') replaceText(arr[0], arr[3]);
          else if (action === 'decode') replaceText(arr[2], arr[1]);
        });
      }
    };

    text = utils.replaceCodeFragmentOfText(text,
      ({ matchStr, language, codeBlock, allMatches }) => {
        const lastMatch = (matchStr === _.last(allMatches));

        return `<pre${(lastMatch ? ' class="last-code-block" ' : '')}><code>`
          + `${hljs.highlight(language, codeBlock).value}</pre></code>`;
      });

    encodeOrDecodeTags('encode', tagsToEncode);
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    encodeOrDecodeTags('decode', tagsToEncode);

    return text;
  },

  codeBlockOfLanguageFn(language, commentsSymbol) {
    commentsSymbol = commentsSymbol || '';

    return function(codeBlock, where, withInlineStrs) {
      if (withInlineStrs === true) {
        codeBlock = `${commentsSymbol} ...\n${codeBlock}\n${commentsSymbol} ...`;
      }

      if (_.isString(where)) codeBlock = `${commentsSymbol} @${where}\n${codeBlock}`;

      return `\`\`${language}\`\`${codeBlock}\`\``;
    };
  },

  // This function is created to be able to reference it in the diagrams
  wrapInParagraph: (text) => `<p>${text}</p>`,

  composeWithEventEmitter(constructor) {
    let _subjects = {};
    const createName = name => `$${name}`;
    const dispose = function(prop) {
      if ({}.hasOwnProperty.call(_subjects, prop)) {
        _subjects[prop].dispose();
        _subjects[prop] = null;
      }
    };

    constructor.prototype.emit = function(name, data) {
      const fnName = createName(name);

      _subjects[fnName] = _subjects[fnName] || new Rx.Subject();
      _subjects[fnName].onNext(data);
    };

    constructor.prototype.listen = function(name, handler) {
      const fnName = createName(name);

      _subjects[fnName] = _subjects[fnName] || new Rx.Subject();

      return _subjects[fnName].subscribe(handler);
    };

    constructor.prototype.unlisten = function(name) {
      const fnName = createName(name);

      dispose(fnName);
    };

    constructor.prototype.dispose = function() {
      for (const prop in _subjects) dispose(prop);

      _subjects = {};
    };
  },

  createAnEventEmitter() {
    const constructor = function EventEmitter() {};

    utils.composeWithEventEmitter(constructor);

    return new constructor();
  },

  generateATextDescriptionStr(text, description) {
    const descriptionText = (description ? `<br>${description}` : '');

    return `<strong>${text}</strong>${descriptionText}`;
  },

  formatShortDescription(text) {
    text = text.replace(/<p>/g, '');
    text = text.replace(/<br>/g, ' ');
    text = text.replace(/<\/p>/g, '. ');
    text = utils.replaceCodeFragmentOfText(text, ({ matchStr, codeBlock }) => {
      if (matchStr === text && /\n/.test(matchStr) === false) return codeBlock;
      else {
        return ' <CODE...>';
      }
    });

    return text;
  },

  dataFromGeneralToSpecificForATreeStructureType(generalData) {
    let FPNRecursiveFailed = false; // FPN: Find Parent Node
    const itemsIdToItemsMap = {};
    const nodesData = {};
    const findParentNodeFn = () => {
      let itemsChecked;
      const itemsIdToFromConnectionMap = {};
      const FPNRecursiveFn = (item) => {
        let connection, parentItemId, parentItem;

        if (itemsChecked.indexOf(item) > -1) {
          FPNRecursiveFailed = true;

          return;
        } else itemsChecked.push(item);

        if (_.isUndefined(itemsIdToFromConnectionMap[item.id]) === false) {
          connection = itemsIdToFromConnectionMap[item.id];
        } else {
          connection = _.where(generalData.connections, {
            from: item.id,
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
              id: parentItemId,
            })[0];
            itemsIdToItemsMap[parentItemId] = parentItem;
          }
          FPNRecursiveFn(parentItem);
        } else FPNRecursiveFailed = true;
      };

      _.each(generalData.items, (item) => {
        if (FPNRecursiveFailed === false) {
          itemsChecked = [];
          itemsIdToItemsMap[item.id] = item;
          FPNRecursiveFn(item);
        }
      });
    };
    const buildNodesDataRecursiveFn = (transformedData, item) => {
      let text, children;

      transformedData.id = item.id;
      text = item.name;

      if (item.description) text += `: ${item.description}`;
      transformedData.text = text;

      children = _.where(generalData.connections, {
        to: item.id,
      });

      if (children.length > 0) {
        transformedData.items = [];
        _.each(children, (child) => {
          transformedData.items.push({});
          buildNodesDataRecursiveFn(_.last(transformedData.items), itemsIdToItemsMap[child.from]);
        });
      }
    };
    let parentNode;

    findParentNodeFn();

    if (FPNRecursiveFailed) {
      alert('The data structure is not suitable for this diagram');

      return [];
    } else {
      buildNodesDataRecursiveFn(nodesData, parentNode);

      return nodesData;
    }
  },

  getUrlParams() {
    const query_string = {};
    const query = window.location.search.substring(1);
    const vars = query.split("&");

    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");

      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === "string") {
        const arr = [query_string[pair[0]], decodeURIComponent(pair[1])];

        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }

    return query_string;
  },

  joinWithLastDifferent(arr, separator, lastSeparator) {
    return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1];
  },
};

utils.commasAndAndJoin = _.partial(utils.joinWithLastDifferent, _, ', ', ' and ');

export default utils;
