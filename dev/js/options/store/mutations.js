import * as types from './types';

export default {
  /**
   * バックログスペース名の取得
   */
  [types.GET_BACKLOG_NAME](state, payload) {
    state.backlogName = payload;
  },


  /**
   * バックログスペース名のセット
   */
  [types.SET_BACKLOG_NAME](state, payload) {
    state.backlogName = payload;
  },


  /**
   * バックログトップレベルドメインの取得
   */
  [types.GET_BACKLOG_TLD](state, payload) {
    state.backlogTld = payload;
  },


  /**
   * バックログトップレベルドメインのセット
   */
  [types.SET_BACKLOG_TLD](state, payload) {
    state.backlogTld = payload;
  },


  /**
   * バックログAPIキーの取得
   */
  [types.GET_BACKLOG_KEY](state, payload) {
    state.backlogKey = payload;
  },


  /**
   * バックログAPIキーのセット
   */
  [types.SET_BACKLOG_KEY](state, payload) {
    state.backlogKey = payload;
  },


  /**
   * デスクトップ通知の表示時間の取得
   */
  [types.GET_NOTIFICATION_SECONDS](state, payload) {
    state.notificationSeconds = payload;
  },


  /**
   * デスクトップ通知の表示時間のセット
   */
  [types.SET_NOTIFICATION_SECONDS](state, payload) {
    state.notificationSeconds = payload;
  },


  /**
   * リマインダー範囲の取得
   */
  [types.GET_REMIND_SCOPE](state, payload) {
    state.remindScope = payload;
  },


  /**
   * リマインダー範囲のセット
   */
  [types.SET_REMIND_SCOPE](state, payload) {
    state.remindScope = payload;
  },


  /**
   * リマインドタイミングの取得
   */
  [types.GET_REMIND_TIMING](state, payload) {
    state.remindTiming = payload;
  },


  /**
   * リマインドタイミングのセット
   */
  [types.SET_REMIND_TIMING](state, payload) {
    state.remindTiming = payload;
  },


  /**
   * バックログお知らせ件数の取得
   */
  [types.REQUEST_NOTIFICATION_COUNTS](state, payload) {
    state.notificationCounts = payload;
  },


  /**
   * バックログのマイ情報取得
   */
  [types.REQUEST_MYSELF](state, payload) {
    state.myId = payload;
  },


  /**
   * 参加プロジェクトの取得
   */
  [types.REQUEST_PROJECTS](state, payload) {
    state.projects = payload.map((project) => {
      return { id: project.id, name: project.name };
    });
  },


  /**
   * バックログスペース名の更新
   */
  [types.UPDATE_BACKLOG_NAME](state, payload) {
    state.backlogName = payload;
  },


  /**
   * バックログトップレベルドメインの更新
   */
  [types.UPDATE_BACKLOG_TLD](state, payload) {
    state.backlogTld = payload;
  },


  /**
   * バックログAPIキーの更新
   */
  [types.UPDATE_BACKLOG_KEY](state, payload) {
    state.backlogKey = payload;
  },


  /**
   * デスクトップ通知の表示時間の更新
   */
  [types.UPDATE_NOTIFICATION_SECONDS](state, payload) {
    state.notificationSeconds = payload;
  },


  /**
   * リマインダー範囲タイプの更新
   */
  [types.UPDATE_REMIND_SCOPE_TYPE](state, payload) {
    state.remindScope.type = payload;
  },


  /**
   * リマインダー範囲プロジェクトの更新
   */
  [types.UPDATE_REMIND_SCOPE_PROJECTS](state, payload) {
    state.remindScope.projects = payload;
  },


  /**
   * リマインダーのタイミング（日）の更新
   */
  [types.UPDATE_REMIND_TIMING_DATE](state, payload) {
    state.remindTiming.date = payload;
  },


  /**
   * リマインダーのタイミング（時）の更新
   */
  [types.UPDATE_REMIND_TIMING_HOUR](state, payload) {
    state.remindTiming.hour = payload;
  }
};
