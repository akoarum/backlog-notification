<template>
  <ul class="c-form-checkbox">
    <li class="c-form-checkbox__item" v-for="item in this.$store.state.projects" :key="item.id">
      <label>
        <input type="checkbox" v-model="remindScopeProjects" :value="item.id">
        <span>{{ item.name }}</span>
      </label>
    </li>
  </ul>
</template>

<script>
import * as types from '../store/types';

export default {
  mounted() {
    this.$store.dispatch(types.REQUEST_PROJECTS);
  },
  computed: {
    remindScopeProjects: {
      get() {
        return this.$store.state.remindScope.projects;
      },
      set(value) {
        this.$store.commit(types.UPDATE_REMIND_SCOPE_PROJECTS, value);
      }
    }
  }
}
</script>
