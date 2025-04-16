import { USER_COLOR_POOL } from "./constants";

export function getUserInitials({ givenName, familyName }) {
  if (!givenName) {
    return "";
  }

  const initialsA = givenName[0] + familyName[0];
  const initialsB = givenName[0] + givenName[1];

  return familyName ? initialsA : initialsB;
}

export function mapUserColor(userName) {
  if (!userName) {
    return USER_COLOR_POOL[0];
  }

  let colorPoolIndex = 0;
  [...userName].forEach((character) => {
    colorPoolIndex += character.charCodeAt(0);
  });
  colorPoolIndex %= USER_COLOR_POOL.length;

  return USER_COLOR_POOL[colorPoolIndex];
}
