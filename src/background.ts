import { fetchTranscriptAndSummary } from "./utils/fetchTranscript";

const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "popup_fetchData") fetchSummary(request.storageOnly);
});

const retrieveVideoId = (videoId: string) => {
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
        const videoId = retrieveVideoId(activeTab.url as string);
        const storageKey = `transcript-${videoId}`;
        const currentTranscript = await chrome.storage.sync.get(storageKey);
        if (currentTranscript[storageKey]) {
          return chrome.runtime.sendMessage({
            status: "success",
            message: "bg_data",
            data: currentTranscript[storageKey],
          });
        }

        if (storageOnly) return;

        const { options } = await chrome.storage.sync.get("options");
        const summary = await fetchTranscriptAndSummary({ videoId, options });
        chrome.storage.sync.set({ [`transcript-${videoId}`]: summary });
        chrome.runtime.sendMessage({
          status: "success",
          message: "bg_data",
          data: summary,
        });
      } catch (error) {
        chrome.runtime.sendMessage({
          status: "error",
          message: "bg_data",
          error: (error as Error).message,
        });
      }
    }
  );
};
