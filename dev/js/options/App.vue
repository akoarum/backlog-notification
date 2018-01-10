<template>
  <div class="l-container">
    <PageHeader />
    <main class="l-main" role="main">
      <BaseSetting />
    </main>
    <PageFooter />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as types from './store/types';
import PageHeader from './components/PageHeader.vue';
import PageFooter from './components/PageFooter.vue';
import BaseSetting from './components/BaseSetting.vue';

export default {
  components: { PageHeader, PageFooter, BaseSetting },
  created() {
    this.$store.dispatch(types.GET_BACKLOG_NAME);
    this.$store.dispatch(types.GET_BACKLOG_TLD);
    this.$store.dispatch(types.GET_BACKLOG_KEY);
    this.$store.dispatch(types.GET_NOTIFICATION_SECONDS);
    this.$store.dispatch(types.GET_USE_REMINDER);
    this.$store.dispatch(types.GET_REMIND_SCOPE);
    this.$store.dispatch(types.GET_REMIND_TIMING);
  }
};
</script>
