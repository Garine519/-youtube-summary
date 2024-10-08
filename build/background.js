const summaryEndpoint = "https://youtube-summarize-app.fly.dev/summary";

chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name === "popupOpened") {
    getContextAndFetchSummary();
    port.onDisconnect.addListener(() => {
      console.log("Popup is closed!");
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "urlChanged") {
    getContextAndFetchSummary();
  }
});

const getContextAndFetchSummary = async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab?.url.includes("youtube.com/watch")) return;
    const tabId = activeTab?.id;
    if (!tabId) return;

    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["content.js"],
      },
      () => {
        chrome.tabs
          .sendMessage(tabId, { action: "getContextObjectAndParams" })
          .then(async (message) => {
            if (message.videoId === undefined) return;
            const { contextObject, params, videoId } = message;
            const response = await fetchTranscript({
              contextObject,
              params,
              videoId,
            });
            chrome.runtime.sendMessage({
              status: response.status,
              message: "data",
              data:
                response.status === "success" ? response.data : response.error,
            });
          })
          .catch((error) => {
            console.error(error);
            chrome.runtime.sendMessage({
              status: "error",
              message: "data",
              error: error.message,
            });
          });
      }
    );
  });
};

const fetchTranscript = async ({ videoId, params, contextObject }) => {
  try {
    const storageKey = `transcript-${videoId}`;
    const currentTranscript = await chrome.storage.sync.get(storageKey);
    if (currentTranscript[storageKey])
      return { status: "success", data: currentTranscript[storageKey] };

    const response = await fetch(summaryEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ params, contextObject }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJson = await response.json();
    chrome.storage.sync.set({ [`transcript-${videoId}`]: responseJson.data });
    return { status: "success", data: responseJson.data };
  } catch (error) {
    console.error(error);
    return { status: "error", error: error.message };
  }
};
