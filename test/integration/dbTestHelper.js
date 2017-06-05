import { assert } from 'chai';

/**
 * Asserts it can save, find and delete the given object
 * @param db The Massive instance
 * @param entityName The name of the entity
 * @param originalObject The original object being saved
 * @param callback The callback to be called after the whole thing
 */
export function assertCanSaveFindAndDelete(db, entityName, originalObject) {
    // saves the object
    return db[entityName].save(originalObject)
        // tries to find the object we just saved
        .then(obj => db[entityName].findOne(obj.id))
        // asserts everything is there
        .then((obj) => {
            for (const property in originalObject) {
                if (originalObject.hasOwnProperty(property)) {
                    assert.strictEqual(obj[property], originalObject[property]);
                }
            }
            return obj;
        })
        // tries to delete the object
        .then(obj => db[entityName].destroy({ id: obj.id }))
        // now tries to find the object again.
        // objs will the the array of objects deleted, in this case, there's only one
        .then(objs => db[entityName].findOne({ id: objs[0].id }))
        .then(obj => assert.isUndefined(obj));
}
