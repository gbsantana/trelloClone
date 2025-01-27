const mongosse = require('mongosse');

const AnnotationDAtaSchema = new mongosse.Schema({
    title: String,
    notes: String,
    priority: Boolean,

});