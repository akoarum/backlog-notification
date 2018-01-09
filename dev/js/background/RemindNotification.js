import moment from 'moment';
import DesktopNotification from './DesktopNotification';
import Request from '../request';

/**
 * リマインダー
 * @param {string} name - バックログスペース名
 * @param {string} tld ~ バックログトップレベルドメイン
 * @param {string} key - バックログAPIキー
 * @param {string|number} seconds - 通知の表示時間
 */
export default class RemindNotification {
  constructor(name, tld, key, seconds) {
    this.name = name;
    this.tld = tld;
    this.key = key;
    this.domain = `https://${ this.name }.backlog.${ this.tld }/`;
    this.today = moment(0, 'HH');
    this.desktopNotification = new DesktopNotification(this.name, this.tld, this.key, seconds);

    this.init();
  }


  /**
   * 初期処理
   */
  init() {
    const getSetting = [
      this.getMyId(),
      this.getRemindTiming(),
      this.getRemindScope()
    ];

    Promise.all(getSetting).then((results) => {
      this.myId = results[0];
      this.timing = results[1];
      this.scope = results[2];

      chrome.alarms.create('BACKLOG_NOTIFICATION_REMIND', {
        when: this.today.clone().add(this.timing, 'hour').unix() * 1000
      });

      chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'BACKLOG_NOTIFICATION_REMIND') {
          this.getTargetIssues();
        }
      });
    });
  }


  /**
   * マイIDの取得
   * @return {promise<number>}
   */
  getMyId() {
    return new Promise((resolve) => {
      Request.getMyId((result) => {
        resolve(result.my_id);
      });
    });
  }


  /**
   * リマインドのタイミングを取得
   * @return {promise<object>}
   */
  getRemindTiming() {
    return new Promise((resolve) => {
      Request.getRemindTiming((result) => {
        resolve(result.remind_timing);
      });
    });
  }


  /**
   * リマインド対象範囲の取得
   * @return {promise<object>}
   */
  getRemindScope() {
    return new Promise((resolve) => {
      Request.getRemindScope((result) => {
        resolve(result.remind_scope);
      });
    });
  }


  /**
   * 課題の取得
   */
  getTargetIssues() {
    const query = {};
    query.dueDateSince = this.today.format('YYYY-MM-DD');
    query.dueDateUntil = this.today.clone().add(this.timing.date, 'days').format('YYYY-MM-DD');

    // 範囲からクエリをセット
    if (this.scope.type === 'projects') {
      query.projectId = this.scope.projects;
    } else {
      query['assigneeId[]'] = this.myId;
    }

    query['statusId'] = [1, 2, 3];

    Request.requestIssues(this.name, this.tld, this.key, query).then((result) => {
      let data = {};

      if (!result.length) {
        return;
      }

      for (let value of result) {
        data = {
          title: (this.timing.date !== 0 ) ? '期限日が近い課題があります！' : '今日が期限日の課題があります！',
          message: `期限日: ${ moment(value.dueDate).format('YYYY年MM月DD日 (ddd)') }`,
          context: `[${ value.issueKey }] ${ value.summary }`,
          url: `${ this.domain }view/${ value.issueKey }`,
          id: value.id
        };
        this.desktopNotification.create(data);
      }
    });
  }
}
