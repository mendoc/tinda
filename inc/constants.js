
module.exports = {
    from: 'Dimitri ONGOUA<dimitri@ecole241.org>',
    base_url: "http://localhost:3000/",
    public_dir: "public",
    session_key: "'LdfsfhKirbfg'",
    transport: {
        host: 'ssl0.ovh.net',
        port: 587,
        secure: false,
        auth: {
            user: "dimitri@ecole241.org",
            pass: "OlaLabs241"
        }
    },
    db_infos: {
        user: 'postgres',
        host: 'localhost',
        database: 'tinda',
        password: 'postgre2018'
    }
};