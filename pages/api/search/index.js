export default function (req, res) {
    res.status(400).json({ msg: 'Debe de especificar el query de busqueda' })
}