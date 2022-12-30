import { isValidObjectId } from "mongoose";
import { connect, disconnect } from "../../../database/db";
import User from "../../../models/User";

export default function (req, res) {
    
    switch ( req.method ) {
        case 'GET':
           return getUsers( req, res );

        case 'PUT':
            return updateUser( req, res );
    
        default:
            return res.status(200).json({ msg: 'Bad Request' });
    }
}

    const getUsers = async( req, res ) => {

        await connect();
        const users = await User.find().select('-password').lean();
        await disconnect();

        return res.status(200).json( users );
    }

    const updateUser = async( req, res ) => {

        const { userId = '', role = '' } = req.body;
        
        const validRoles = [ 'admin', 'super-user', 'SEO', 'client' ];

        if( !isValidObjectId( userId ) ){
            return res.status(400).json({ msg: 'No existe ese usuario por ese Id' });
        }

        if( !validRoles.includes( role ) ){
            return res.status(400).json({ msg: 'Rol no permitido' }); 
        }

        await connect();
        const user = await User.findById( userId );

        if( !user ){
            return res.status(400).json({ msg: 'Usuario no encontrado' }); 
        }

        user.role = role;
        await user.save();
        await disconnect();

        return res.status(200).json({ msg: 'Usuario actualizado' }); 
    }