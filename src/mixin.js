import { isErrorActive } from './utils'
const validResponse = { valid: true, error: undefined }

export default {
  data () {
    return {
      rulesDirty: false,
      rulesErrors: []
    }
  },
  props: {
    validateRulesWith: {
      type: Function
    },
    onError: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  computed: {
    rulesValid () {
      return this.rulesErrors.length <= 0
    }
  },
  methods: {
    async validateRules (product = this.appName, setRulesDirty = true) {
      if (!this.validateRulesWith && !this.appRulesValidationWrapper) {
        return validResponse
      }
      if (setRulesDirty) {
        this.rulesDirty = setRulesDirty
      }
      if (!this.rulesDirty) {
        return validResponse
      }
      const validationFunction = this.validateRulesWith || this.appRulesValidationWrapper(this.$store.state, this.$options.name)
      const rulesErrors = await validationFunction(product)
      this.rulesErrors = this.componentPosibleErrors
        ? rulesErrors.errors.filter(error => this.componentPosibleErrors[error])
        : rulesErrors.errors
      if (this.rulesErrors.length > 0) {
        return this.onError(this.rulesErrors)
      }
    },
    hasRulesErrorsFor (types, match = false) {
      return isErrorActive(this.rulesErrors, types, match)
    }
  }
}
