// export const Base_Url = "/api";


export const Base_Url = "/api";
// Check if we are on localhost or AWS
export const Socket_Url = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "http://13.60.253.32:3000";