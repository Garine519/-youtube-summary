import "./App.css";
import { useEffect, useState } from "react";
import Summary from "./components/Summary";


function App() {
  const [isYoutubeVideo, setIsYoutubeVideo] = useState<boolean>(true);
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!chrome || !chrome.runtime || !chrome.tabs) return;
    const init = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        // Check if the current tab is a YouTube video page
        const currentPath = new URL(activeTab.url as string);
        if (!currentPath.href.includes("youtube.com/watch")) {
          setIsYoutubeVideo(false);
          return;
        }

        setIsYoutubeVideo(true);
        chrome.runtime.sendMessage({
          action: "popup_fetchData",
          storageOnly: true,
        });
      });
    };
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.message === "bg_data") {
        if (request.data) {
          setData(request.data);
        }
        if (request.error) {
          setError(request.error);
        }
      }
    });
    init();
  }, []);

  const fetchSummary = () => {
    if (!chrome || !chrome.runtime || !chrome.tabs) return;
    chrome.runtime.sendMessage({ action: "popup_fetchData" });
  };

  return (
    <Summary onSummaryFetch={fetchSummary} data={data} error={error} unavailable={!isYoutubeVideo} />
  )
}

export default App;
