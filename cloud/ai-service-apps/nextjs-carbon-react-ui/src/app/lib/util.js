import { SPACE_ID, API_KEY, BASE_DEPLOYMENT_URL } from "./variables";

// These values will be computed
const VERSION = "2025-01-01";
const IAM_STAGE = BASE_DEPLOYMENT_URL.includes("wml-fvt") ? "staging" : "production";

export const URLS = {
  deploymentUrl: `${BASE_DEPLOYMENT_URL}?space_id=${SPACE_ID}&version=${VERSION}`,
  aiServiceUrl: `${BASE_DEPLOYMENT_URL}/ai_service?version=${VERSION}`,
  aiServiceStreamUrl: `${BASE_DEPLOYMENT_URL}/ai_service_stream?version=${VERSION}`,
};

let token = null;
let tokenExpiresAt = null;

export async function getToken() {
  if (!_isTokenValid()) {
    await generateToken();
  }
  return token;
}

function _isTokenValid() {
  if (!token) return false;
  if (tokenExpiresAt <= Date.now()) {
    return false;
  }
  return true;
}

export async function generateToken() {
  const stateSegment = IAM_STAGE === "staging" ? "test." : "";
  const tokenUrl = `https://iam.${stateSegment}cloud.ibm.com/identity/token`;
  const urlTokenParams = new URLSearchParams();

  urlTokenParams.append("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
  urlTokenParams.append("apikey", API_KEY);

  const data = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlTokenParams,
  }).then((res) => res.json());

  tokenExpiresAt = data.expiration * 1000;
  token = data.access_token;
}
