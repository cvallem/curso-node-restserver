const fs = require('fs');
const path = require('path');

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');

const cargarArchivo = async( req, res = response ) => {

    try {
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg });
    }
    
}


const actualizarImagen = async( req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imágenes previas
    try {
        if ( modelo.img ){
            // Hay que borrar imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

            if ( fs.existsSync( pathImagen ) ){
                fs.unlinkSync( pathImagen );
            }
        }
    } catch (error) {
        console.log(error);
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo );

}


const mostrarImagen = async( req, res = response ) => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Si la imagen y el path existe
    try {
        if ( modelo.img ){
            // Hay que borrar imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

            if ( fs.existsSync( pathImagen ) ){
                return res.sendFile( pathImagen );
            }
        }
    } catch (error) {
        console.log(error);
    }
    
    const noImg = path.join( __dirname, '../assets/no-image.jpg' );

    if ( fs.existsSync( noImg ) ){
        return res.sendFile( noImg );
    }

    res.json( { msg: 'falta placeHolder' } );
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}

