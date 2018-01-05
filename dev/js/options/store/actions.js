import Request from '../../request';
import * as types from './types';

export default {
  /**
   * バックログスペース名の取得
   */
  [types.GET_BACKLOG_NAME](context) {
    return Request.getBacklogName((value) => {
      this.commit(types.GET_BACKLOG_NAME, value.backlog_name);
    });
  },


  /**
   * バックログスペース名のセット
   */
  [types.SET_BACKLOG_NAME](context, value) {
    return Request.setBacklogName(value, (result) => {
      this.commit(types.SET_BACKLOG_NAME, result);
    });
  },


  /**
   * バックログトップレベルドメインの取得
   */
  [types.GET_BACKLOG_TLD](context) {
    return Request.getBacklogTld((value) => {
      this.commit(types.GET_BACKLOG_TLD, value.backlog_tld);
    });
  },


  /**
   * バックログトップレベルドメインのセット
   */
  [types.SET_BACKLOG_TLD](context, value) {
    return Request.setBacklogTld(value, (result) => {
      this.commit(types.SET_BACKLOG_TLD, result);
    });
  },


  /**
   * バックログAPIキーの取得
   */
  [types.GET_BACKLOG_KEY](context) {
    return Request.getBacklogKey((value) => {
      this.commit(types.GET_BACKLOG_KEY, value.backlog_key);
    });
  },


  /**
   * バックログAPIキーのセット
   */
  [types.SET_BACKLOG_KEY](context, value) {
    return Request.setBacklogKey(value, (result) => {
      this.commit(types.SET_BACKLOG_KEY, result);
    });
  },


  /**
   * デスクトップ通知の表示時間の取得
   */
  [types.GET_NOTIFICATION_SECONDS](context) {
    return Request.getNotificationSeconds((value) => {
      this.commit(types.GET_NOTIFICATION_SECONDS, value.notification_seconds);
    });
  },


  /**
   * デスクトップ通知の表示時間のセット
   */
  [types.SET_NOTIFICATION_SECONDS](context, value) {
    return Request.setNotificationSeconds(value, (result) => {
      this.commit(types.SET_NOTIFICATION_SECONDS, result);
    });
  },


  /**
   * リマインダー範囲の取得
   */
  [types.GET_REMIND_SCOPE](context) {
    return Request.getRemindScope((result) => {
      this.commit(types.GET_REMIND_SCOPE, result.remind_scope || { type: 'myself', projects: [] });
    });
  },


  /**
   * リマインダー範囲のセット
   */
  [types.SET_REMIND_SCOPE](context, value) {
    return Request.setRemindScope(value, (result) => {
      this.commit(types.SET_REMIND_SCOPE, result);
    });
  },


  /**
   * リマインドタイミングの取得
   */
  [types.GET_REMIND_TIMING](context) {
    return Request.getRemindTiming((result) => {
      this.commit(types.GET_REMIND_TIMING, result.remind_timing || { date: 0, hour: 9 });
    });
  },


  /**
   * リマインドタイミングのセット
   */
  [types.SET_REMIND_TIMING](context, value) {
    return Request.setRemindTiming(value, (result) => {
      this.commit(types.SET_REMIND_TIMING, result);
    });
  },


  /**
   * バックログお知らせ件数の取得
   */
  [types.REQUEST_NOTIFICATION_COUNTS](context) {
    return Request.requestCounts(this.state.backlogName, this.state.backlogTld, this.state.backlogKey).then((result) => {
      this.commit(types.REQUEST_NOTIFICATION_COUNTS, result.count);
    });
  },


  /**
   * バックログのマイ情報取得
   */
  [types.REQUEST_MYSELF](context) {
    return Request.requestMyself(this.state.backlogName, this.state.backlogTld, this.state.backlogKey).then((result) => {
      this.commit(types.REQUEST_MYSELF, result.id);
    });
  },


  /**
   * 参加プロジェクトの取得
   */
  [types.REQUEST_PROJECTS](context) {
    if (!this.state.backlogName || !this.state.backlogTld || !this.state.backlogKey) {
      return;
    }
    return Request.requestProjects(this.state.backlogName, this.state.backlogTld, this.state.backlogKey).then((result) => {
      this.commit(types.REQUEST_PROJECTS, result);
    });
  }
};
