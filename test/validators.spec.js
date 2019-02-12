import * as Validators from '../src/validators'

describe('Validators spec', () => {
  it('required', () => {
    let result = Validators.required('firstName', 'firstname-required')({})
    expect(result.valid).toBe(false)
    expect(result.error).toBe('firstname-required')
    result = Validators.required('firstName', 'firstname-required')({ firstName: 'algo' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)
  })

  it('minLength', () => {
    let result = Validators.minLength('firstName', 'firstname-minlength', 10)({ firstName: 'algo' })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('firstname-minlength')
    result = Validators.minLength('firstName', 'firstname-minlength', 10)({ firstName: 'algoalgoalgo' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)
  })

  it('maxLength', () => {
    let result = Validators.maxLength('firstName', 'firstname-maxLength', 10)({ firstName: 'algoalgoalgo' })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('firstname-maxLength')
    result = Validators.maxLength('firstName', 'firstname-maxLength', 10)({ firstName: 'algo' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)
  })

  it('regex', () => {
    const email = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/
    let result = Validators.regex('email', 'email-regex', /\d/)({ email: 'algoalgoalgo' })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('email-regex')

    result = Validators.regex('email', 'email-regex', /\d/)({ email: '1234567890' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)

    result = Validators.regex('email', 'email-valid', email)({ email: 'algo' })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('email-valid')

    result = Validators.regex('email', 'email-valid', email)({ email: 'algo@algo.com' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)
  })

  it('compareFields', () => {
    let result = Validators.compareFields('email', 'email-confirm', 'confirmEmail')({ email: 'algoalgoalgo', confirmEmail: '' })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('email-confirm')

    result = Validators.compareFields('email', 'email-confirm', 'confirmEmail')({ email: 'algoalgoalgo', confirmEmail: 'algoalgoalgo' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)
  })

  it('isEmail', () => {
    let result = Validators.isEmail('email', 'email-valid')({ email: 'algo' })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('email-valid')

    result = Validators.isEmail('email', 'email-valid')({ email: 'algo@algo.com' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)

    result = Validators.isEmail('email', 'email-valid')({ email: 'algo@algo.com.ar' })
    expect(result.valid).toBe(true)
    expect(result.error).toBe(undefined)
  })
})
