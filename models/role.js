

const { Schema, model } = require('mongoose');

const RoleSquema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

module.exports = model( 'Role', RoleSquema );


