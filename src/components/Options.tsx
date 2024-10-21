import { useEffect, useState } from "react";
import Button from "./Button";

const Options = () => {
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [btnLabel, setBtnLabel] = useState<string>("Save");
  const [error, setError] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const availableLanguages = [
    "Arabic",
    "Armenian",
    "Bengali",
    "Bulgarian",
    "Chinese",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Estonian",
    "Filipino",
    "Finnish",
    "French",
    "German",
    "Greek",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Indonesian",
    "Italian",
    "Japanese",
    "Korean",
    "Latvian",
    "Lithuanian",
    "Malay",
    "Norwegian",
    "Persian",
    "Polish",
    "Portuguese",
    "Romanian",
    "Russian",
    "Serbian",
    "Slovak",
    "Spanish",
    "Swahili",
    "Swedish",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Vietnamese",
    "Zulu",
  ];

  useEffect(() => {
    if (!chrome || !chrome.storage) return;
    chrome.storage.sync.get(["options"], (result) => {
      const key = result.options.openAIKey as string;
      const lang = result.options.language as string;
      setOpenAIKey(key);
      setLanguage(lang);
    });
  }, []);

  const handleSave = async () => {
    setError("");
    setIsSaving(true);
    try {
      await chrome.storage.sync.set({
        options: {
          openAIKey,
          language,
        },
      });
      setBtnLabel("Saved!");
    } catch {
      setError("An error occurred while saving the key. Please try again");
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setBtnLabel("Save");
      }, 2000);
    }
  };

  return (
    <div className={`text-base flex flex-col p-4 border-neutral-200 w-[500px]`}>
      <h1 className="text-xl mb-2">Options</h1>
      <div className="border border-solid flex flex-col rounded-lg p-6 border-neutral-100">
        <div className="max-w-sm">
          <label
            htmlFor="input-label"
            className="block text-sm font-medium mb-2"
          >
            OpenAI API Key
            <p className="text-xs mt-1 ml-1 text-primary-300">
              We do not store your API Key anywhere on our servers. It is stored
              locally on your browser.
            </p>
          </label>
          <input
            id="input-label"
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
            className="py-3 px-4 block w-full border border-neutral-200 rounded-lg text-sm focus:border-primary-400 focus:ring-primary-400 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Open AI Key"
          />
          <p className="text-xs mt-2 ml-1 text-neutral-600">
            Guide on how to find your OpenAI API Key can be found&nbsp;
            <a
              target="_blank"
              className="underline-current font-medium text-primary-300"
              href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key"
            >
              here.
            </a>
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-500" id="hs-input-helper-text">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 max-w-sm">
          <label
            htmlFor="hs-lang-select-label"
            className="block text-sm font-medium mb-2"
          >
            Language
          </label>
          <select
            id="hs-lang-select-label"
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 max-w-sm">
          <span className="text-xs">This Extension uses gpt-4o-mini</span>
          <label
            htmlFor="hs-select-label"
            className="block text-sm text-neutral-200 font-medium mb-2 dark:text-white"
          >
            OpenAI Model (Coming Soon)
          </label>
          <select
            id="hs-select-label"
            disabled={true}
            className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          ></select>
        </div>

        <div className="mt-6 max-w-sm self-end">
          <Button
            size="small"
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
            label={btnLabel}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Options;
