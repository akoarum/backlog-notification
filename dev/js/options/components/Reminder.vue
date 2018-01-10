<template>
  <dl class="c-form-group">
    <dt class="c-form-group__term"><label for="remind-scope">リマインドする範囲</label></dt>
    <dd class="c-form-group__def">
      <SelectBox v-model="remindScopeType" selectId="remind-scope" :defaultValue="remindScopeType" :options="scopeType" />
      <ProjectCheckbox v-if="remindScopeType === 'projects'" />
    </dd>
    <dt class="c-form-group__term"><label for="remind-timing">リマインドのタイミング</label></dt>
    <dd class="c-form-group__def">
      <SelectBox v-model="remindTimingDate" selectId="remind-timing" :defaultValue="remindTimingDate" :options="timingDate" />
      <SelectBox v-model="remindTimingHour" :defaultValue="remindTimingHour" :options="timingHour" />
    </dd>
  </dl>
</template>

<script>
import * as types from '../store/types';
import ProjectCheckbox from './ProjectCheckbox.vue';
import FormItem from './FormItem.vue';
import SelectBox from './SelectBox.vue';

export default {
  components: { ProjectCheckbox, FormItem, SelectBox },
  data() {
    return {
      scopeType: [
        { text: '自分が担当の課題', value: 'myself' },
        { text: '参加しているプロジェクトから選ぶ', value: 'projects' }
      ],
      timingDate: [
        { text: '期限日当日', value: 0 },
        { text: '期限日1日前', value: 1 },
        { text: '期限日2日前', value: 2 },
        { text: '期限日3日前', value: 3 }
      ],
      timingHour: [
        { text: '08:00', value: 8 },
        { text: '09:00', value: 9 },
        { text: '10:00', value: 10 },
        { text: '11:00', value: 11 },
        { text: '12:00', value: 12 },
        { text: '13:00', value: 13 },
        { text: '14:00', value: 14 },
        { text: '15:00', value: 15 },
        { text: '16:00', value: 16 },
        { text: '17:00', value: 17 },
        { text: '18:00', value: 18 },
        { text: '19:00', value: 19 },
        { text: '20:00', value: 20 },
        { text: '21:00', value: 21 },
        { text: '22:00', value: 22 }
      ]
    }
  },
  computed: {
    remindScopeType: {
      get() {
        return this.$store.state.remindScope.type;
      },
      set(value) {
        this.$store.commit(types.UPDATE_REMIND_SCOPE_TYPE, value);

        if (value === 'myself') {
          this.hasError = false;
        }
      }
    },
    remindTimingDate: {
      get() {
        return this.$store.state.remindTiming.date;
      },
      set(value) {
        this.$store.commit(types.UPDATE_REMIND_TIMING_DATE, value);
      }
    },
    remindTimingHour: {
      get() {
        return this.$store.state.remindTiming.hour;
      },
      set(value) {
        this.$store.commit(types.UPDATE_REMIND_TIMING_HOUR, value);
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
};
</script>
