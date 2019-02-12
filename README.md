# Rules validator

This librery tries to set a central location to create validation for state variables, separeted by component outside of the component

## How to create validation Rules

We need to create a rules set by app and by component, this set of rules are functions should return a ValidationObj

```typescript
interface ValidationObj {
  valid: boolean;
  error?: string;
}
```

```js
const RULES = {
  default: {
    componentName: {
      validateFirstNameRequired (state) {
        return {
          valid: !!state.profile.firstName,
          error: !state.profile.firstName ? 'ERROR-TYPE' : undefined
        }
      } 
    }
  }
}
```

there are some utils to do this in a easy way

```js
import { rulesCreator } from 'rules-validator/lib/utils'
import * as Validators from 'rules-validator/lib/validators'

// Validators can be extend with whatever we want
const componentNameErrors = {} // this will be loadead with all the posible errors created by the rulesCreator function
const createRules = rulesCreator.bind(null, Validators)
const RULES = {
  default: {
    componentName: createRules(componentNameErrors, [
      {
        name: 'firstName', // name of the rule
        type: 'required', // type of the validator. Read the validators to know the available ones
        stateMap: 'profile.firstName' // route in the state where the field to validate is
      },
      {
        name: 'lastName',
        type: 'required',
        stateMap: 'profile.lastName' 
      }
      // you can add all the rules need it here
    ])
  }
}
```

### How to use it

Install the `rules-message` component in order to used in any form for validation
```js
import Vue from 'vue'
import { RulesMessage } from 'rules-validator'

Vue.use(RulesMessage)
```

Integrate in any form the validation

```js
import RulesMixin from 'rules-validator/lib/mixin'
import { appRulesValidation } from 'rules-validator/lib/utils'

const FormComponent = {
  name: 'form-component',
  mixins: [RulesMixin],
  template: `
  <form class="profile-form" @submit.prevent="save">
    <div class="profile-form__row">
      <div class="profile-form__field input-group">
        <label for="firstName">
          {{ $t('profile-form.firstName') }}
        </label>
        <input
          v-model="user.firstName"
          name="firstName"
          id="firstName"
          type="text"
          required
        />
        <rules-message type="firstName" :match="true" />
      </div>
      <div class="profile-form__field input-group" >
        <label for="lastName">
          {{ $t('profile-form.lastName') }}
        </label>
        <input
          v-model="user.lastName"
          type="text"
          name="lastName"
          id="lastName"
          required
        />
        <rules-message type="lastName" :match="true" />
      </div>
    </div>
  </form>
  `,
  methods () {
    appRulesValidation () {
      return appRulesValidation(RULES, this.$store.state, applicationName, this.$options.name)
    },
    submit () {
      await this.validateRules()
      if (this.rulesValid) {
        // do something your form is valid
      }

      // if not... the form will render the errors
    }
  }
}
```

## Validators

the function has this form:

```js
const aValidatorFunction = 
  (path, errorType, compareWith, defaultValue = '') => 
  (state) => { valid: Boolean, error: String }
```