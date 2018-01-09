export default new class Request {
  constructor() {}


  /**
   * バックログスペース名の取得
   * @param {void} resolve
   */
  getBacklogName(resolve) {
    chrome.storage.sync.get(['backlog_name'], resolve);
  }


  /**
   * バックログスペース名のセット
   * @param {string} name
   * @param {void} resolve
   */
  setBacklogName(name, resolve) {
    chrome.storage.sync.set({ 'backlog_name': name }, resolve(name));
  }


  /**
   * トップレベルドメインの取得
   * @param {void} resolve
   */
  getBacklogTld(resolve) {
    chrome.storage.sync.get(['backlog_tld'], resolve);
  }


  /**
   * トップレベルドメインのセット
   * @param {string} tld
   * @param {void} resolve
   */
  setBacklogTld(tld, resolve) {
    chrome.storage.sync.set({ 'backlog_tld': tld }, resolve(tld));
  }


  /**
   * APIキーの取得
   * @param {void} resolve
   */
  getBacklogKey(resolve) {
    chrome.storage.sync.get(['backlog_key'], resolve);
  }


  /**
   * APIキーのセット
   * @param {string} key
   * @param {void} resolve
   */
  setBacklogKey(key, resolve) {
    chrome.storage.sync.set({ 'backlog_key': key }, resolve(key));
  }


  /**
   * 通知秒数の取得
   * @param {void} resolve
   */
  getNotificationSeconds(resolve) {
    chrome.storage.sync.get(['notification_seconds'], resolve);
  }


  /**
   * 通知秒数のセット
   * @param {number} seconds
   * @param {void} resolve
   */
  setNotificationSeconds(seconds, resolve) {
    chrome.storage.sync.set({ 'notification_seconds': seconds }, resolve(seconds));
  }


  /**
   * Storageからお知らせ件数の取得
   * @param {void} resolve
   */
  getNotificationCounts(resolve) {
    chrome.storage.sync.get(['count'], resolve);
  }


  /**
   * Storageにお知らせ件数のセット
   * @param {number} size
   * @param {void} resolve
   */
  setNotificationCounts(size, resolve) {
    chrome.storage.sync.set({ 'count': size }, resolve(size));
  }


  /**
   * リマインダーの使用有無の取得
   * @param {void} resolve
   */
  getUseReminder(resolve) {
    chrome.storage.sync.get(['use_reminder'], resolve);
  }


  /**
   * リマインダーの使用有無のセット
   * @param {boolean} value
   * @param {void} resolve
   */
  setUseReminder(value, resolve) {
    chrome.storage.sync.set({ 'use_reminder': value }, resolve(value));
  }

  /**
   * リマインド対象範囲の取得
   * @param {void} resolve
   */
  getRemindScope(resolve) {
    chrome.storage.sync.get(['remind_scope'], resolve);
  }


  /**
   * リマインド対象範囲のセット
   * @param {object} data
   * @param {void} resolve
   */
  setRemindScope(data, resolve) {
    chrome.storage.sync.set({ 'remind_scope': data }, resolve(data));
  }


  /**
   * リマインドのタイミング取得
   * @param {void} resolve
   */
  getRemindTiming(resolve) {
    chrome.storage.sync.get(['remind_timing'], resolve);
  }


  /**
   * リマインドのタイミングのセット
   * @param {object} date
   * @param {void} resolve
   */
  setRemindTiming(date, resolve) {
    chrome.storage.sync.set({ 'remind_timing': date }, resolve(date));
  }


  /**
   * 自分のID取得
   * @param {void} resolve
   */
  getMyId(resolve) {
    chrome.storage.sync.get(['my_id'], resolve);
  }


  /**
   * 自分のIDのセット
   * @param {string} id
   * @param {void} resolve
   */
  setMyId(id, resolve) {
    chrome.storage.sync.set({ 'my_id': id }, resolve(id));
  }


  /**
   * バックログAPI: 認証ユーザー情報の取得
   * @param {string} backlogName - バックログスペース名
   * @param {string} backlogTld - バックログのトップレベルドメイン
   * @param {string} backlogKey - バックログのAPIキー
   * @return {Promise<json>}
   */
  requestMyself(backlogName, backlogTld, backlogKey) {
    return new Promise((resolve, reject) => {
      fetch(`https://${ backlogName }.backlog.${ backlogTld }/api/v2/users/myself?apiKey=${ backlogKey }`).then((result) => {
        if (result.status !== 200) {
          reject();
          return;
        }
        resolve(result.json());
      });
    });
  }


  /**
   * バックログAPI: プロジェクト情報の取得
   * @param {string} backlogName - バックログスペース名
   * @param {string} backlogTld - バックログのトップレベルドメイン
   * @param {string} backlogKey - バックログのAPIキー
   * @return {Promise<json>}
   */
  requestProjects(backlogName, backlogTld, backlogKey) {
    return new Promise((resolve) => {
      fetch(`https://${ backlogName }.backlog.${ backlogTld }/api/v2/projects?apiKey=${ backlogKey }`).then((result) => {
        resolve(result.json());
      });
    });
  }


  /**
   * お知らせ件数の取得
   * @param {string} backlogName - バックログスペース名
   * @param {string} backlogTld - バックログのトップレベルドメイン
   * @param {string} backlogKey - バックログのAPIキー
   * @return {Promise<json>}
   */
  requestCounts(backlogName, backlogTld, backlogKey) {
    return new Promise((resolve) => {
      fetch(`https://${ backlogName }.backlog.${ backlogTld }/api/v2/notifications/count?apiKey=${ backlogKey }`).then((result) => {
        resolve(result.json());
      });
    });
  }


  /**
   * 最新のコメントを取得
   * @param {string} backlogName - バックログスペース名
   * @param {string} backlogTld - バックログのトップレベルドメイン
   * @param {string} backlogKey - バックログのAPIキー
   * @return {Promise<json>}
   */
  requestLatestComment(backlogName, backlogTld, backlogKey) {
    return new Promise((resolve) => {
      fetch(`https://${ backlogName }.backlog.${ backlogTld }/api/v2/notifications?apiKey=${ backlogKey }&count=1`).then((result) => {
        resolve(result.json());
      });
    });
  }


  /**
   * お知らせの既読化
   * @param {string} backlogName - バックログスペース名
   * @param {string} backlogTld - バックログのトップレベルドメイン
   * @param {string} backlogKey - バックログのAPIキー
   * @param {string} id - お知らせID
   * @return {Promise<json>}
   */
  sendNotificationRead(backlogName, backlogTld, backlogKey, id) {
    return new Promise((resolve) => {
      fetch(`https://${ backlogName }.backlog.${ backlogTld }/api/v2/notifications/${ id }/markAsRead?apiKey=${ backlogKey }`, { method: 'POST' }).then((result) => {
        resolve(result);
      });
    });
  }


  /**
   * 課題一覧の取得
   * @param {string} backlogName - バックログスペース名
   * @param {string} backlogTld - バックログのトップレベルドメイン
   * @param {string} backlogKey - バックログのAPIキー
   * @param {object} query - クエリ
   * @return {Promise<json>}
   */
  requestIssues(backlogName, backlogTld, backlogKey, query = {}) {
    let url = `https://${ backlogName }.backlog.${ backlogTld }/api/v2/issues?apiKey=${ backlogKey }`;

    if (Object.keys(query).length) {
      for (let param in query) {
        if (Array.isArray(query[param])) {
          for (let value of query[param]) {
            url += `&${ param }[]=${ value }`;
          }
          continue;
        }

        url += `&${ param }=${ query[param] }`;
      }
    }

    return new Promise((resolve) => {
      fetch(url).then((result) => {
        resolve(result.json());
      });
    });
  }
}
