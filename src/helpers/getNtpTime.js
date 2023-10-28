const ntpClient = require("ntp-client");
const getNtpTime = () => {
  return new Promise((resolve, reject) => {
    ntpClient.getNetworkTime("pool.ntp.org", 123, (err, date) => {
      if (err) {
        console.error("NTP error:", err);
        reject(err);
      } else {
        const ntpTime = new Date(date);
        resolve(ntpTime);
      }
    });
  });
};

exports.getNtpTime = getNtpTime;
