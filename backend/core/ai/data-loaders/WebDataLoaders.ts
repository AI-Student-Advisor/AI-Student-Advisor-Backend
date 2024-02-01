import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

export const getWebBaseLoader = (url: string, loaderName?: string) => {
  switch (loaderName) {
    case "cheerio":
      return new CheerioWebBaseLoader(url);
    default:
      return new CheerioWebBaseLoader(url);
  }
};
