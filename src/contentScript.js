'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
import './style.css'
if(window.location.origin === "https://www.rfc-editor.org") {
  document.body.style.fontSize = '1.25em';
  document.body.style.margin = '0 auto';
}

function changesForNewFormat() {
  const {width: tocWidth} = document.getElementById('toc')?.getBoundingClientRect()
  // document.body.style.marginRight = tocWidth+'px';
  document.body.style.paddingRight = 0;
  document.body.style.paddingLeft = 0;
  document.body.style.maxWidth = '120ch';
}

chrome.storage.sync.get(['theme'], (result) => {
  changeTheme(result.theme)
});

function changeTheme(theme) {
  if(theme.toUpperCase() === 'DARK') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
  if(document.body.classList.contains('xml2rfc')) {
    changesForNewFormat()
  }
}

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === 'CHANGE_THEME') {
    changeTheme(request.payload.theme)
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
