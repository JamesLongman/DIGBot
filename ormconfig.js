module.exports = {
    type: 'mariadb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_DATABASE || 'digbot',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,

    charset: 'UTF8MB4_UNICODE_CI',

    entities: [
        `${__dirname}/dist/**/*.entity.js`,
    ],

    synchronize: process.env.NODE_ENV !== 'production',
    migrationsRun: process.env.NODE_ENV === 'production',

    migrations: [
        `${__dirname}/dist/migrations/*.js`,
    ],
    cli: {
        migrationsDir: 'dist/migrations'
    }
};
