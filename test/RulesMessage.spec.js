import RulesMessage from '../src/RulesMessage'
import { createLocalVue, mount } from '@vue/test-utils'
import mixin from '../src/mixin'
import * as validators from '../src/validators'
import { rulesCreator, appRulesValidation } from '../src/utils'

const errorTypes = {}
const rulesSet = {
  default: {
    'example-form': rulesCreator(validators, errorTypes, [
      {
        name: 'firstName',
        type: 'required',
        stateMap: 'profile.firstName'
      },
      {
        name: 'firstName',
        type: 'minLength',
        stateMap: 'profile.firstName',
        compareWith: 10
      }
    ])
  }
}
const state = {
  profile: {
    firstName: null,
    lastName: null,
    phone: null
  }
}
const localVue = createLocalVue()

const Example = {
  ...mixin,
  name: 'example-form',
  render (h) {
    return (
      <div class='example-form'>
        <input name='firstName' id='firstName' />
        <rules-message type='firstName' match={true}></rules-message>
      </div>
    )
  }
}

describe('RulesMessage spec', () => {
  it('Show first error after validation', async () => {
    const wrapper = mount(Example, {
      localVue,
      propsData: {
        validateRulesWith: () => appRulesValidation(rulesSet, state, undefined, 'example-form')
      },
      stubs: {
        'rules-message': RulesMessage
      }
    })
    expect(wrapper.html()).toBe('<div class="example-form"><input name="firstName" id="firstName"><!----></div>')
    await wrapper.vm.validateRules()
    await localVue.nextTick()
    expect(wrapper.html()).toBe('<div class="example-form"><input name="firstName" id="firstName" class="has-error"><span id="firstName-rule-error" class="error">example-form.ruleErrors.general.firstName-required</span></div>')
  })
})
