import Request from '../request';

/**
 * デスクトップ通知
 * @param {string} name - バックログスペース名
 * @param {string} tld - バックログドメイン名
 * @param {string} key - バックログAPIキー
 * @param {string|number} seconds - 通知の表示時間
 */
export default class DesktopNotification {
  constructor(name, tld, key, seconds) {
    this.name = name;
    this.tld = tld;
    this.key = key;
    this.seconds = seconds;
  }


  /**
   * 通知の作成
   * @param {object} - title, message, context, url, id を包含するオブジェクト
   */
  create({ title, message, context, url, id }) {
    const originalId = Math.floor(Math.random() * 9007199254740992) + 1;

    chrome.notifications.create(`backlogNotification_${ this.key }_${ originalId }`, {
      type: 'basic',
      iconUrl: `https://${ this.name }.backlog.${ this.tld }/favicon.ico`,
      title: title,
      message: message,
      contextMessage: context,
      priority: 1
    }, (notificationId) => {
      const listener = () => {
        Request.sendNotificationRead(this.name, this.tld, this.key, id).then((result) => {});
        chrome.tabs.create({
          url: url
        });
        chrome.notifications.onClicked.removeListener(listener);
        chrome.notifications.clear(notificationId);
      };

      chrome.notifications.onClicked.addListener(listener);
      chrome.notifications.onClosed.addListener(() => {
        chrome.notifications.onClicked.removeListener(listener);
        chrome.notifications.clear(notificationId);
      });
      this.close(notificationId, listener);
    });
  }


  /**
   * デスクトップ通知の自動クローズ
   * @param {string} notificationId - 通知を発行した際にセットされる通知ID
   * @param {void} listener - 通知に設定されたリスナー関数
   */
  close(notificationId, listener) {
    if (this.seconds === 'not') {
      return;
    }
    chrome.alarms.create('autoClose', {
      when: Date.now() + (Number(this.seconds) * 1000)
    })
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm && alarm.name === 'autoClose') {
        chrome.notifications.onClicked.removeListener(listener);
        chrome.notifications.clear(notificationId);
      }
    });
  }
}
