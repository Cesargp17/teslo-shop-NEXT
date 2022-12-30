import { connect, disconnect } from "../../../database/db";
import User from "../../../models/User";
import bcrypt from 'bcryptjs'
import { isValidToken, signToken } from "../../../utils/jwt";

export default function (req, res) {

    switch ( req.method ) {
        case 'GET':
            return checkJWT( req, res )
    
        default:
            return res.status(400).json({ msg: 'Bad request' })
    }
}

const checkJWT = async( req, res ) => {

    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await isValidToken( token )
    } catch (error) {
        return res.status(401).json({ msg: 'token de autorización no válido' });
    }

    
    await connect();
    const user = await User.findById( userId ).lean();
    await disconnect();
    
    if( !user ){
        return res.status(400).json({ msg: 'No existe ese usuario con ese id' });
    }

    const { email, role, name, _id } = user;
    const newToken = signToken({ _id, email, role, name });

        return res.status(200).json({
        newToken,
        user: {
            email, role, name
        }
    })

    // await connect();
    // const user = await User.findOne({ email });
    // await disconnect();

    // if( !user ) {
    //     return res.status(400).json({ msg: 'Correo o contraseña no validos - EMAIL' })
    // }

    // if( !bcrypt.compareSync( password, user.password ) ){
    //     return res.status(400).json({ msg: 'Bad request - PASSWORD' })
    // }

    // const { role, name, _id } = user;

    // const token = signToken({ _id, email });

    // return res.status(200).json({
    //     token,
    //     user: {
    //         email, role, name
    //     }
    // })
}