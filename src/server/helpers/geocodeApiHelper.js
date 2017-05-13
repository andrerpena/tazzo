import axios from 'axios';
import config from '../../../config/config';

function findAddressComponentByType(result, type) {
    if (result === null || result === undefined) throw Error('Argument \'result\' should be null or undefined');
    if (type === null || type === undefined) throw Error('Argument \'type\' should be null or undefined');

    const addressComponent = result.address_components.find(e => e.types.includes(type));
    return addressComponent;
}

function getAddressInformationByType(key, type, result) {
    const addressComponent = findAddressComponentByType(result, type);
    return addressComponent ? addressComponent[key] : null;
}

function getStreet(result) {
    return getAddressInformationByType('long_name', 'route', result);
}

function getStreetNumber(result) {
    return getAddressInformationByType('short_name', 'street_number', result);
}

function getNeighborhood(result) {
    return getAddressInformationByType('short_name', 'sublocality_level_1', result);
}

function getCity(result) {
    return getAddressInformationByType('long_name', 'administrative_area_level_2', result);
}

function getState(result) {
    return getAddressInformationByType('short_name', 'administrative_area_level_1', result);
}

function getAddressIdentifier(result) {
    return result.formatted_address;
}

function getFriendlyAddress(result) {
    const addressComponents = [
        getStreet(result),
        getStreetNumber(result),
        getNeighborhood(result),
        getCity(result),
        getState(result)
    ].filter(v => v);
    return {
        friendlyName: addressComponents.join(', '),
        id: getAddressIdentifier(result)
    };
}

export default {
    getAddresses(partialAddress) {
        const encodedAddress = encodeURIComponent(partialAddress);
        const key = config.google.geocodeApiKey;
        const googleGeoCodeApiAdress = `https://maps.google.com/maps/api/geocode/json?address=${encodedAddress}&key=${key}`;
        return new Promise((fulfill, reject) => {
            axios.get(googleGeoCodeApiAdress)
                .then((res) => {
                    if (res.data.errorMessage) {
                        reject(res.data.errorMessage);
                    } else {
                        const result = res.data.results.map(getFriendlyAddress);
                        fulfill(result);
                    }
                })
                .catch(reject);
        });
    }
};