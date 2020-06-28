'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.readFieldCapsResponse = readFieldCapsResponse;

var _utils = require('../../../../../utils');

var _should_read_field_from_doc_values = require('./should_read_field_from_doc_values');

/**
 *  Read the response from the _field_caps API to determine the type and
 *  "aggregatable"/"searchable" status of each field.
 *
 *  For reference, the _field_caps response should look like this:
 *
 *  {
 *    "fields": {
 *      "<fieldName>": {
 *        "<esType>": {
 *          "type": "<esType>",
 *          "searchable": true,
 *          "aggregatable": false,
 *          // "indices" is only included when multiple
 *          // types are found for a single field
 *          "indices": [
 *            "<index>"
 *          ]
 *        },
 *        "<esType2>": {
 *          "type": "<esType2>",
 *          "searchable": true,
 *          ...
 *
 *  Returned array includes an object for each field in the _field_caps
 *  response. When the field uses the same configuation across all indices
 *  it should look something like this:
 *
 *    {
 *      "name": "<fieldName>"
 *      "type": "<kbnType>",
 *      "aggregatable": <bool>,
 *      "searchable": <bool>,
 *    }
 *
 *  If the field has different data types in indices it will be of type
 *  "conflict" and include a description of where conflicts can be found
 *
 *    {
 *      "name": "<fieldName>",
 *      "type": "conflict",
 *      "aggregatable": false,
 *      "searchable": false,
 *      conflictDescriptions: {
 *        "<esType1>": [
 *          "<index1>"
 *        ],
 *        "<esType2>": [
 *          "<index2>"
 *        ]
 *      }
 *    }
 *
 *  @param {FieldCapsResponse} fieldCapsResponse
 *  @return {Promise<Array<FieldInfo>>}
 */
function readFieldCapsResponse(fieldCapsResponse) {
  const capsByNameThenType = fieldCapsResponse.fields;
  return Object.keys(capsByNameThenType).map(fieldName => {
    const capsByType = capsByNameThenType[fieldName];
    const types = Object.keys(capsByType);

    if (types.length > 1) {
      return {
        name: fieldName,
        type: 'conflict',
        searchable: false,
        aggregatable: false,
        readFromDocValues: false,
        conflictDescriptions: types.reduce((acc, esType) => _extends({}, acc, {
          [esType]: capsByType[esType].indices
        }), {})
      };
    }

    const esType = types[0];
    const caps = capsByType[esType];
    return {
      name: fieldName,
      type: (0, _utils.castEsToKbnFieldTypeName)(esType),
      searchable: caps.searchable,
      aggregatable: caps.aggregatable,
      readFromDocValues: (0, _should_read_field_from_doc_values.shouldReadFieldFromDocValues)(caps.aggregatable, esType)
    };
  });
}
