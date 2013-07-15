var config = {};

config.username = process.env.FTP_USERNAME;
config.url = process.env.FTP_URL
config.name = process.env.RECORD_NAME
config.password = process.env.FTP_PASSWORD
config.mongo_db = process.env.MONGO_DB
config.from_international_number = process.env.FROM_INTERNATIONAL_NUMBER
config.writeit_answer_creation_endpoint = process.env.WRITEIT_ANSWER_CREATION_ENDPOINT
config.writeit_username = process.env.WRITEIT_USERNAME
config.writeit_key = process.env.WRITEIT_KEY


module.exports = config;