import d from 'diagrams'
import svg from 'svg'

const defaultDiagramConfiguration = {}
let createdDiagramsMaxId = 0

d.diagramsRegistry = []

const getDiagramClass = () => {
  const Diagram = class Diagram {
    static convertDiagram(creationId, toDiagramType) {
      const item = Diagram.getRegistryItemWithCreationId(creationId)
      const newArgs = item.data.slice(1)
      let generalData, specificData

      generalData = item.diagram.dataFromSpecificToGeneral.apply({}, newArgs)
      specificData = d[toDiagramType].dataFromGeneralToSpecific.apply({}, [generalData])

      d.events.emit('diagram-to-transform', item.diagram)

      Diagram.removePreviousDiagrams()
      d[toDiagramType].apply(item.diagram, [specificData])
    }

    static removePreviousDiagrams() {
      d3.selectAll('input.diagrams-diagram-button').remove()
      d3.select('svg').remove()
    }

    static addDivBeforeSvg() {
      const div = svg.insertInBodyBeforeSvg('div')

      div.appendButtonToDiv = function(cls, value, onclick) {
        div.append('input').attr({
          class: `${cls} diagrams-diagram-button btn btn-default`,
          onclick,
          type: 'button',
          value,
        })
      }

      return div
    }

    static getRegistryItemWithCreationId(creationId) {
      const items = _.where(d.diagramsRegistry, {
        id: creationId,
      })

      return (items.length === 1) ? items[0] : null
    }

    static getDataWithCreationId(creationId) {
      const item = Diagram.getRegistryItemWithCreationId(creationId)

      return (item) ? item.data : null
    }

    constructor(opts) {
      const diagram = this
      const prototype = Object.getPrototypeOf(diagram)

      diagram.name = opts.name
      diagram._configuration = opts.configuration || {}

      prototype.configurationKeys = opts.configurationKeys || {}

      _.each(Object.keys(opts.helpers), (helperName) => {
        if (_.isFunction(opts.helpers[helperName])) {
          opts.helpers[helperName] = _.bind(opts.helpers[helperName], diagram)
        }
      })
      _.merge(diagram._configuration, defaultDiagramConfiguration)
      _.each(Object.keys(diagram._configuration), (confKey) => {
        diagram.configCheckingLocalStorage(confKey, diagram._configuration[confKey])
      })
      _.defaults(prototype, opts.helpers)
      diagram.register()
    }

    reRender() {
      return null
    }

    addMouseListenersToEl(el, data, callbacks) {
      const diagram = this
      const emitFn = (d3Event, emitedEvent) => {
        emitedEvent = emitedEvent || d3Event
        el.on(d3Event, () => {
          diagram.emit(emitedEvent, emitContent)

          if (callbacks && callbacks[d3Event]) callbacks[d3Event](emitContent)
        })
      }
      const emitContent = { data, el }

      emitFn('mouseleave')
      emitFn('mouseenter')
      emitFn('click', 'itemclick')
    }

    removePreviousAndCreate() {
      const diagram = this

      Diagram.removePreviousDiagrams()
      diagram.addConversionButtons()
      diagram.create(...arguments)
    }

    config(opts, optValue) {
      const argsLength = arguments.length
      const optsType = typeof(opts)
      let optsKey

      if (argsLength === 0) return this._configuration
      else if (argsLength === 1) {
        if (_.isFunction(optsType)) optsKey = opts()
        else if (_.isString(opts)) optsKey = opts
        else if (_.isObject(opts)) {
          for (const key in opts) {
            if (opts.hasOwnProperty(key)) this.config(key, opts[key])
          }

          return opts
        }

        return this._configuration[optsKey]
      } else if (argsLength === 2) {
        this._configuration[opts] = optValue

        if (_.isObject(optValue)) this.setToLocalStorage(opts, optValue.value)
        else this.setToLocalStorage(opts, optValue)

        this.emit('configuration-changed', {
          key: opts,
          value: optValue,
        })

        return optValue
      }
    }

    configCheckingLocalStorage(key, defaultValue) {
      const diagram = this
      const finalValue = diagram.getFromLocalStorage(key, defaultValue)

      diagram.config(key, finalValue)
    }

    generateLocalStorageKeyPreffix(originalKey) {
      return `diagramsjs-${originalKey}`
    }

    getFromLocalStorage(originalKey, defaultItem) {
      const diagram = this
      const getAndConvertStrBoolean = function(defaultValue) {
        let rv = localStorage.getItem(diagram.generateLocalStorageKeyPreffix(originalKey))
          || defaultValue

        if (rv === 'false') rv = false
        else if (rv === 'true') rv = true

        return rv
      }
      let finalValue = defaultItem

      if (localStorage && localStorage.getItem) {
        if (_.isObject(finalValue)) {
          finalValue.value = getAndConvertStrBoolean(finalValue.value)

          if (finalValue.type) finalValue.value = finalValue.type(finalValue.value)
        } else finalValue = getAndConvertStrBoolean(finalValue)
      }

      return finalValue
    }

    setToLocalStorage(originalKey, value) {
      const diagram = this

      if (localStorage && localStorage.setItem) {
        return localStorage.setItem(diagram.generateLocalStorageKeyPreffix(originalKey), value)
      }
    }

    generateEmptyRelationships(item) {
      item.relationships = {}
      item.relationships.dependants = []
      item.relationships.dependencies = []
    }

    addDependantRelationship(item, el, data) {
      item.relationships.dependants.push(this.generateRelationship(el, data))
    }

    addSelfRelationship(item, el, data) {
      item.relationships.self = this.generateRelationship(el, data)
    }

    addDependencyRelationship(item, el, data) {
      item.relationships.dependencies.push(this.generateRelationship(el, data))
    }

    generateRelationship(el, data) {
      return { data, el }
    }

    getAllRelatedItemsOfItem(item, relationshipType) {
      const diagram = this
      const relatedItems = []
      const depthThresold = 100
      const recursiveFn = function(relatedItemData, depth) {
        _.each(relatedItemData.relationships[relationshipType], (relatedItemChild) => {
          if (depth < depthThresold) {
            // Handle circular loops
            if (relatedItems.indexOf(relatedItemChild) < 0
              && relatedItemChild.data !== relatedItemData) {
              relatedItems.push(relatedItemChild)
              recursiveFn(relatedItemChild.data, depth + 1)
            }
          }
        })
      }
      let returnObj

      if (relationshipType) {
        recursiveFn(item, 0)

        return relatedItems
      } else {
        returnObj = {}
        _.each(['dependants', 'dependencies'], (relationshipName) => {
          returnObj[relationshipName] = diagram.getAllRelatedItemsOfItem(item, relationshipName)
        })

        return returnObj
      }
    }

    markRelatedItems(item, opts) {
      let relatedItemsGroup
      const diagram = this
      const pushToRelatedItemsGroup = (args) => {
        relatedItemsGroup.push(diagram.getAllRelatedItemsOfItem(...[item].concat(args)))
      }

      opts = opts || {}

      if (diagram.markRelatedFn && item.relationships) {
        relatedItemsGroup = []

        if (opts.filter) pushToRelatedItemsGroup([opts.filter])
        else _.each([
          ['dependants'],
          ['dependencies'],
        ], pushToRelatedItemsGroup)

        _.each(relatedItemsGroup, (relatedItems) => {
          _.each(relatedItems, diagram.markRelatedFn)
        })

        diagram.markRelatedFn(item.relationships.self)
      }
    }

    register() {
      const diagram = this

      d.diagramTypes = d.diagramTypes || []
      d.diagramTypes.push(diagram.name)
      d[diagram.name] = function() {
        const args = Array.prototype.slice.call(arguments)

        d.utils.runIfReady(() => {
          createdDiagramsMaxId++
          d.diagramsRegistry.push({
            data: args,
            diagram,
            id: createdDiagramsMaxId,
          })
          diagram.diagramId = createdDiagramsMaxId
          diagram.addConversionButtons()
          args.unshift(createdDiagramsMaxId)
          diagram.create(...args)
          d.events.emit('diagram-created', diagram)
        })
      }

      _.defaults(d[diagram.name], Object.getPrototypeOf(diagram))
    }

    addConversionButtons() {
      const diagram = this
      const div = Diagram.addDivBeforeSvg()
      let onClickFn

      _.each(d.diagramTypes, (diagramType) => {
        if (diagramType !== diagram.name) {
          onClickFn = `diagrams.Diagram.convertDiagram(${diagram.diagramId}, '${diagramType}')`
          div.appendButtonToDiv('diagrams-box-conversion-button',
            `To ${diagramType} diagram`, onClickFn)
        }
      })
    }
  }

  d.utils.composeWithEventEmitter(Diagram)

  return Diagram
}

export default getDiagramClass
