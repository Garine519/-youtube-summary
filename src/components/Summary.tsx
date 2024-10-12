import ReactMarkdown from "react-markdown";
import Button from "./Button";
import { useEffect, useState } from "react";

export interface SummaryProps {
  data?: string;
  error?: string;
  unavailable?: boolean;
  onSummaryFetch: () => void;
}

const Summary = ({ onSummaryFetch = () => {}, ...props }: SummaryProps) => {
  const { data, error, unavailable } = props;
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "unavailable"
  >("idle");
  const [buttonLabel, setButtonLabel] = useState<string>("Summarize video");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setState("success");
    } else if (error) {
      setState("error");
    } else if (unavailable) {
      setState("unavailable");
    }
    setIsLoading(false);
  }, [data, error, unavailable]);

  const unavailableState = (
    <div className="text-neutral-500">
      <p>
        Oops! This extension only works on YouTube video pages. Please visit a
        YouTube video page to see the summary.
      </p>
    </div>
  );

  const successState = (
    <div className="text-neutral-600">
      <ReactMarkdown>{data}</ReactMarkdown>
    </div>
  );

  const errorState = (
    <>
      <div className="text-red-500 text-base">Oops! {error}</div>
      <p>Please try again.</p>
    </>
  );

  const fetchSummary = () => {
    setIsLoading(true);
    setButtonLabel("Summarizing...");
    setTimeout(() => {
      setButtonLabel("Almost there...");
    }, 4000);
    setTimeout(() => {
      setButtonLabel("Hold on a little bit more...");
    }, 8000);
    onSummaryFetch();
  };

  const getState = () => {
    switch (state) {
      case "unavailable":
        return unavailableState;
      case "success":
        return successState;
      case "error":
        return errorState;
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(data || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className={`text-base flex flex-col p-4 border-grey-200 w-96`}>
      <div className="mb-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl text-primary-700">Video Summary</h1>
          {data ? (
            <Button
              size="small"
              label={isCopied ? "Copied to Clipboard" : "Copy"}
              disabled={isCopied}
              onClick={copySummary}
            ></Button>
          ) : null}
        </header>
        <div className="mb-6">{getState()}</div>
        {state !== "success" && state !== "unavailable" ? (
          <div className="flex items-center justify-center">
            <Button
              disabled={isLoading}
              loading={isLoading}
              label={buttonLabel}
              onClick={fetchSummary}
            ></Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Summary;
