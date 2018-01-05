import Request from '../request';
import DesktopNotification from './DesktopNotification';
import NewsNotification from './NewsNotification';

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
