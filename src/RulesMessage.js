import { findIndexForActiveError } from './utils'

const RulesMessage = {
  name: 'RulesMessage',
  functional: true,
  props: {
    type: {
      type: String
    },
    selector: {
      type: String
    },
    match: {
      type: Boolean,
      default: false
    },
    parentClassError: {
      type: String,
      default: 'has-error'
    },
    message: {
      type: String
    }
  },
  render (h, { parent, props }) {
    const errorIndex = findIndexForActiveError(parent.rulesErrors, props.type, props.match)
    const isActive = errorIndex >= 0
    const elementToMatch = props.selector || props.type
    if (parent.$el && parent.$el.querySelector) {
      const inputParent = parent.$el.querySelector(`#${elementToMatch}`)
      if (inputParent && isActive) {
        inputParent.classList.add(props.parentClassError)
      } else if (inputParent && !isActive) {
        inputParent.classList.remove(props.parentClassError)
      }
    }
    if (isActive) {
      const propsData = {
        class: 'error',
        attrs: {
          id: `${props.type}-rule-error`
        }
      }
      parent.product = parent.product || 'general'
      const parentName = parent.$options.name || parent.$options._componentTag
      const parentKeyWP = `${parentName}.ruleErrors.${parent.product.toLowerCase()}.${parent.rulesErrors[errorIndex]}`
      const parentKey = `${parentName}.ruleErrors.${parent.rulesErrors[errorIndex]}`
      const keyWP = `ruleErrors.${parent.product.toLowerCase()}.${parent.rulesErrors[errorIndex]}`
      const key = `ruleErrors.${parent.rulesErrors[errorIndex]}`
      const translation = props.message
        ? props.message
        : !parent.$i18n
          ? parentKeyWP
          : parent.$i18n.t(parentKeyWP) !== parentKeyWP
            ? parent.$i18n.t(parentKeyWP)
            : parent.$i18n.t(parentKey) !== parentKey
              ? parent.$i18n.t(parentKey)
              : parent.$i18n.t(keyWP) !== keyWP
                ? parent.$i18n.t(keyWP)
                : parent.$i18n.t(key) !== key
                  ? parent.$i18n.t(key)
                  : parent.$i18n.t(parentKeyWP)
      return h('span', propsData, [
        translation
      ])
    } else {
      return null
    }
  }
}

export const directive = {
  bind (el, binding, vnode) {
    const validateRules = vnode.context.validateRules
    const name = binding.value
    if (!validateRules || !name) {
      return
    }
    vnode.context.$watch(name, (newValue, oldValue) => {
      if (newValue !== oldValue) { validateRules() }
    })
  }
}

RulesMessage.install = function (Vue) {
  Vue.component(RulesMessage.name, RulesMessage)
  Vue.directive('rule-validate', directive)
}

export default RulesMessage
