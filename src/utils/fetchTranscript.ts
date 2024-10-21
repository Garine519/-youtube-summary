import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";

export const fetchTranscriptAndSummary = async ({
  videoId,
  options,
}: {
  videoId: string;
  options: { openAIKey: string; language: string };
}): Promise<string> => {
  try {
    if (!videoId) throw new Error("Video ID is missing.");
    if (!options.openAIKey)
      throw new Error(
        "OpenAI Key is missing. Please update it from the options page."
      );

    const client = new OpenAI({
      apiKey: options.openAIKey,
    });

    const { timedtextUrl } = await crawlYoutube(videoId);
    const xmlResponse = await axios.post(timedtextUrl);
    const xml = cheerio.load(xmlResponse.data, {
      xmlMode: true,
    });
    const transcripts = xml("text")
      .map((_, elem) => {
        return xml(elem).text();
      })
      .get()
      .join(" ");
    const chatgptResponse = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Without using the word 'transcript', Make this transcript readable and try to paraphrase and summarize it so its understanbale in ${
            options.language || "English"
          }:  ${transcripts}`,
        },
      ],
      model: "gpt-4o-mini",
    });
    if (
      !chatgptResponse ||
      !chatgptResponse.choices ||
      !chatgptResponse.choices[0] ||
      !chatgptResponse.choices[0].message ||
      !chatgptResponse.choices[0].message.content
    ) {
      throw new Error("Failed to get a valid response from OpenAI.");
    }

    return chatgptResponse.choices[0].message.content as string;
  } catch (error) {
    console.error("Error occurred:", error);
    throw new Error(
      (error as Error).message ? (error as Error).message : "An error occurred"
    );
  }
};

const crawlYoutube = async (
  videoId: string
): Promise<{
  contextObject: object;
  params: string;
  timedtextUrl: string;
}> => {
  // URL of the page to scrape
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const response = await axios.get(url);
  const html = response.data;

  // Load the HTML into cheerio
  const $ = cheerio.load(html);
  // Get the script tags
  let contextObject = {};
  let params = "";
  let timedtextUrl = "";
  $("script").each((_, elem) => {
    const script = $(elem).text();
    if (script) {
      if (script.includes("INNERTUBE_CONTEXT")) {
        // get everything after INNERTUBE_CONTEXT
        const context = script.split("INNERTUBE_CONTEXT")[1];
        // remove first two characters and the last character
        const contextJSON = context.slice(2).slice(0, -2);

        // parse the JSON string
        contextObject = JSON.parse(contextJSON);
      } else if (script.includes("getTranscriptEndpoint")) {
        const transcript = script.split("getTranscriptEndpoint")[1];
        params = transcript.split('"')[4];
      } else if (script.includes("captionTracks")) {
        const captionTracks = script.split("captionTracks")[1];
        const baseURL = captionTracks.split("baseUrl")[1];
        const url = baseURL.split('"')[2];
        timedtextUrl = url.replace(/\\u0026/g, "&");
      }
    }
  });
  return { contextObject, params, timedtextUrl };
};
