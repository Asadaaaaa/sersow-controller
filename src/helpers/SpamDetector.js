/**
 * Determines if a list of dates indicates spam activity.
 * @param {string[]} dateList - An array of date strings in ISO format.
 * @returns {boolean} - True if the date list indicates spam activity, false otherwise.
 */
export default (dateList) => {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const recentDates = dateList.filter(dateString => new Date(dateString) >= threeHoursAgo);

  if (recentDates.length < 3) {
    return false;
  }

  const sortedDates = recentDates.sort((a, b) => new Date(a) - new Date(b));

  for (let i = 0; i <= sortedDates.length - 3; i++) {
    const timeDifference = (new Date(sortedDates[i + 2]) - new Date(sortedDates[i])) / 1000; // in seconds

    if (timeDifference < 120) {
      return true;
    }
  }

  return false;
};