<template>
  <section class="c-sec">
    <h2 class="c-sec__title">設定</h2>
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
            <SelectBox v-model="notificationSeconds" selectId="auto-close" :defaultValue="notificationSeconds" :options="notificationOptions" />
          </FormItem>
          <FormItem itemId="use-reminder" label="リマインダーの使用">
            <label class="c-form-switch"><input type="checkbox" v-model="useReminder"><span>リマインダーを使用する</span></label>
            <transition name="reminder">
              <Reminder v-if="useReminder" />
            </transition>
          </FormItem>
        </tbody>
      </table>
      <CorrectMessage v-if="completed">共通設定を登録しました。</CorrectMessage>
      <ErrorMessage v-if="isError">エラーが発生しました。入力内容を再度ご確認ください。</ErrorMessage>
      <div class="c-btn-container"><button type="button" class="c-btn" @click="submitSetting" :disabled="submitDisabled">設定を登録する</button></div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import * as types from '../store/types';
import CorrectMessage from './CorrectMessage.vue';
import ErrorMessage from './ErrorMessage.vue';
import FormItem from './FormItem.vue';
import SelectBox from './SelectBox.vue';
import Reminder from './Reminder.vue';

export default {
  components: { CorrectMessage, ErrorMessage, FormItem, SelectBox, Reminder },
  data() {
    return {
      isError: false,
      completed: false,
      notificationOptions: [
        { text: '閉じない', value: 'not' },
        { text: '5秒', value: 5 },
        { text: '6秒', value: 6 },
        { text: '7秒', value: 7 },
        { text: '8秒', value: 8 },
        { text: '9秒', value: 9 },
        { text: '10秒', value: 10 }
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
        return this.$store.state.notificationSeconds || 'not';
      },
      set(value) {
        this.$store.commit(types.UPDATE_NOTIFICATION_SECONDS, value);
      }
    },
    useReminder: {
      get() {
        return this.$store.state.useReminder;
      },
      set(value) {
        this.$store.commit(types.UPDATE_USE_REMINDER, value);
      }
    },
    hasError: {
      get() {
        return this.$store.state.hasError;
      },
      set(value) {
        this.$store.commit(types.UPDATE_HAS_ERROR, value);
      }
    },
    submitDisabled() {
      return !(this.backlogName && this.backlogTld && this.backlogKey && !this.hasError);
    }
  },
  methods: {
    submitSetting() {
      const submit = [
        this.$store.dispatch(types.SET_BACKLOG_NAME, this.$store.state.backlogName),
        this.$store.dispatch(types.SET_BACKLOG_TLD, this.$store.state.backlogTld),
        this.$store.dispatch(types.SET_BACKLOG_KEY, this.$store.state.backlogKey),
        this.$store.dispatch(types.SET_NOTIFICATION_SECONDS, this.$store.state.notificationSeconds),
        this.$store.dispatch(types.SET_USE_REMINDER, this.$store.state.useReminder)
      ];

      if (this.useReminder) {
        submit.push(this.$store.dispatch(types.SET_REMIND_SCOPE, this.$store.state.remindScope));
        submit.push(this.$store.dispatch(types.SET_REMIND_TIMING, this.$store.state.remindTiming));
      }

      Promise.all(submit).then(() => {
        const init = [
          this.$store.dispatch(types.REQUEST_NOTIFICATION_COUNTS),
          this.$store.dispatch(types.REQUEST_MYSELF)
        ];

        Promise.all(init).then(() => {
          this.completed = true;
          this.isError = false;
          this.$store.dispatch(types.SET_MYSELF, this.$store.state.myId);
        }).catch(() => {
          this.completed = false;
          this.isError = true;
        });
      });
    }
  }
};
</script>
