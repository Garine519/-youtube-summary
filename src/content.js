const scripts = document.querySelectorAll("script");
const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

/*
 * Retrieve video id from url or string
 * @param videoId video url or video id
 */
const retrieveVideoId = (videoId) => {
  if (videoId.length === 11) {
    return videoId;
  }
  const matchId = videoId.match(RE_YOUTUBE);
  if (matchId && matchId.length) {
    return matchId[1];
  }
  throw new Error("Impossible to retrieve Youtube video ID.");
};

// Loop through each script tag and find the one that contains the context object
const getContextObject = () => {
  let contextObject = {};
  let params = "";
  scripts.forEach((script) => {
    if (script.textContent) {
      if (script.textContent.includes("INNERTUBE_CONTEXT")) {
        // get everything after INNERTUBE_CONTEXT
        const context = script.textContent.split("INNERTUBE_CONTEXT")[1];
        // remove first two characters and the last character
        const contextJSON = context.slice(2).slice(0, -2);

        // parse the JSON string
        contextObject = JSON.parse(contextJSON);
        chrome.storage.sync.set({ contextObject });
      } else if (script.textContent.includes("getTranscriptEndpoint")) {
        const transcript = script.textContent.split("getTranscriptEndpoint")[1];
        params = transcript.split('"')[4];
      }
    }
  });
  return { contextObject, params };
};

let currentUrl = location.href;
const observeURLChanges = () => {
  const observer = new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      chrome.runtime.sendMessage({
        message: "urlChanged",
        videoId: retrieveVideoId(currentUrl),
      });
    }
  });
  observer.observe(document, { childList: true, subtree: true });
};

observeURLChanges();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Send a response back to the background script
  if (request.action === "getContextObjectAndParams") {
    const { params, contextObject } = getContextObject();
    if (!params) throw new Error("Cannot summarize this video.");
    const videoId = retrieveVideoId(currentUrl);
    sendResponse({ videoId, params, contextObject });
  }
});