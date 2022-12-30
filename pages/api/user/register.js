import { connect, disconnect } from "../../../database/db";
import User from "../../../models/User";
import bcrypt from 'bcryptjs'
import { signToken } from "../../../utils/jwt";
import { isValidEmail } from "../../../utils/validations";

export default function (req, res) {

    switch ( req.method ) {
        case 'POST':
            return registerUser( req, res )
    
        default:
            return res.status(400).json({ msg: 'Bad request' })
    }
}

const registerUser = async( req, res ) => {
    const { email = '', password = '', name = '' } = req.body;

    if( password.length < 6 ){
        return res.status(400).json({ msg: 'La contrasena debe de ser de 6 caracteres o mas' });
    }

    if( name.length < 3 ){
        return res.status(400).json({ msg: 'El nombre debe de ser mayor a dos letras' });
    }

    if( !isValidEmail(email) ){
        return res.status(400).json({ msg: 'El correo no es valido' });
    }

    await connect();
    const user = await User.findOne({ email });

    if( user ){
        return res.status(400).json({ msg: 'Ese correo ya existe en la aplicacion' });
    }
    
    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name: name
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Revisar logs del servidor' });
    }

    const { _id } = newUser;

    const token = signToken({ _id, email, role: 'client', name });

    return res.status(200).json({
        token,
        user: {
            email, role: 'client', name
        }
    })
}