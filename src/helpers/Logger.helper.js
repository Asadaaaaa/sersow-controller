/**
 * Logs the given text along with the current date and process ID.
 * @param {string} text - The text to be logged.
 */
export default function Logger(text) {
  if (typeof text !== 'string') {
    console.error('Error: text must be a string');
    return;
  }

  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  console.log(`[${date}] (${process.pid}): ${text}`);
}