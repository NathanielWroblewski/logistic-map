const toInt = value => parseInt(value, 10)
const toFloat = value => parseFloat(value) || 0
const bounded = (value, min = 0, max) => Math.min(Math.max(value || 0, min), max)

const PARAMETERS = {
  rmin: value => bounded(toFloat(value), 0.00001, 3.99999),
  rmax: value => bounded(toFloat(value), 0.00002, 4),
  xmin: value => bounded(toFloat(value), 0.00001, 0.99999),
  xmax: value => bounded(toFloat(value), 0.00002, 1.0),
  xo: value => bounded(toFloat(value), 0.00001, 1.0),
  offset: value => bounded(toInt(value), 0, 999999999),
  limit: value => bounded(toInt(value), 0, 999999999),
}

class BifurcationForm {
  constructor ({ element, model }) {
    this.element = element
    this.model = model

    this.submit = this.handleUpdate.bind(this)
    this.back = this.handleBack.bind(this)
  }

  removeListeners () {
    this.toggleListeners(false)
  }

  setListeners () {
    this.toggleListeners(true)
  }

  toggleListeners (toggleOn = false) {
    const handler = toggleOn ? 'addEventListener' : 'removeEventListener'
    const backButton = this.element.querySelector('.back')

    this.element[handler]('submit', this.submit)

    if (backButton) {
      backButton[handler]('click', this.back)
    }
  }

  getAllValues () {
    const currentParameters = this.model.peek()

    return Object.entries(PARAMETERS).reduce((memo, [parameter, sanitize]) => {
      const input = this.getFormValueFor(parameter)
      const value = sanitize(input) || currentParameters[parameter]

      memo[parameter] = value
      return memo
    }, {})
  }

  getFormValueFor (parameter) {
    return this.element.querySelector(`.${parameter}`).value
  }

  handleUpdate (e) {
    e.preventDefault()

    this.model.push(this.getAllValues())
  }

  handleBack (e) {
    e.preventDefault()

    this.model.pop()
  }

  templateInput ({ label = '', value = 0.0, className = '' }) {
    return `
      <label>
        <span class="label">${label}</span>
        <input type="number" value="${value}" class="${className}" step="0.00001"/>
      </label>
    `
  }

  templateFieldset ({ legend = '', inputs = [] }) {
    return inputs.reduce((html, input) => (
      html += this.templateInput(input)
    ), `<fieldset><legend>${legend}</legend>`) + '</fieldset>'
  }

  templateMinMax ({ legend, axis, min, max }) {
    const inputs = [
      { label: `<i>${axis}<sub>min</sub></i>`, value: min, className: `${axis}min` },
      { label: `<i>${axis}<sub>max</sub></i>`, value: max, className: `${axis}max` },
    ]

    return this.templateFieldset({ legend, inputs })
  }

  template ({ rmax, rmin, xmax, xmin, xo, offset, limit }, canGoBack = false) {
    const inputs = [
      { label: '<i>x<sub>0</sub></i>', value: xo, className: 'xo' },
      { label: 'offset', value: offset, className: 'offset' },
      { label: 'limit', value: limit, className: 'limit' },
    ]

    return `
      ${this.templateFieldset({ legend: 'Parameters', inputs })}
      ${this.templateMinMax({ legend: 'Domain', axis: 'r', min: rmin, max: rmax })}
      ${this.templateMinMax({ legend: 'Range', axis: 'x', min: xmin, max: xmax })}
      <input class="update" type="submit" value="Update Plot" />
      ${canGoBack ? '<a href="#" class="back">Back</a>' : ''}
    `
  }

  render () {
    const parameters = this.model.peek()
    const canGoBack = !!(this.model.size() - 1)

    this.removeListeners()
    this.element.innerHTML = this.template(parameters, canGoBack)
    this.setListeners()

    return this
  }
}

export default BifurcationForm
