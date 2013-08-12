var config = {};

config.username = process.env.FTP_USERNAME;
config.url = process.env.FTP_URL
config.name = process.env.RECORD_NAME
config.password = process.env.FTP_PASSWORD
config.mongo_db = process.env.MONGO_DB
config.from_international_number = process.env.FROM_INTERNATIONAL_NUMBER
config.writeit_url = process.env.WRITEIT_URL
config.writeit_username = process.env.WRITEIT_USERNAME
config.writeit_key = process.env.WRITEIT_KEY
config.remote_writeitinstance_url = process.env.REMOTE_WRITEITINSTANCE_URL
config.recording_root_url = process.env.RECORDING_ROOT_URL


module.exports = config;