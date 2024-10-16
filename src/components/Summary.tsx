import ReactMarkdown from "react-markdown";
import Button from "./Button";
import { useEffect, useState, useRef } from "react";

export interface SummaryProps {
  data?: string;
  error?: string;
  unavailable?: boolean;
  isFetching?: boolean;
  onSummaryFetch: () => void;
  openOptions: () => void;
}

const defaultBtnLabel = "Summarize video";

const Summary = ({
  onSummaryFetch = () => {},
  openOptions = () => {},
  ...props
}: SummaryProps) => {
  const { data, error, unavailable, isFetching } = props;
  const [state, setState] = useState<"" | "success" | "error" | "unavailable">(
    ""
  );
  const [buttonLabel, setButtonLabel] = useState<string>(defaultBtnLabel);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]); // Keep track of all active timeouts

  useEffect(() => {
    if (data) {
      setState("success");
    } else if (error) {
      setState("error");
    } else if (unavailable) {
      setState("unavailable");
    }
  }, [data, error, unavailable]);

  useEffect(() => {
    if (!isFetching) {
      timeoutsRef.current.forEach((timeout: NodeJS.Timeout) =>
        clearTimeout(timeout)
      );
      timeoutsRef.current = [];
      setButtonLabel(defaultBtnLabel);
    }
  }, [isFetching]);

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
    </>
  );

  const fetchSummary = () => {
    timeoutsRef.current.push(
      setTimeout(() => {
        setButtonLabel("Summarizing...");
      }, 0)
    );
    timeoutsRef.current.push(
      setTimeout(() => {
        setButtonLabel("Almost there...");
      }, 4000)
    );

    timeoutsRef.current.push(
      setTimeout(() => {
        setButtonLabel("Hold on a little bit more...");
      }, 8000)
    );
    setState("");
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
    <div className={`text-base flex flex-col p-4 border-neutral-200 w-96`}>
      <div className="mb-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl text-primary-700">Video Summary</h1>
          <div className="flex items-center gap-2">
            {data ? (
              <Button
                size="small"
                label={isCopied ? "Copied" : "Copy"}
                disabled={isCopied}
                onClick={copySummary}
              ></Button>
            ) : null}
            <Button size="small" label="Options" onClick={openOptions}></Button>
          </div>
        </header>
        <div className="mb-6">{getState()}</div>
        {state !== "success" && state !== "unavailable" ? (
          <div className="flex items-center justify-center">
            <Button
              disabled={isFetching}
              loading={isFetching}
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
