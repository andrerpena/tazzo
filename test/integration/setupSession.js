import buildDb from './buildDb';

/**
 * Truncates (delete) data from all tables
 * @param db
 */
function truncateData(db) {
    if (!db) throw Error('\'db\' should be truthy');

    const entities = [
        'notification',
        'user',
        'geo_location',
        'geo_location_cache',
        'geo_location_country',
        'geo_location_state',
        'geo_location_city',
        'profession'
    ];

    // concatenates all entities from the database
    const entitiesAsString = entities.map(e => `"${e}"`).join(', ');

    // nukes the database (puff.. nothing left)
    return db.run(`truncate ${entitiesAsString} cascade`);
}

/**
 * Sets up a database test session
 * @param before
 * @param after
 */
export default function setupSession(before, after, beforeEach, afterEach, callback) {
    if (!before) throw Error('\'before\' should be truthy');
    if (!after) throw Error('\'after\' should be truthy');

    let db = null;

    // runs before all tests in a file
    before((done) => {
        buildDb()
            .then((m) => { db = m; callback(m); return m; })
            .then(() => done())
            .catch(done);
    });

    // runs before each test in a file
    beforeEach((done) => {
        truncateData(db)
            .then(() => done());
    });

    // runs after all tests in a file
    after((done) => {
        done();
    });
}