import formidable from "formidable";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL)

export const config = {
    api: {
        bodyParser: false,
    }
}

export default function (req, res) {

    switch (req.method) {
        case 'POST':
           return uploadFile( req, res );
    
        default:
            return res.status(200).json({ msg: 'Bad Request' });
    }

}

const saveFile = async( file ) => {
    const { secure_url } = await cloudinary.uploader.upload( file.filepath );
    return secure_url;
}

const parseFiles = async( req ) => {
    return new Promise( (resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse( req, async( err, fields, files ) => {
            if( err ){
                return reject(err);
            }
            const filePath = await saveFile( files.file );
            resolve(filePath);
        })
    })
}

const uploadFile = async(req, res) => {

    const imageUrl = await parseFiles(req)

    return res.status(200).json({ msg: imageUrl });
}