export const Heuristics_1 = {
  clientElementsHeuristics: {
    descriptionExpandButton: {
      querySelector: '#expand[role="button"]',
    },
    video: {
      querySelector: '.html5-main-video',
    },
    videoChapterTitle: {
      querySelector: '.ytp-chapter-container:not([style*="none"])',
    },
    videoTitle: {
      querySelector: '#title h1',
    },
    videoSettingsButton: {
      querySelector: '#movie_player .ytp-settings-button',
    },
    videoWrapper: {
      querySelector: '.html5-video-player',
    },
  },
  collections: {
    chapters: {
      item: {
        querySelector:
          'ytd-macro-markers-list-item-renderer.ytd-macro-markers-list-renderer',
      },
      itemLabel: {
        querySelector: 'h4',
      },
      itemSelected: {
        querySelector: '[active]',
      },
      itemTimestamp: {
        querySelector: '#time',
      },
    },
    language: {
      beforeCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $eq: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: '0',
              },
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-menuitem-label',
                match: {
                  textContent: {
                    $regexp: ['audio track', 'i'],
                  },
                },
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
          ],
        },
      ],
      item: {
        querySelector:
          '#movie_player .ytp-settings-menu .ytp-menuitem[role="menuitemradio"]',
      },
      itemLabel: {
        querySelector: '.ytp-menuitem-label',
      },
      itemSelected: {
        querySelector: '[aria-checked="true"]',
      },
      itemValue: {
        querySelector: '.ytp-menuitem-content',
      },
      afterCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $ne: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: 'unset',
              },
            },
          ],
        },
      ],
    },
    playbackSpeed: {
      beforeCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $eq: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: '0',
              },
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-menuitem-label',
                match: {
                  textContent: {
                    $regexp: ['playback speed', 'i'],
                  },
                },
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
          ],
        },
      ],
      item: {
        querySelector:
          '#movie_player .ytp-settings-menu .ytp-menuitem[role="menuitemradio"]',
      },
      itemLabel: {
        querySelector: '.ytp-menuitem-label',
      },
      itemSelected: {
        querySelector: '[aria-checked="true"]',
      },
      itemValue: {
        querySelector: '.ytp-menuitem-content',
      },
      afterCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $ne: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: 'unset',
              },
            },
          ],
        },
      ],
    },
    quality: {
      beforeCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $eq: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: '0',
              },
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-menuitem-label',
                match: {
                  textContent: {
                    $regexp: ['quality', 'i'],
                  },
                },
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
          ],
        },
      ],
      item: {
        querySelector:
          '#movie_player .ytp-settings-menu .ytp-menuitem[role="menuitemradio"]',
      },
      itemLabel: {
        querySelector: '.ytp-menuitem-label',
      },
      itemSelected: {
        querySelector: '[aria-checked="true"]',
      },
      itemValue: {
        querySelector: '.ytp-menuitem-content',
      },
      afterCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $ne: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: 'unset',
              },
            },
          ],
        },
      ],
    },
    subtitles: {
      beforeCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $eq: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: '0',
              },
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-menuitem-label',
                match: {
                  textContent: {
                    $regexp: ['subtitles', 'i'],
                  },
                },
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
          ],
        },
      ],
      item: {
        querySelector:
          '#movie_player .ytp-settings-menu .ytp-menuitem[role="menuitemradio"]',
      },
      itemLabel: {
        querySelector: '.ytp-menuitem-label',
      },
      itemSelected: {
        querySelector: '[aria-checked="true"]',
      },
      itemValue: {
        querySelector: '.ytp-menuitem-content',
      },
      afterCommands: [
        {
          type: 'if',
          property: {
            querySelector: '#movie_player .ytp-settings-menu',
            match: {
              'style.display': {
                $ne: 'none',
              },
            },
            exists: true,
          },
          then: [
            {
              type: 'emulate-click',
              element: {
                querySelector: '#movie_player .ytp-settings-button',
              },
            },
            {
              type: 'wait',
              duration: 100,
            },
            {
              type: 'style',
              element: {
                querySelector: '#movie_player .ytp-settings-menu',
              },
              style: {
                opacity: 'unset',
              },
            },
          ],
        },
      ],
    },
  },
  events: {
    enableClientControls: [
      {
        type: 'style-many',
        element: {
          querySelector:
            '.ytp-gradient-bottom, .ytp-tooltip, .ytp-chrome-bottom, .ytp-gradient-top, .ytp-chrome-top',
        },
        style: {
          opacity: 'unset',
        },
      },
    ],
    enableExtension: [
      {
        type: 'dispatch-event',
        event: 'disableClientControls',
      },
      {
        type: 'style',
        element: {
          extensionElement: 'videoOverlay',
        },
        style: {
          position: 'absolute',
          display: 'block',
          inset: '0',
          'z-index': '1000',
        },
      },
    ],
    enableSubtitles: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '.ytp-subtitles-button',
        },
      },
    ],
    enableTheater: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '.ytp-size-button',
        },
      },
    ],
    enterFullscreen: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '.ytp-fullscreen-button',
        },
      },
    ],
    exitFullscreen: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '.ytp-fullscreen-button',
        },
      },
    ],
    disableClientControls: [
      {
        type: 'event-stop-propagation',
        element: {
          querySelector: '.html5-video-player',
        },
        events: ['pointerup', 'touchstart'],
      },
      {
        type: 'style-many',
        element: {
          querySelector:
            '.ytp-gradient-bottom, .ytp-tooltip, .ytp-chrome-bottom, .ytp-gradient-top, .ytp-chrome-top',
        },
        style: {
          opacity: '0',
        },
      },
      {
        type: 'style',
        element: {
          querySelector: '.ytp-chrome-bottom',
        },
        style: {
          opacity: '0',
        },
      },
    ],
    disableExtension: [
      {
        type: 'dispatch-event',
        event: 'enableClientControls',
      },
      {
        type: 'style',
        element: {
          extensionElement: 'videoOverlay',
        },
        style: {
          display: 'none',
        },
      },
      {
        type: 'style',
        element: {
          querySelector: '.ytp-chrome-top',
        },
        style: {
          'margin-inline-start': 'unset',
        },
      },
    ],
    disableSubtitles: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '.ytp-subtitles-button',
        },
      },
    ],
    disableTheater: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '.ytp-size-button',
        },
      },
    ],
    domUpdate: [
      {
        type: 'if',
        condition: {
          $and: [
            {
              extensionMinimized: false,
            },
            {
              'videoElement.clientWidth': {
                $gte: 500,
              },
            },
          ],
        },
        then: [
          {
            type: 'dispatch-event',
            event: 'enableExtension',
          },
        ],
      },
      {
        type: 'if',
        condition: {
          $and: [
            {
              extensionMinimized: true,
            },
            {
              'videoElement.clientWidth': {
                $gte: 500,
              },
            },
          ],
        },
        then: [
          {
            type: 'dispatch-event',
            event: 'minimizeExtension',
          },
        ],
      },
      {
        type: 'if',
        condition: {
          'videoElement.clientWidth': {
            $lt: 500,
          },
        },
        then: [
          {
            type: 'dispatch-event',
            event: 'disableExtension',
          },
        ],
      },
      {
        type: 'if',
        condition: {
          extensionMinimized: false,
        },
        property: {
          querySelector:
            '.ytp-ce-element:not([aria-hidden]), .videowall-endscreen[style=""], .ytp-autonav-endscreen-countdown-overlay[style=""]',
          exists: true,
        },
        then: [
          {
            type: 'style-many',
            element: {
              querySelector:
                '.ytp-ce-element:not([aria-hidden]), .videowall-endscreen[style=""], .ytp-autonav-endscreen-countdown-overlay[style=""]',
            },
            style: {
              'z-index': '1001',
            },
          },
        ],
      },
      {
        type: 'if',
        condition: {
          extensionMinimized: false,
        },
        property: {
          querySelector: '.ytp-ad-module:not(:empty)',
          exists: true,
        },
        then: [
          {
            type: 'style',
            element: {
              querySelector: '.ytp-ad-module',
            },
            style: {
              position: 'relative',
              top: '88px',
              height: 'calc(100% - 182px)',
              'pointer-events': 'none',
              'z-index': '1001',
            },
          },
          {
            type: 'class',
            element: {
              querySelector: '.html5-video-player',
            },
            add: ['ytp-autohide'],
          },
        ],
      },
    ],
    minimizeExtension: [
      {
        type: 'dispatch-event',
        event: 'enableClientControls',
      },
      {
        type: 'style',
        element: {
          extensionElement: 'videoOverlay',
        },
        style: {
          display: 'block',
          width: 'auto',
          height: 'auto',
        },
      },
      {
        type: 'style',
        element: {
          querySelector: '.ytp-chrome-top',
        },
        style: {
          'margin-inline-start': '70px',
        },
      },
    ],
    minimizePlayer: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '.ytp-miniplayer-button',
        },
      },
    ],
    mute: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '[data-title-no-tooltip="Mute"]',
        },
      },
    ],
    unmute: [
      {
        type: 'emulate-click',
        element: {
          querySelector: '[data-title-no-tooltip="Unmute"]',
        },
      },
    ],
  },
  extensionElementsHeuristics: {
    videoOverlay: {
      querySelector: '.html5-video-player',
      placement: {
        at: 'end',
      },
      style: {},
      commands: [],
    },
  },
  keyboardEventDataByKey: {
    c: {
      keyCode: 67,
      keyCodeKeyPress: 99,
      key: 'c',
      code: 'KeyC',
    },
    f: {
      keyCode: 70,
      keyCodeKeyPress: 102,
      key: 'f',
      code: 'KeyF',
    },
    i: {
      keyCode: 73,
      keyCodeKeyPress: 105,
      key: 'i',
      code: 'KeyI',
    },
    t: {
      keyCode: 84,
      keyCodeKeyPress: 102,
      key: 't',
      code: 'KeyT',
    },
  },
  propertyHeuristics: {
    ad: {
      querySelector: '.ytp-ad-module:not(:empty)',
      exists: true,
    },
    fullscreen: {
      querySelector: 'ytd-app[player-fullscreen]',
      exists: true,
    },
    muted: {
      querySelector: '[data-title-no-tooltip="Unmute"]',
      exists: true,
    },
    subtitlesEnabled: {
      querySelector: '.caption-window',
      exists: true,
    },
    theaterEnabled: {
      querySelector: '#full-bleed-container #player-container.ytd-watch-flexy',
      exists: true,
    },
  },
  qualityMap: {
    '4320p': '8K',
    '2160p': '4K',
    '1440p': '2K',
    '1080p': 'HD',
    '720p': 'SD',
    '480p': 'SD',
    '360p': 'SD',
    '240p': 'SD',
    '144p': 'SD',
  },
  qualityRegExp:
    '(?<quality>[0-9]+p)\\s*(?<hdr>HDR)?\\s*(?<hd_label>8K|4K|HD|Premium HD|Premium HDEnhanced bitrate)?\\s*',
};
