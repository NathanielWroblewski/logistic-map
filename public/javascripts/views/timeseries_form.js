const toFloat = value => parseFloat(value) || 0
const bounded = (value, min = 0, max) => Math.min(Math.max(value || 0, min), max)

class Inputs {
  constructor ({ element, model }) {
    this.element = element
    this.model = model

    this.submit = this.handleUpdate.bind(this)
  }

  removeListeners () {
    this.element.removeEventListener('submit', this.submit)
  }

  setListeners () {
    this.element.addEventListener('submit', this.submit)
  }

  getAllValues () {
    return {
      x: bounded(toFloat(this.getFormValueFor('x')), 0.001, 0.999),
      r: bounded(toFloat(this.getFormValueFor('r')), 1, 4),
    }
  }

  getFormValueFor (parameter) {
    return this.element.querySelector(`.${parameter}`).value
  }

  handleUpdate (e) {
    e.preventDefault()

    this.model.update(this.getAllValues())
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

  template ({ x, r }) {
    const inputs = [
      { label: '<i>x<sub>0</sub></i>', value: x, className: 'x' },
      { label: '<i>r</i>', value: r, className: 'r' },
    ]

    return `
      ${this.templateFieldset({ legend: 'Parameters', inputs })}
      <input class="update" type="submit" value="Update Orbit" />
    `
  }

  render () {
    this.removeListeners()
    this.element.innerHTML = this.template(this.model.toJS())
    this.setListeners()

    return this
  }
}

export default Inputs
