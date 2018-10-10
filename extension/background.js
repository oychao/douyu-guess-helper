chrome.runtime.onInstalled.addListener(function() {
  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create(
      {
        focused: true,
        height: 1000,
        type: 'popup',
        url: './extension/index.html',
        width: 1400
      },
      function(win) {
        chrome.windows.update(win.id, { focused: true });
      }
    );
  });
});

chrome.runtime.onMessage.addListener(function(
  { key, type, payload },
  sender,
  sendResponse
) {
  let curMatch;
  if (type === 'new') {
    if (!localStorage[key]) {
      payload.data = [payload.data];
      localStorage[key] = JSON.stringify(payload);
    }
  } else if (type === 'data') {
    if (!localStorage[key]) {
      payload.data = [payload.data];
      localStorage[key] = JSON.stringify(payload);
    } else {
      curMatch = JSON.parse(localStorage[key]);
      curMatch.data.push(payload.data);
      localStorage[key] = JSON.stringify(curMatch);
    }
  } else {
    try {
      curMatch = JSON.parse(localStorage[key]);
      curMatch.winner = payload.result;
      localStorage[key] = JSON.stringify(curMatch);
    } catch (error) {}
  }
});
