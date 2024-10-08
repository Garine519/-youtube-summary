import "./App.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Loading from "./components/loading";

function App() {
  const [isYoutubeVideo, setIsYoutubeVideo] = useState<boolean>(true);
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // Function to get the current tab's URL
  const setCurrentTabUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]; // Get the first (active) tab
      if (tab && tab.url) setCurrentUrl(tab.url); // Set the URL state
    });
  };

  useEffect(() => {
    if (!chrome || !chrome.runtime || !chrome.tabs) return;
    const port = chrome.runtime.connect({ name: "popupOpened" });

    port.onDisconnect.addListener(() => {
      console.log("Popup closed");
    });

    setCurrentTabUrl();
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.message === "data") {
        if (request.data) {
          setData(request.data);
        }
        if (request.error) {
          setError(request.error);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!chrome || !chrome.runtime || !chrome.tabs) return;
    if (!currentUrl.includes("youtube.com/watch")) {
      setIsYoutubeVideo(false);
      return;
    }
    console.log("currentUrl", currentUrl);
    setIsYoutubeVideo(true);
  }, [currentUrl]);

  return (
    <div
      className={`text-base border border-solid p-4 border-neutral-200 rounded w-96`}
    >
      <h1 className="text-2xl text-primary-700 mb-2">Video Summary</h1>

      {isYoutubeVideo ? (
        <>
          {!error && !data ? (
            <div className="flex items-center justify-center">
              <div className="w-20">
                <Loading />
              </div>
            </div>
          ) : null}

          {data ? (
            <div className="text-neutral-600">
              <ReactMarkdown>{data}</ReactMarkdown>
            </div>
          ) : null}
        </>
      ) : (
        <div className="text-neutral-600">
          <p>
            This extension only works on YouTube video pages. Please visit a
            YouTube video page to see the summary.
          </p>
        </div>
      )}

      {error && <div className="text-red-500 text-lg">{error}</div>}
    </div>
  );
}

export default App;
