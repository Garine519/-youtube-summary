import "./App.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Loading from "./components/loading";

function App() {
  const [isYoutubeVideo, setIsYoutubeVideo] = useState<boolean>(true);
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

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
      setLoading(false);
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
    setLoading(true);
    chrome.runtime.sendMessage({ action: "popup_fetchData" });
  };

  return (
    <div
      className={`text-base flex flex-col border border-solid p-4 border-neutral-200 rounded w-96`}
    >
      <h1 className="text-2xl text-primary-700 mb-2">Video Summary</h1>

      {isYoutubeVideo ? (
        <>
          {loading ? (
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
          ) : (
            <button
              className="border borer-solid self-end justify-self-end p-4 bg-primary-500 text-primary-100"
              disabled={loading}
              onClick={fetchSummary}
            >
              Fetch Summary
            </button>
          )}
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
