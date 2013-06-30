var config = {};

config.username = process.env.FTP_USERNAME;
config.url = process.env.FTP_URL
config.name = process.env.RECORD_NAME
config.password = process.env.FTP_PASSWORD
config.mongo_db = process.env.MONGO_DB
config.from_international_number = process.env.FROM_INTERNATIONAL_NUMBER

module.exports = config;