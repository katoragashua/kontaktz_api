const checkBirthdays = async (data) => {
  const day = new Date().getDate();
  const month = new Date().getMonth();

  return data
    .filter((datum) => {
      if (
        new Date(datum.birthday).getDate() === day &&
        new Date(datum.birthday).getMonth() === month
      ) {
        return datum;
      }
      return;
    })
    .reduce((acc, curr) => {
      const { _id } = curr;
      acc.push(_id);
      return acc;
    }, []);
};

module.exports = checkBirthdays;
