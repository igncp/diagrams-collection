import d from 'diagrams';
import helpers from './helpers';

export default () => {
  const SHY_CONNECTIONS = 'Show connections selectively';
  const GRAPH_ZOOM = 'dia graph zoom';
  const GRAPH_DRAG = 'Drag nodes on click (may make links difficult)';
  const CURVED_ARROWS = 'All arrows are curved';
  const graphZoomConfig = {
    private: true,
    type: Number,
    value: 1,
  };
  const dPositionFn = d.utils.positionFn;
  const dTextFn = d.utils.textFn;

  const Graph = class Graph extends d.Diagram {
    create(creationId, data, conf) {
      const diagram = this;
      const bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const svg = d.svg.generateSvg();
      const container = svg.append('g');
      const width = svg.attr('width');
      const dragNodesConfig = diagram.config(GRAPH_DRAG);
      const curvedArrows = diagram.config(CURVED_ARROWS);

      helpers.resetLinksNumberMap();

      let force, drag, link, linkOuter, node, zoom,
        singleNodeEl, shape, shapeEl, markers, parsedData;

      const height = d.svg.selectScreenHeightOrHeight(bodyHeight - 250);

      const tick = () => {
        const setPathToLink = (pathClass) => {
          link.select(`path.${pathClass}`).attr("d", (d) => {
            const linksNumber = helpers.getLinksNumberMapItemWithLink(d);
            const linkIndex = d.data.linkIndex;
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * (curvedArrows ? 3.5 : 1)
              * (linkIndex + (curvedArrows ? 1 : 0) / (linksNumber * 3));

            return `M${d.source.x},${d.source.y}A`
              + `${dr},${dr} 0 0,1 `
              + `${d.target.x},${d.target.y}`;
          });
        };

        _.each(['link-path', 'link-path-outer'], setPathToLink);

        node.each((singleNode) => {
          if (singleNode.shape === 'circle') {
            node.select('circle').attr("cx", dPositionFn('x')).attr("cy", dPositionFn('y'));
          } else {
            if (singleNode.shape === 'triangle') shapeEl = node.select('path.triangle');
            else if (singleNode.shape === 'square') shapeEl = node.select('path.square');

            d.utils.applySimpleTransform(shapeEl);
          }
        });
        node.select('text').attr("x", dPositionFn('x')).attr("y", dPositionFn('y', -20));
      };
      const parseData = () => {
        let maxId = _.reduce(data, (memo, node) => {
          const id = node.id || 0;

          return (memo > id) ? memo : id;
        }, 0);
        const idsMap = {};
        const nodesWithLinkMap = {};
        const colors = d3.scale.category20();
        const handleConnections = (node, nodeIndex) => {
          if (node.connections.length > 0) {
            _.each(node.connections, (connection) => {
              _.each(connection.nodesIds, (otherNodeId) => {
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
        };
        let nodeId, color, options, otherNode, linkObj;

        parsedData = {
          links: [],
          nodes: [],
        };
        markers = [];
        _.each(data, (node, nodeIndex) => {
          nodeId = _.isUndefined(node.id) ? maxId++ : node.id;
          color = colors(nodeIndex);
          options = node.options || {};

          parsedData.nodes.push({
            bold: options.bold || false,
            color,
            connections: node.connections || [],
            description: node.description || null,
            id: nodeId,
            linkToUrl: options.linkToUrl || null,
            name: node.name,
            shape: options.shape || 'circle',
          });
          idsMap[nodeId] = {
            index: nodeIndex,
          };
          idsMap[nodeId].color = color;
          markers.push({
            color,
            id: nodeId,
          });

        });

        diagram.config(conf);

        if (conf.info) helpers.addDiagramInfo(diagram, svg, conf.info);

        _.each(parsedData.nodes, handleConnections);

        if (conf.hideNodesWithoutLinks === true) {
          _.each(parsedData.nodes, (node, nodeIndex) => {
            if (nodesWithLinkMap[nodeIndex] !== true) node.hidden = true;
          });
        }
      };

      const zoomed = (translate, scale) => {
        scale = scale || 1;
        container.attr("transform", `translate(${translate})scale(${scale})`);
        graphZoomConfig.value = scale;
        diagram.config(GRAPH_ZOOM, graphZoomConfig);
      };

      const dragstarted = function() {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
        force.start();
      };

      const dragged = function(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      };

      const dragended = function() {
        d3.select(this).classed("dragging", false);
      };

      const setRelationships = () => {
        _.each(parsedData.nodes, diagram.generateEmptyRelationships, diagram);
        _.each(parsedData.nodes, (node) => {
          diagram.addSelfRelationship(node, node.shapeEl, node);
        });
        _.each(parsedData.links, (link) => {
          diagram.addDependencyRelationship(link.source, link.target.shapeEl, link.target);
          diagram.addDependantRelationship(link.target, link.source.shapeEl, link.source);
        });
      };

      const getAllLinks = () => {
        return container.selectAll(".link");
      };

      const getLinksWithIsHiding = () => {
        return getAllLinks().filter((d) => {
          return d.data.hasOwnProperty('shyIsHiding');
        });
      };

      const setLinkIsHidingIfNecessary = (isHiding, link) => {
        let linksWithIsHiding;

        if (diagram.config(SHY_CONNECTIONS)) {
          if (isHiding === false) link.data.shyIsHiding = isHiding;
          else if (isHiding === true) {
            linksWithIsHiding = getLinksWithIsHiding();
            linksWithIsHiding.each((d) => {
              d.data.shyIsHiding = true;
            });
          }
          link.data.shyIsHidingChanged = true;
        }
      };

      const setDisplayOfShyConnections = (display, node) => {
        const isShowing = display === 'show';
        const isHiding = display === 'hide';
        const nodeData = node.data;
        const linksWithIsHiding = getLinksWithIsHiding();
        const nodeLinks = getAllLinks().filter((d) => {
          return d.source.id === nodeData.id || d.target.id === nodeData.id;
        });
        const setDisplay = (links, show) => {
          links.classed('shy-link-hidden', !show);
          links.classed('shy-link-showed', show);
        };
        const hideLinks = (links) => {
          setDisplay(links, false);
          links.each((d) => {
            delete d.data.shyIsHiding;
          });
        };
        const futureConditionalHide = () => {
          setTimeout(() => {
            allAreHiding = true;
            shyIsHidingIsSame = true;
            nodeLinks.each((d) => {
              allAreHiding = allAreHiding && d.data.shyIsHiding;

              if (d.data.shyIsHidingChanged) {
                shyIsHidingIsSame = false;
                delete d.data.shyIsHidingChanged;
              }
            });

            if (allAreHiding && shyIsHidingIsSame) hideLinks(nodeLinks);
            else futureConditionalHide();
          }, 500);
        };
        let allAreHiding, shyIsHidingIsSame;

        if (linksWithIsHiding[0].length === 0) {
          if (isShowing) setDisplay(nodeLinks, true);
          else if (isHiding) {
            nodeLinks.each((d) => {
              d.data.shyIsHiding = true;
            });
            futureConditionalHide();
          }
        } else {
          if (isShowing) {
            linksWithIsHiding.each((d, index) => {
              if (index === 0) d.data.shyIsHiding = false;
            });
          } else if (isHiding) setLinkIsHidingIfNecessary(true, linksWithIsHiding.data()[0]);
        }
      };

      const setReRender = _.partial(helpers.setReRender, diagram, creationId, data, _);

      diagram.markRelatedFn = (item) => {
        item.el.style('stroke-width', '20px');
      };
      diagram.unmarkAllItems = () => {
        _.each(parsedData.nodes, (node) => {
          node.shapeEl.style('stroke-width', '1px');
        });
      };

      conf = conf || {};
      parseData();

      svg.attr({
        height,
        class: 'graph-diagram',
      });

      zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", () => {
        zoomed(d3.event.translate, d3.event.scale);
      });

      svg.call(zoom);

      zoom.translate([100, 100])
        .scale(diagram.config(GRAPH_ZOOM).value);

      zoomed(zoom.translate(), zoom.scale());

      force = d3.layout.force()
        .size([width, height])
        .charge(conf.charge || -10000)
        .linkDistance(conf.linkDistance || 140)
        .on("tick", tick);

      drag = d3.behavior.drag().origin((d) => {
        return d;
      }).on("dragstart", dragstarted).on("drag", dragged).on("dragend", dragended);

      force.nodes(parsedData.nodes).links(parsedData.links).start();

      container.append("svg:defs").selectAll("marker")
        .data(markers)
        .enter().append("svg:marker")
        .attr({
          class: 'arrow-head',
          fill: dTextFn('color'),
          id: dTextFn('id', 'arrow-head-'),
          markerHeight: 8,
          markerWidth: 8,
          orient: 'auto',
          refX: 19,
          refY: curvedArrows ? -1.5 : 0,
          viewBox: '0 -5 10 10',
        }).append("svg:path").attr("d", "M0,-5L10,0L0,5");

      link = container.selectAll(".link").data(parsedData.links).enter().append('g')
        .attr("class", () => {
          let finalClass = 'link';

          if (diagram.config(SHY_CONNECTIONS)) finalClass += ' shy-link shy-link-hidden';

          return finalClass;
        });
      link.append("svg:path").attr({
        class: 'link-path',
        "marker-end": (d) => {
          return `url(#arrow-head-${d.source.id})`;
        },
      }).style({
        stroke: dTextFn('color'),
        'stroke-dasharray': (d) => {
          if (d.data.line === 'plain') return null;
          else if (d.data.line === 'dotted') return '5,5';
        },
      });

      linkOuter = link.append('g');
      linkOuter.append('svg:path').attr('class', 'link-path-outer');
      linkOuter.each(function(d) {
        diagram.addMouseListenersToEl(d3.select(this), d.data, {
          mouseenter(link) {
            setLinkIsHidingIfNecessary(false, link);
          },
          mouseleave(link) {
            setLinkIsHidingIfNecessary(true, link);
          },
        });
      });

      node = container.selectAll(".node").data(parsedData.nodes).enter().append('g').attr({
        class(d) {
          let finalClass = 'node';

          if (d.hidden === true) finalClass += ' node-hidden';

          return finalClass;
        },
        id: dTextFn('id', 'node-'),
      });

      node.each(function(singleNode) {
        let singleNodeClasses = '';

        singleNodeEl = d3.select(this);
        singleNode.fullText = d.utils
          .generateATextDescriptionStr(singleNode.name, singleNode.description);

        if (singleNode.shape === 'circle') {
          shapeEl = singleNodeEl.append("circle").attr({
            r: 12,
            fill: dTextFn('color'),
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
            fill: dTextFn('color'),
          });
          d.utils.applySimpleTransform(shapeEl);
        }

        if (dragNodesConfig === true) shapeEl.call(drag);

        if (singleNode.bold === true) singleNodeClasses += ' bold';
        else singleNodeClasses += ' thin';
        shapeEl.attr('class', singleNodeClasses);

        singleNode.shapeEl = shapeEl;
        diagram.addMouseListenersToEl(shapeEl, singleNode, {
          mouseenter(data) {
            if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('show', data);
          },
          mouseleave(data) {
            if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('hide', data);
          },
          click(node) {
            if (node.data.linkToUrl) window.open(node.data.linkToUrl);
          },
        });
      });

      node.append("text").text(dTextFn('name'));

      setRelationships();
      setReRender(conf);
      diagram.listen('configuration-changed', (conf) => {
        if (conf.key === SHY_CONNECTIONS || conf.key === GRAPH_DRAG) {
          setReRender(conf);
          diagram.removePreviousAndCreate(creationId, data, conf);
        }
      });
    }
  };

  new Graph({
    name: 'graph',
    helpers,
    configurationKeys: {
      SHY_CONNECTIONS,
    },
    configuration: {
      info: null,
      [SHY_CONNECTIONS]: true,
      [GRAPH_ZOOM]: graphZoomConfig,
      [GRAPH_DRAG]: false,
      [CURVED_ARROWS]: false,
    },
  });
};
