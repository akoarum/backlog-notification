import Request from '../request';
import DesktopNotification from './DesktopNotification';

/**
 * お知らせ通知
 * @param {string} name - バックログスペース名
 * @param {string} tld - バックログドメイン名
 * @param {string} key - バックログAPIキー
 * @param {string|number} seconds - 通知の表示時間
 * @param {number} count - バックログのお知らせの件数
 */
export default class NewsNotification {
  constructor(name, tld, key, seconds, count) {
    this.name = name;
    this.tld = tld;
    this.key = key;
    this.count = count;
    this.domain = `https://${ this.name }.backlog.${ this.tld }/`;
    this.desktopNotification = new DesktopNotification(this.name, this.tld, this.key, seconds);

    this.init();
  }

  get notificationCount() {
    return this.count;
  }
  set notificationCount(value) {
    if (this.count === value) {
      return;
    }
    this.count = value;
    chrome.storage.sync.set({ 'count': value }, () => {});
    this.notification();
  }


  /**
   * 初期処理
   */
  init() {
    Request.requestCounts(this.name, this.tld, this.key).then((payload) => {
      this.notificationCount = payload.count;
    });

    chrome.alarms.create('BACKLOG_NOTIFICATION_NEWS', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'BACKLOG_NOTIFICATION_NEWS') {
        Request.requestCounts(this.name, this.tld, this.key).then((payload) => {
          console.log(payload.count);
          this.notificationCount = payload.count;
        });
      }
    });
  }


  /**
   * 通知の作成
   */
  notification() {
    Request.requestLatestComment(this.name, this.tld, this.key).then((payload) => {
      const data = {
        title: `[${payload[0].issue.issueKey}] ${payload[0].issue.summary}`,
        message: payload[0].comment.content,
        context: payload[0].comment.createdUser.name,
        url: `${this.domain}view/${payload[0].issue.issueKey}`,
        id: payload[0].id
      };

      if (payload[0].comment.content) {
        data.url += `#comment-${payload[0].comment.id}`;
      }

      this.desktopNotification.create(data);
    });
  }
}
