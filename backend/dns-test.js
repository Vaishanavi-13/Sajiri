const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.project01.spamref.mongodb.net",
  (err, records) => {
    console.log("Error:", err);
    console.log("Records:", records);
  }
);