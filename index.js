//Express
const express = require('express')

//Utils
const path = 'products.json'    //path de los productos
const Container = require('./utils/container')  //Productos
const contenedor = new Container(path)  //Creamos el container de productos
const port = process.env.PORT || 8080   //Puerto
const products = require('./routes/products')   //rutas de los productos
const cart = require('./routes/cart')   //rutas del carrito
const bodyParser = require('body-parser')   //Body Parser para parsear datos del POST
const methodOverride = require('method-override')   //override para PUT en forms


//Crear app
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

//Vista raiz
app.get("/", async (req, res) => {
    let productos = await contenedor.getAll()
    res.render(__dirname + "/views/products/productos.ejs", { productos })
})


app.use("/api", products)
app.use("/api", cart)
app.use(express.urlencoded({ extended: true }))

//App port:
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})