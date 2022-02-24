import axios from "axios";
import _ from "lodash";

const API_URL = process.env.REACT_APP_API_URL;
// axios instance for users and content mngt
export const executeApiCall = (sessionToken: string) =>
  axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

export const sort = <T>(items: T[], path: string[], order: "asc" | "desc") =>
  _.orderBy(items, [...path], [order]);

// for NOTES only!
export const formatSectionName = (input: string) => {
  return input
    .split("::")
    .slice(1)
    .map((a) => _.capitalize(a))
    .join(" ");
};
