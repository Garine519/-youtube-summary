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
  const [buttonLabel, setButtonLabel] = useState<string>("Fetch Summary");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setState("success");
    } else if (error) {
      setState("error");
    } else if (unavailable) {
      setState("unavailable");
    }
  }, [data, error, unavailable]);

  const unavailableState = (
    <div className="text-neutral-500">
      <p>
        Oops! This extension only works on YouTube video pages. Please visit a
        YouTube video page to see the summary.
      </p>
    </div>
  );

  //   const loadingState = (
  //     <div className="flex items-center justify-center">
  //       <div className="w-20">
  //         <Loading />
  //       </div>
  //     </div>
  //   );

  const successState = (
    <div className="text-neutral-600">
      <ReactMarkdown>{data?.data}</ReactMarkdown>
    </div>
  );

  const errorState = (
    <>
    <div className="text-red-500 text-base">Oops! {error?.message}</div>
    <p>
        Please try again.
    </p>
    </>
  );

  const fetchSummary = () => {
    setIsLoading(true);
    setButtonLabel("Fetching Summary...");
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

  return (
    <div
      className={`text-base flex flex-col border border-solid p-4 border-grey-200 rounded-lg w-96`}
    >
      <div className="mb-4">
        <h1 className="text-xl text-primary-700 mb-6">Video Summary</h1>
        <div className="mb-6">{getState()}</div>
        {state !== "success" && state !== 'unavailable' ? (
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
