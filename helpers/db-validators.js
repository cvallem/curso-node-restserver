const Role = require('../models/role');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');

// Verificar si el rol es válido
const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está configurado en la BD.`);
    }
}

// Verificar si el correo existe
const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${ correo } ya está registrado.`);
    }
}

// Verificar si el id de usuario existe
const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }.`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}
