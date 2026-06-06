const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

export function getHeaders(event) {
  const origin = event?.headers?.origin || event?.headers?.Origin || "";
  const allowedOrigin = origin === ALLOWED_ORIGIN ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json",
  };
}
