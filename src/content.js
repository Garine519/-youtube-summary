/**
 * @deprecated This file is not used anymore. It was used to extract the context object from the YouTube page.
 */

// Loop through each script tag and find the one that contains the context object
const getContextObject = () => {
  const scripts = document.querySelectorAll("script");
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

const { params, contextObject } = getContextObject();
console.log("Context Object:", { contextObject, params });

let currentUrl = location.href;
const observeURLChanges = () => {
  const observer = new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      const { params, contextObject } = getContextObject();
      console.log("Context Object:", { contextObject, params });
    }
  });
  observer.observe(document, { childList: true, subtree: true });
};

observeURLChanges();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.ping === "popup_areYouThere")
    sendResponse({ status: "content_yes" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Send a response back to the background script
  if (request.action === "bg_getContextObjectAndParams") {
    const { params, contextObject } = getContextObject();
    if (!params) throw new Error("Cannot summarize video. wrong parameters");
    sendResponse({ params, contextObject });
  }
});
