import * as Utils from '../src/utils'
import * as validators from '../src/validators'

describe('Utils spec', () => {
  it('Load all utils', () => {
    expect(Utils.factoryValidationObj).toBeDefined()
    expect(Utils.isErrorActive).toBeDefined()
    expect(Utils.rulesCreator).toBeDefined()
    expect(Utils.findIndexForActiveError).toBeDefined()
    expect(Utils.appRulesValidation).toBeDefined()
  })

  describe('factoryValidationObj test', () => {
    it('Create a object with valid: true and error: undefined if is valid', () => {
      const validationObj = Utils.factoryValidationObj(true, 'error-type')
      expect(validationObj).toEqual({ valid: true, error: undefined })
    })

    it('if first parameter is truthy return valid: true as Boolean', () => {
      expect(
        Utils.factoryValidationObj('this exist as string', 'error-type')
      ).toEqual({ valid: true, error: undefined })
      expect(Utils.factoryValidationObj({}, 'error-type')).toEqual({
        valid: true,
        error: undefined
      })
      expect(Utils.factoryValidationObj(() => {}, 'error-type')).toEqual({
        valid: true,
        error: undefined
      })
      expect(Utils.factoryValidationObj('', 'error-type')).toEqual({
        valid: false,
        error: 'error-type'
      })
      expect(Utils.factoryValidationObj(null, 'error-type')).toEqual({
        valid: false,
        error: 'error-type'
      })
      expect(Utils.factoryValidationObj(undefined, 'error-type')).toEqual({
        valid: false,
        error: 'error-type'
      })
    })
  })

  describe('isErrorActive test', () => {
    it('If type is a string return true or false if is the rules', () => {
      const rulesErrors = ['error-1', 'error-2', 'error-3']
      expect(Utils.isErrorActive(rulesErrors, 'error')).toBe(false)
      expect(Utils.isErrorActive(rulesErrors, 'error-1')).toBe(true)
      expect(Utils.isErrorActive(rulesErrors, 'error-2')).toBe(true)
      expect(Utils.isErrorActive(rulesErrors, ['error', 'error-2'])).toBe(true)
      expect(Utils.isErrorActive(rulesErrors, 'error-2')).toBe(true)
    })

    it('If match is active return true if the error start in the same way', () => {
      const rulesErrors = [
        'state-required',
        'phone-required',
        'phone-minLength',
        'phone-maxLength'
      ]
      expect(Utils.isErrorActive(rulesErrors, 'phone')).toBe(false)
      expect(Utils.isErrorActive(rulesErrors, 'state', true)).toBe(true)
      expect(Utils.isErrorActive(rulesErrors, 'state-1', true)).toBe(false)
      expect(Utils.isErrorActive(rulesErrors, 'state-2', true)).toBe(false)
      expect(Utils.isErrorActive(['state-required'], 'state', true)).toBe(true)
      expect(Utils.isErrorActive(['state-maxLength'], 'state', true)).toBe(true)
      expect(Utils.isErrorActive(['state-minLength'], 'state', true)).toBe(true)
      expect(Utils.isErrorActive(['state-minLength'], ['state', 'phone'], true)).toBe(true)
    })
  })

  describe('findIndexForActiveError test', () => {
    it('If type is a string return true or false if is the rules', () => {
      const rulesErrors = ['error-1', 'error-2', 'error-3']
      expect(Utils.findIndexForActiveError(rulesErrors, 'error')).toBe(-1)
      expect(Utils.findIndexForActiveError(rulesErrors, 'error-1')).toBe(0)
      expect(Utils.findIndexForActiveError(rulesErrors, 'error-2')).toBe(1)
    })

    it('If match is active return true if the error start in the same way', () => {
      const rulesErrors = [
        'state-required',
        'phone-required',
        'phone-minLength',
        'phone-maxLength'
      ]
      expect(Utils.findIndexForActiveError(rulesErrors, 'phone')).toBe(-1)
      expect(Utils.findIndexForActiveError(rulesErrors, 'state', true)).toBe(0)
      expect(Utils.findIndexForActiveError(rulesErrors, 'state-1', true)).toBe(-1)
      expect(Utils.findIndexForActiveError(rulesErrors, 'state-2', true)).toBe(-1)
      expect(Utils.findIndexForActiveError(['state-required'], 'state', true)).toBe(0)
      expect(Utils.findIndexForActiveError(['state-maxLength'], 'state', true)).toBe(0)
      expect(Utils.findIndexForActiveError(['state-minLength'], 'state', true)).toBe(0)
    })
  })

  describe('rulesCreator test', () => {
    it('Return Object with functions for validation and mutate the error_types', () => {
      const errorTypes = {}
      const rules = [
        {
          name: 'fisrtName',
          type: 'required',
          stateMap: 'profile.firstName'
        },
        {
          name: 'fisrtName',
          type: 'minLength',
          stateMap: 'profile.firstName',
          compareWith: 10
        }
      ]
      const validators = {
        required: (path, errorType, compareWith, defaultValue = '') => state => Utils.factoryValidationObj(true),
        minLength: (path, errorType, compareWith, defaultValue = '') => state => Utils.factoryValidationObj(true)
      }
      expect(() => {
        Utils.rulesCreator(validators, errorTypes, [
          {
            name: 'fisrtName',
            type: 'required'
          }
        ])
      }).toThrowError('Every descriptor needs at least name, type and stateMap')

      const rulesValidators = Utils.rulesCreator(validators, errorTypes, rules)
      expect(errorTypes).toEqual({
        FISRTNAME_MINLENGTH: 'fisrtName-minLength',
        FISRTNAME_REQUIRED: 'fisrtName-required'
      })
      expect(typeof rulesValidators.FisrtNameRequired).toBe('function')
      expect(typeof rulesValidators.FisrtNameMinLength).toBe('function')
    })
  })

  describe('appRulesValidation spec', () => {
    const types = {}
    const rulesSet = {
      app2: {
        component1: Utils.rulesCreator(validators, types, [
          {
            name: 'lastName',
            type: 'required',
            stateMap: 'profile.lastName'
          },
          {
            name: 'lastName',
            type: 'minLength',
            stateMap: 'profile.lastName',
            compareWith: 10
          }
        ])
      },
      app1: {
        component1: Utils.rulesCreator(validators, types, [
          {
            name: 'phone',
            type: 'required',
            stateMap: 'profile.phone'
          },
          {
            name: 'phone',
            type: 'minLength',
            stateMap: 'profile.phone',
            compareWith: 10
          }
        ])
      },
      default: {
        component1: Utils.rulesCreator(validators, types, [
          {
            name: 'fisrtName',
            type: 'required',
            stateMap: 'profile.firstName'
          },
          {
            name: 'fisrtName',
            type: 'minLength',
            stateMap: 'profile.firstName',
            compareWith: 10
          },
          {
            name: 'cualquierCosa',
            type: 'required',
            stateMap: 'profile.cualquierCosa'
          }
        ])
      }
    }
    const state = {
      profile: {
        firstName: '12345',
        lastName: '12345',
        phone: '12345'
      }
    }
    it('Validate using set of rules by component', () => {
      let rulesResult = Utils.appRulesValidation(rulesSet, state, 'sarlanga', 'component1')
      expect(rulesResult.valid).toBe(false)
      expect(rulesResult.errors).toEqual([
        types.FISRTNAME_MINLENGTH,
        types.CUALQUIERCOSA_REQUIRED
      ])

      rulesResult = Utils.appRulesValidation(rulesSet, state, 'app1', 'component1')
      expect(rulesResult.valid).toBe(false)
      expect(rulesResult.errors).toEqual([
        types.FISRTNAME_MINLENGTH,
        types.CUALQUIERCOSA_REQUIRED,
        types.PHONE_MINLENGTH
      ])

      state.profile.phone = undefined
      rulesResult = Utils.appRulesValidation(rulesSet, state, 'app1', 'component1')
      expect(rulesResult.valid).toBe(false)
      expect(rulesResult.errors).toEqual([
        types.FISRTNAME_MINLENGTH,
        types.CUALQUIERCOSA_REQUIRED,
        types.PHONE_REQUIRED,
        types.PHONE_MINLENGTH
      ])
    })
  })
})
