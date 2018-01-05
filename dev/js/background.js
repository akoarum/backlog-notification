import Request from './request';

/**
 * デスクトップ通知
 * @param {string} name - バックログスペース名
 * @param {string} tld - バックログドメイン名
 * @param {string} key - バックログAPIキー
 * @param {string|number} seconds - 通知の表示時間
 */
class DesktopNotification {
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
        Request.sendNotificationRead(this.name, this.tld, this.key, id).then((result) => {
          console.log(result);
        });
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



/**
 * お知らせ通知
 * @param {string} name - バックログスペース名
 * @param {string} tld - バックログドメイン名
 * @param {string} key - バックログAPIキー
 * @param {string|number} seconds - 通知の表示時間
 * @param {number} count - バックログのお知らせの件数
 */
class NewsNotification {
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

    chrome.alarms.create('BACKLOG_NOTIFICATION', {periodInMinutes: 1});
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'BACKLOG_NOTIFICATION') {
        Request.requestCounts(this.name, this.tld, this.key).then((payload) => {
          console.log(payload.count);
          this.notificationCount = payload.count;
        });
      }
    });

    this.notification();
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

chrome.storage.sync.get(['backlog_name', 'backlog_tld', 'backlog_key', 'notification_seconds', 'count'], (value) => {
  const data = value;

  // KEYがなければ終了
  if (!data.backlog_name || !data.backlog_tld || !data.backlog_key) {
    return;
  }

  new NewsNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds, data.count);
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== 'install') {
    return;
  }
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

chrome.notifications.getPermissionLevel((res) => {
  chrome.storage.onChanged.addListener((changes) => {
    if ('count' in changes) {
      return;
    }

    chrome.storage.sync.get(['backlog_name', 'backlog_tld', 'backlog_key', 'notification_seconds', 'count'], (value) => {
      const data = value;

      // KEYがなければ終了
      if (!data.backlog_name || !data.backlog_tld || !data.backlog_key) {
        return;
      }

      new NewsNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds, data.count);
    });
  });
});
