var config = {};

config.username = process.env.FTP_USERNAME;
config.url = process.env.FTP_URL
config.name = process.env.RECORD_NAME
config.password = process.env.FTP_PASSWORD

module.exports = config;