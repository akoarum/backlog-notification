import Request from '../request';
import DesktopNotification from './DesktopNotification';
import NewsNotification from './NewsNotification';
import RemindNotification from './RemindNotification';

let news, remind;

chrome.storage.sync.get(['backlog_name', 'backlog_tld', 'backlog_key', 'notification_seconds', 'count', 'use_reminder'], (value) => {
  const data = value;

  // KEYがなければ終了
  if (!data.backlog_name || !data.backlog_tld || !data.backlog_key) {
    return;
  }

  news = new NewsNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds, data.count);
  if (data.use_reminder) {
    remind = new RemindNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds);
  }
});


// インストール時のイベントリスナの指定
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


// オプションがアップデートされた場合に再度実行する
chrome.notifications.getPermissionLevel((res) => {
  chrome.storage.onChanged.addListener((changes) => {
    if ('count' in changes) {
      return;
    }

    chrome.storage.sync.get(['backlog_name', 'backlog_tld', 'backlog_key', 'notification_seconds', 'count', 'use_reminder'], (value) => {
      const data = value;

      // KEYがなければ終了
      if (!data.backlog_name || !data.backlog_tld || !data.backlog_key) {
        return;
      }

      if (!news) {
        news = new NewsNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds, data.count);
      }

      if (!remind && data.use_reminder) {
        remind = new RemindNotification(data.backlog_name, data.backlog_tld, data.backlog_key, data.notification_seconds);
      }
    });
  });
});
