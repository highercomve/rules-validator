import get from 'lodash.get'

/**
 * @typedef {Object} validationsObj
 * @property {boolean} valid
 * @property {string[]} errors
 */

/**
 * @typedef {Object} validationObj
 * @property {boolean} valid
 * @property {string} error
 */

/**
 * @typedef {Object} IDescription
 * @property {string} type
 * @property {string} name
 * @property {string} stateMap
 * @property {any} compareWith
 * @property {any} defaultValue
 */

/**
 * @typedef {Object} IRulesDescriptor
 * @property {string} errorType
 * @property {Function} validate
*/

const matchKey = (key) => (t) => t.indexOf(key) === 0

const isErrorActiveMaching = (rulesErrors, type) => {
  return typeof type === 'string'
    ? rulesErrors.findIndex(matchKey(type))
    : type.findIndex((t) => rulesErrors.findIndex(matchKey(t)) >= 0)
}

const isErrorAbsolute = (rulesErrors, type) => {
  return typeof type === 'string'
    ? rulesErrors.indexOf(type)
    : type.findIndex((t) => rulesErrors.indexOf(t) >= 0)
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const capitalize = (string) => {
  return string
    .trim()
    .replace(/-/, ' ')
    .split(' ')
    .map(capitalizeFirstLetter)
    .reduce((reduced, value) => `${reduced}${value}`, '')
}

/**
 * Pass array of rules
 * @param {Array} rules
 * @param {Object} state
 * @param {Object} previus
 * @return {validationsObj}
 */
function validate (rules = [], state, previus = { valid: true, errors: [] }) {
  return Object.keys(rules).reduce((results, key) => {
    const rule = rules[key]
    const appliedRule = rule(state)
    results.valid = results.valid && appliedRule.valid
    if (appliedRule.error) {
      results.errors.push(appliedRule.error)
    }
    return results
  }, previus)
}

/**
 * Create a rule validator
 * @param {IDescription} description
 * @returns {IRulesDescriptor}
*/
function ruleCreator (validators, description) {
  const errorType = `${description.name}-${description.type}`
  const validate = validators[description.type]
    ? validators[description.type](description.stateMap, errorType, description.compareWith, description.defaultValue)
    : validators.required(description.stateMap, errorType, description.compareWith, description.defaultValue)
  return {
    validate,
    errorType
  }
}

/**
 * Create a set of rules validator
 * @param {Object} types
 * @param {Array<IDescription>} descriptions
 * @returns {Object}
*/
export function rulesCreator (validators, types = {}, descriptions = []) {
  return descriptions.reduce((rules, description) => {
    if (!description.name || !description.type || !description.stateMap) {
      throw new Error('Every descriptor needs at least name, type and stateMap')
    }
    const { validate, errorType } = ruleCreator(validators, description)
    const typeConst = errorType.toUpperCase().replace(/-/g, '_')
    const functionName = capitalize(errorType)
    rules[functionName] = validate
    types[typeConst] = errorType
    return rules
  }, {})
}

/**
 * Create a validation object
 * @param {Boolean} valid
 * @param {String} errorType
 * @returns {validationObj}
 */
export function factoryValidationObj (valid = false, errorType) {
  return {
    valid: Boolean(valid),
    error: valid ? undefined : errorType
  }
}

export function findIndexForActiveError (rulesErrors = [], types = '', match) {
  return match
    ? isErrorActiveMaching(rulesErrors, types)
    : isErrorAbsolute(rulesErrors, types)
}

export function isErrorActive (rulesErrors = [], types = '', match) {
  return findIndexForActiveError(rulesErrors, types, match) >= 0
}

/**
 * Pass validation rules per application
 * @param {Object} rules
 * @param {Object} store application store
 * @param {String} appName smartgut|smartjane|smartflu
 * @param {String} component validation component name
 * @return {validationsObj}
 */
export function appRulesValidation (rules, state, appName = '', component) {
  const generalRules = get(rules, `default.${component}`)
  const appRules = get(rules, `${appName.toLowerCase()}.${component}`)
  const generals = generalRules ? validate(generalRules, state) : undefined
  return !appRules ? generals : validate(appRules, state, generals)
}
