export const getTime = (seconds: number) => {
  if (seconds === 0) return "00:00";
  let output = "";

  // Calculate minutes

  let minutes = Math.floor(seconds / 60);

  if (minutes < 10) {
    output += `0${minutes}`;
  } else {
    output += minutes;
  }

  // Center :
  output += ":";

  // Calculate seconds
  let secondsOutput = seconds - minutes * 60;

  if (secondsOutput < 10) {
    output += `0${secondsOutput}`;
  } else {
    output += secondsOutput;
  }

  return output;
};
