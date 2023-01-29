'use strict';

import './popup.css';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const THEME = { DARK: 'dark', LIGHT: 'light' };
  const DEFAULT_THEME = THEME.DARK;

  const themeStorage = {
    get: (cb) => {
      chrome.storage.sync.get(['theme'], (result) => {
        cb(result?.theme);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          theme: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  const toggleThemeButton = document.getElementById('toggle-theme');
  function setupTheme(initialValue = DEFAULT_THEME) {
    toggleThemeButton.checked = initialValue.toLowerCase() === THEME.DARK
    changeTheme({
      theme: initialValue,
    });
    toggleThemeButton.addEventListener('click', () => {
      changeTheme({
        theme: toggleThemeButton.checked ? THEME.DARK: THEME.LIGHT,
      });
    });
  }

  function changeTheme({ theme }) {
    themeStorage.set(theme, () => {
      // Communicate with content script of
      // active tab by sending a message
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        chrome.tabs.sendMessage(
          tab.id,
          {
            type: 'CHANGE_THEME',
            payload: {
              theme
            },
          }
        );
      });
    });
  }

  function restoreCounter() {
    // Restore count value
    themeStorage.get((theme) => {
      if (typeof theme === 'undefined') {
        // Set counter value as 0
        themeStorage.set(THEME.DARK, () => {
          setupTheme(THEME.DARK);
        });
      } else {
        setupTheme(theme);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);
})();
