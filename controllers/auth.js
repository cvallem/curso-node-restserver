const { response, json } = require("express");
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        // Verificar si existe el correo
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // Si el usuario está inactivo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        // Verificar la contraseña
        const validaPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validaPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}


const googleSignIn = async( req, res = response ) => {
    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        // Generar referencias
        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en BD
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //  Generar el JWT
        const token = await generarJWT( usuario.id );

        res.status(200).json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        json.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        });
    }

    
}


module.exports = {
    login,
    googleSignIn
}
