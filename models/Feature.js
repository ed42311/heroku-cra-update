var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var FeatureSchema = new Schema({
  "index": {
    "type": "Number"
  },
  "name": {
    "type": "String"
  },
  "full_name": {
    "type": "String"
  },
  "desc": {
    "type": [
      "String"
    ]
  },
  "skills": {
    "type": [
      "Mixed"
    ]
  },
  "url": {
    "type": "String"
  }
});

module.exports = mongoose.model('Feature', FeatureSchema);
