/**
 * バックログAPIへのリクエスト
 * @param {string} name - バックログスペースの名前
 * @param {string} tld - バックログスペースのトップレベルドメイン
 * @param {string} key - バックログのAPIキー
 */
class RequestBacklogApi {
  constructor(name, tld, key) {
    this.domain = `https://${name}.backlog.${tld}/`;
    this.url = `${this.domain}api/v2/`;
    this.key = key;
  }


  /**
   * お知らせ件数の取得
   * @return {Promise<json>}
   */
  requestCounts() {
    return new Promise((resolve) => {
      fetch(`${this.url}notifications/count?apiKey=${this.key}`)
        .then((result) => {
          resolve(result.json());
        });
    });
  }


  /**
   * 最新のコメントを取得
   * @return {Promise<json>}
   */
  requestLatestComment() {
    return new Promise((resolve) => {
      fetch(`${this.url}notifications?apiKey=${this.key}&count=1`)
        .then((result) => {
          resolve(result.json());
        });
    });
  }


  /**
   * お知らせの既読化
   * @param {string} id - お知らせID
   */
  sendNotificationRead(id) {
    return new Promise((resolve) => {
      fetch(`${this.url}notifications/${id}/markAsRead?apiKey=${this.key}`, {
        method: 'POST'
      })
        .then((result) => {
          resolve(result);
        })
    });
  }
}




(($, chrome) => {
  /**
   * お知らせを取得して変更があれば通知する
   */
  class BacklogNotification {
    constructor(name, tld, key, seconds, count) {
      this.name = name;
      this.tld = tld;
      this.key = key;
      this.count = count;
      this.seconds = seconds;
      this.domain = `https://${this.name}.backlog.${this.tld}/`;
      this.url = `${this.domain}api/v2/`;
      this.requestBacklog = new RequestBacklogApi(name, tld, key);

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
      chrome.storage.sync.set({'count': value}, () => {});
      this.createNotification();
    }

    /**
     * 初期処理
     */
    init() {
      this.requestBacklog.requestCounts()
        .then((payload) => {
          console.log(payload.count);
          this.notificationCount = payload.count;
        });

      chrome.alarms.create('BACKLOG_NOTIFICATION', {periodInMinutes: 1});
      chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'BACKLOG_NOTIFICATION') {
          this.requestBacklog.requestCounts()
            .then((payload) => {
              console.log(payload.count);
              this.notificationCount = payload.count;
            });
        }
      });
    }


    /**
     * 通知の作成
     */
    createNotification() {
      const id = Math.floor(Math.random() * 9007199254740992) + 1;
      this.requestBacklog.requestLatestComment()
        .then((payload) => {
          const data = {
            title: `[${payload[0].issue.issueKey}] ${payload[0].issue.summary}`,
            message: payload[0].comment.content,
            contextMessage: payload[0].comment.createdUser.name,
            url: `${this.domain}view/${payload[0].issue.issueKey}`
          };

          if (payload[0].comment.content) {
            data.url += `#comment-${payload[0].comment.id}`;
          }

          chrome.notifications.create(`backlogNotification_${this.key}_${id}`, {
            type: 'basic',
            iconUrl: `https://${this.name}.backlog.${this.tld}/favicon.ico`,
            title: data.title,
            message: data.message,
            contextMessage: data.contextMessage,
            priority: 1
          }, (notificationId) => {
            const listener = () => {
              this.requestBacklog.sendNotificationRead(payload[0].id)
                .then((result) => {
                  console.log(result);
                });
              chrome.tabs.create({
                url: data.url
              });
              chrome.notifications.onClicked.removeListener(listener);
              chrome.notifications.clear(notificationId);
            };

            chrome.notifications.onClicked.addListener(listener);
            chrome.notifications.onClosed.addListener(() => {
              chrome.notifications.onClicked.removeListener(listener);
              chrome.notifications.clear(notificationId);
            });
            this.closeNotification(notificationId, listener);
          });
        });
    }

    /**
     * デスクトップ通知の自動クローズ
     */
    closeNotification(notificationId, listener) {
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

  chrome.storage.sync.get(['backlog_name', 'backlog_tld', 'backlog_key', 'notification_seconds', 'count'], (value) => {
    const data = value;

    // KEYがなければ終了
    if (!data.backlog_name || !data.backlog_tld || !data.backlog_key) {
      return;
    }

    new BacklogNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds, data.count);
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

        new BacklogNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds, data.count);
      });
    });
  });
})(window.jQuery, window.chrome);
