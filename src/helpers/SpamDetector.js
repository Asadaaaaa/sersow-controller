export default (dateList) => {
  const currentDate = new Date();
  const threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

  const recentDates = dateList.filter((dateString) => {
    const date = new Date(dateString);
    return date >= threeHoursAgo && date <= currentDate;
  });

  if (recentDates.length >= 3) {
    const sortedDates = recentDates.sort((a, b) => new Date(a) - new Date(b));

    for (let i = 0; i <= sortedDates.length - 3; i++) {
      const timeDifference = (new Date(sortedDates[i + 2]) - new Date(sortedDates[i])) / 1000; // in seconds
      
      if (timeDifference < 120) {
        return true;
      }
    }
  }

  return false;
};