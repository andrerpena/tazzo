import { assert } from 'chai';
import * as locationHelper from '../../../src/server/helpers/locationHelper';
import * as geocodeApiFormattingHelper from '../../../src/server/helpers/geocodeApiFormattingHelper';
import setupSession from '../db/setupSession';

describe('locationHelperSpec', () => {
    describe('getLocationsFromGoogle', () => {
        it('Should work with propertly formatted address',
            () => locationHelper.getLocationsFromGoogle('Rua Henrique Surerus, 28, Juiz de Fora, MG')
                .then(r => geocodeApiFormattingHelper.getFormattedAddresses(r))
                .then((res) => {
                    assert.equal(res.length, 1);
                    assert.equal(res[0], 'Rua Henrique Surerus, 28, Centro, Juiz de Fora, MG');
                }));
        it('Should work with propertly poorly formatted address',
            () => locationHelper.getLocationsFromGoogle(' r Henrique Surerus, 28  Juiz de Fora, /')
                .then(r => geocodeApiFormattingHelper.getFormattedAddresses(r))
                .then((res) => {
                    assert.equal(res.length, 1);
                    assert.equal(res[0], 'Rua Henrique Surerus, 28, Centro, Juiz de Fora, MG');
                }));
        it('Should work with propertly poorly formatted address 2',
            () => locationHelper.getLocationsFromGoogle('Henrique Surerus JF')
                .then(r => geocodeApiFormattingHelper.getFormattedAddresses(r))
                .then((res) => {
                    assert.equal(res.length, 1);
                    assert.equal(res[0], 'Rua Henrique Surerus, Centro, Juiz de Fora, MG');
                }));
        it('Should work with landmarks',
            () => locationHelper.getLocationsFromGoogle('Shopping Alameda JF')
                .then(r => geocodeApiFormattingHelper.getFormattedAddresses(r))
                .then((res) => {
                    assert.equal(res.length, 1);
                    assert.equal(res[0], 'Rua Morais e Castro, 300, Passos, Juiz de Fora, MG');
                }));

        it('Should not work with city only by default',
            () => locationHelper.getLocationsFromGoogle('Juiz de Fora MG')
                .then(r => geocodeApiFormattingHelper.getFormattedAddresses(r))
                .then((res) => {
                    assert.equal(res.length, 0);
                }));

        it('Should work with city only when specified',
            () => locationHelper.getLocationsFromGoogle('Juiz de Fora MG')
                .then(r => geocodeApiFormattingHelper.getFormattedAddresses(r, true))
                .then((res) => {
                    assert.equal(res.length, 1);
                }));

        it('Should work when the address is not valid',
            () => locationHelper.getLocationsFromGoogle('This is not a valid city')
                .then(r => geocodeApiFormattingHelper.getFormattedAddresses(r))
                .then((res) => {
                    assert.equal(res.length, 0);
                }));
    });
    describe('getLocations', () => {
        let db = null;
        setupSession(before, after, beforeEach, afterEach, ($db) => {
            db = $db;
        });

        it('checks the correct behavior', () => {
            const searchTerm = 'henrique surerus jf';
            return db.geo_location_cache.findOneAsync({ search: searchTerm })
                .then((r) => {
                    assert.isNotOk(r);
                })
                .then(() => locationHelper.getLocations(searchTerm, false, db))
                .then((l) => {
                    assert.equal(1, l.length);
                })
                .then(() => db.geo_location_cache.findOneAsync({ search: searchTerm }))
                .then((r) => {
                    assert.ok(r);
                });
        });
    });
});
