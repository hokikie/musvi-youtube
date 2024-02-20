const YOUTUBE_MUSIC_URL = 'https://music.youtube.com';
const YOUTUBE_URL = 'https://www.youtube.com';

function updateTab(tabId, url) {
  chrome.tabs.update(tabId, { url });
}

function redirectToYouTube(details) {
  const url = new URL(details.url);
  const videoId = url.searchParams.get('v');
  const tabId = details.tabId;

  if (videoId) {
    const redirectUrl = `${YOUTUBE_URL}/watch?v=${videoId}`;
    updateTab(tabId, redirectUrl);
  } else {
    updateTab(tabId, YOUTUBE_URL);
  }
}

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    // Check if the request is from YouTube Music and the response status is 303
    const isYoutubeMusic = details.url.startsWith(`${YOUTUBE_MUSIC_URL}/watch`);
    const isRedirectStatus = details.statusCode === 303;

    if (isYoutubeMusic && isRedirectStatus) {
      redirectToYouTube(details);
    }
  },
  { urls: [`${YOUTUBE_MUSIC_URL}/*`], types: ['main_frame'] },
  ['responseHeaders']
);
