<template>
  <div class="c-form-select">
    <select :value="value" :id="selectId" @input="updateValue">
      <option v-for="option in options" :value="option.value" :selected="defaultValue === option.value">{{ option.text }}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: [ 'selectId', 'defaultValue', 'options' ],
  data() {
    return {
      value: this.defaultValue
    };
  },
  methods: {
    updateValue(e) {
      const value = e.target.selectedOptions.length ? e.target.selectedOptions[0]._value : null;
      this.$emit('input', value);
    }
  }
};
</script>
