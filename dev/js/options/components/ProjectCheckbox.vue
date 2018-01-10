<template>
  <div>
    <ul class="c-form-checkbox">
      <li class="c-form-checkbox__item" v-for="item in this.$store.state.projects" :key="item.id">
        <label>
          <input type="checkbox" v-model="remindScopeProjects" :value="item.id">
          <span>{{ item.name }}</span>
        </label>
      </li>
    </ul>
    <ErrorMessage v-if="isError">プロジェクトを取得できませんでした。バックログスペース名、ドメイン、APIキーを再度ご確認ください。</ErrorMessage>
  </div>
</template>

<script>
import * as types from '../store/types';
import ErrorMessage from './ErrorMessage.vue';

export default {
  components: { ErrorMessage },
  data() {
    return {
      isError: false
    }
  },
  mounted() {
    this.$store.dispatch(types.REQUEST_PROJECTS).then(() => {
      this.isError = false;
      this.hasError = false;
    }).catch(() => {
      this.isError = true;
      this.hasError = true;
    });
  },
  computed: {
    remindScopeProjects: {
      get() {
        return this.$store.state.remindScope.projects;
      },
      set(value) {
        this.$store.commit(types.UPDATE_REMIND_SCOPE_PROJECTS, value);
      }
    },
    hasError: {
      get() {
        return this.$store.state.hasError;
      },
      set(value) {
        this.$store.commit(types.UPDATE_HAS_ERROR, value);
      }
    }
  }
}
</script>
