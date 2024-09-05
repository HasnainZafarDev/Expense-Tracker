const { format } = require("date-fns");

const formatDate = (date, formatString = "dd-MMM-yyyy") => {
  return format(new Date(date), formatString);
};
module.exports = { formatDate };
