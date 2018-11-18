import Parameters from './models/parameters.js'
import Stack from './models/stack.js'
import TimeseriesForm from './views/timeseries_form.js'
import BifurcationForm from './views/bifurcation_form.js'
import InteractionLayer from './views/interaction_layer.js'
import { logisticMap } from './utilities/iterated_functions.js'
import defaults from './constants/defaults.js'
import { point } from './views/primitives.js'
import renderBifurcationDiagram from './views/bifurcation_diagram.js'
import renderFinalStateDiagram from './views/final_state_diagram.js'
import renderTimeseries from './views/timeseries.js'
import clear from './views/clear.js'

// Figures 1-3
const FIGURE_R_VALUES = {
  one: 2.9,
  two: 3.2,
  three: 3.628,
  four: 3.9,
}

const sharedConfig = {
  iteratedFunction: logisticMap,
  height: 200,
  width: 585
}

Object.entries(FIGURE_R_VALUES).forEach(([figure, r]) => {
  renderTimeseries({
    ...sharedConfig,
    element: document.querySelector(`.figure.${figure} .timeseries`),
    params: { xo: 0.1, r }
  })
  renderFinalStateDiagram({
    ...sharedConfig,
    element: document.querySelector(`.figure.${figure} .final-state`),
    args: { x: 0.1, r },
    params: { limit: 200, offset: 100, xmax: 1.0, xmin: 0 },
    roffset: 5,
    renderer: point
  })
})

// Figure 5
const timeseries = document.querySelector(`.figure.five .timeseries`)
const finalState = document.querySelector(`.figure.five .final-state`)
const parameters = new Parameters(defaults.timeseries)
const timeseriesForm = new TimeseriesForm({
  element: document.querySelector('.figure.five .timeseries-form'),
  model: parameters
})

parameters.on('change', () => {
  const { x, r } = parameters.toJS()

  clear({ element: timeseries })
  clear({ element: finalState })
  renderTimeseries({
    ...sharedConfig,
    element: timeseries,
    params: { xo: x, r }
  })
  renderFinalStateDiagram({
    ...sharedConfig,
    element: finalState,
    args: { x: x, r },
    params: { limit: 200, offset: 100, xmax: 1.0, xmin: 0 },
    roffset: 5,
    renderer: point
  })
  timeseriesForm.render()
})

parameters.trigger('change')

// Figure 6
const diagram = document.querySelector('.bifurcation-diagram')
const fields = document.querySelector('.bifurcation-form')
const layer = document.querySelector('.interaction-layer')

const history = new Stack()

const bifurcationForm = new BifurcationForm({ element: fields, model: history })
const interactionLayer = new InteractionLayer({ element: layer, model: history })

history.on('change', () => {
  clear({ element: diagram })
  bifurcationForm.render()
  renderBifurcationDiagram({
    element: diagram,
    params: history.peek(),
    iteratedFunction: logisticMap
  })
})

history.push(defaults.bifurcation)
