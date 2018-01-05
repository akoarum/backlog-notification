<template>
  <section class="c-sec">
    <h2 class="c-sec__title">共通設定</h2>
    <div class="c-sec__content">
      <table class="c-form-tbl">
        <tbody>
          <FormItem itemId="backlog-name" label="バックログスペース名">
            <input type="text" v-model="backlogName" id="backlog-name" class="c-form-text" />
          </FormItem>
          <FormItem itemId="backlog-tld" label="トップレベルドメイン">
            <input type="text" v-model="backlogTld" id="backlog-tld" class="c-form-text" />
          </FormItem>
          <FormItem itemId="backlog-api" label="APIキー">
            <input type="text" v-model="backlogKey" id="backlog-api" class="c-form-text" />
          </FormItem>
          <FormItem itemId="auto-close" label="通知の表示時間">
            <SelectBox v-model="notificationSeconds" selectId="auto_close" :defaultValue="notificationSeconds" :options="notificationOptions" />
          </FormItem>
        </tbody>
      </table>
      <CorrectMessage v-if="completed">共通設定を登録しました。</CorrectMessage>
      <div class="c-btn-container"><button type="button" class="c-btn" @click="submitSetting" :disabled="submitDisabled">共通設定を登録する</button></div>
    </div>
  </section>
</template>

<script>
import * as types from '../store/types';
import CorrectMessage from './CorrectMessage.vue';
import FormItem from './FormItem.vue';
import SelectBox from './SelectBox.vue';

export default {
  components: { CorrectMessage, FormItem, SelectBox },
  data() {
    return {
      completed: false,
      notificationOptions: [
        { text: '閉じない', value: 'not' },
        { text: '5秒', value: 5 },
        { text: '6秒', value: 6 },
        { text: '7秒', value: 7 },
        { text: '8秒', value: 8 },
        { text: '9秒', value: 9 },
        { text: '10秒', value: 10 },
      ]
    };
  },
  computed: {
    backlogName: {
      get() {
        return this.$store.state.backlogName;
      },
      set(value) {
        this.$store.commit(types.UPDATE_BACKLOG_NAME, value);
      }
    },
    backlogTld: {
      get() {
        return this.$store.state.backlogTld;
      },
      set(value) {
        this.$store.commit(types.UPDATE_BACKLOG_TLD, value);
      }
    },
    backlogKey: {
      get() {
        return this.$store.state.backlogKey;
      },
      set(value) {
        this.$store.commit(types.UPDATE_BACKLOG_KEY, value);
      }
    },
    notificationSeconds: {
      get() {
        return this.$store.state.notificationSeconds;
      },
      set(value) {
        this.$store.commit(types.UPDATE_NOTIFICATION_SECONDS, value);
      }
    },
    submitDisabled() {
      return !(this.$store.state.backlogName && this.$store.state.backlogTld && this.$store.state.backlogKey);
    }
  },
  methods: {
    submitSetting() {
      const submit = [
        this.$store.dispatch(types.SET_BACKLOG_NAME, this.$store.state.backlogName),
        this.$store.dispatch(types.SET_BACKLOG_TLD, this.$store.state.backlogTld),
        this.$store.dispatch(types.SET_BACKLOG_KEY, this.$store.state.backlogKey),
        this.$store.dispatch(types.SET_NOTIFICATION_SECONDS, this.$store.state.notificationSeconds)
      ];

      Promise.all(submit).then(() => {
        const init = [
          this.$store.dispatch(types.REQUEST_NOTIFICATION_COUNTS),
          this.$store.dispatch(types.REQUEST_MYSELF)
        ];

        Promise.all(init).then(() => {
          this.completed = true;
          this.$store.dispatch(types.SET_MYSELF, this.$store.state.myId);
        });
      });
    }
  }
};
</script>
