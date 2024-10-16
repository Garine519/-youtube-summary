import "./App.css";

import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Options from "./components/Options";
import Summary from "./components/Summary";

function App() {
  const [isYoutubeVideo, setIsYoutubeVideo] = useState<boolean>(true);
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

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
        fetchSummary({ storageOnly: true });
      });
    };
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.message === "bg_data") {
        setIsFetching(false);
        if (request.data) {
          setData(request.data);
        }
        if (request.error) {
          setError(request.error);
        }
      }
    });

    // Fetch data on initial load
    init();
  }, []);

  const fetchSummary = ({ storageOnly = false } = {}) => {
    if (!chrome || !chrome.runtime || !chrome.tabs) return;
    setError(undefined);
    if (!storageOnly) setIsFetching(true);
    chrome.runtime.sendMessage({ action: "popup_fetchData", storageOnly });
  };

  const goToOptionsPage = () => {
    if (!chrome || !chrome.runtime) return;
    chrome.runtime.openOptionsPage();
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Summary
              onSummaryFetch={fetchSummary}
              openOptions={goToOptionsPage}
              data={data}
              error={error}
              isFetching={isFetching}
              unavailable={!isYoutubeVideo}
            />
          }
        />
        <Route path="/options" element={<Options />} />
      </Routes>
    </Router>
  );
}

export default App;
