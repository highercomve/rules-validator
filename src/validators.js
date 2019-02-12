import get from 'lodash.get'
import { factoryValidationObj } from './utils'
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/

export const minLength = (path, errorType, minimun, defaultValue = '') => {
  return (state) => {
    const value = get(state, path, defaultValue) || defaultValue
    return factoryValidationObj(value.length >= minimun, errorType)
  }
}

export const maxLength = (path, errorType, max, defaultValue = '') => {
  return (state) => {
    const value = get(state, path, defaultValue) || defaultValue
    return factoryValidationObj(value.length <= max, errorType)
  }
}

export const required = (path, errorType) => {
  return (state) => factoryValidationObj(get(state, path), errorType)
}

export const compareFields = (path, errorType, otherFieldPath) => {
  return (state) => {
    const fieldOne = get(state, path)
    const fieldTwo = get(state, otherFieldPath)
    return factoryValidationObj(fieldOne === fieldTwo, errorType)
  }
}

export const isEmail = (path, errorType, notUsed, defaultValue = '') => {
  return state => {
    const value = get(state, path, defaultValue) || defaultValue
    return factoryValidationObj(emailRegex.test(value), errorType)
  }
}

export const regex = (path, errorType, expresion, defaultValue = '') => {
  return (state) => {
    const value = get(state, path, defaultValue) || defaultValue
    return factoryValidationObj(expresion.test(value), errorType)
  }
}
