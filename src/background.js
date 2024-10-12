// const summaryEndpoint = "https://youtube-summarize-app.fly.dev/summary";
const summaryEndpoint = "http://localhost:3000/summary";
const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "popup_fetchData") fetchSummary(request.storageOnly);
});

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

const fetchSummary = (storageOnly = false) => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab?.id;
      if (!tabId) return;

      try {
        const videoId = retrieveVideoId(activeTab.url);
        const storageKey = `transcript-${videoId}`;
        const currentTranscript = await chrome.storage.sync.get(storageKey);
        if (
          currentTranscript[storageKey] &&
          currentTranscript[storageKey].data
        ) {
          return chrome.runtime.sendMessage({
            status: "success",
            message: "bg_data",
            data: currentTranscript[storageKey].data,
          });
        }

        if (storageOnly) return;

        const response = await fetchTranscript({ videoId });
        console.log("Response from summary endpoint:", response);
        chrome.storage.sync.set({ [`transcript-${videoId}`]: response });
        chrome.runtime.sendMessage({
          status: "success",
          message: "bg_data",
          data: response.data,
        });
      } catch (error) {
        chrome.runtime.sendMessage({
          status: "error",
          message: "bg_data",
          error: error.message,
        });
      }
    }
  );
};

const fetchTranscript = async ({ videoId }) => {
  try {
    const response = await fetch(summaryEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching from summary endpoint:", error);
    throw new Error(error.message);
  }
};
