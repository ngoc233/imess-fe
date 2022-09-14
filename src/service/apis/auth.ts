import { postAPI } from "./axios";
export const refreshToken = (
  accessToken: string | null,
  refreshToken: string
) => {
  return postAPI("/");
};
