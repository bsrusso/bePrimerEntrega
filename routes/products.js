const express = require("express")
const { Router } = express
const Container = require('../utils/container')
const path = './products.json'
let router = new Router()
let container = new Container(path)
let admin = false
const isAdmin = (req, res, next) => {
    if (!admin) {
        console.log('Error: No estas logeado como administrador')
        return res.redirect('/api/login')
    }
    next()
}



//Muestra todos los productos en http://localhost:8080/api/productos
router.get("/productos", async (req, res) => {
    let productos = await container.getAll()
    res.render("../views/products/productos.ejs", { productos, admin })
})


//Muestra producto por ID en http://localhost:8080/api/productos/:id, si /:id apunta a un producto que no existe lo indica en pantalla
router.get("/productos/:id", async (req, res) => {
    let { id } = (req.params)
    let producto = await container.getItemById(Number(id))
    res.render("../views/products/productoID.ejs", { producto, admin })
})

//Agrega un producto por POST (form en http://localhost:8080/api/admin/agregarProducto solo para admins)
router.get('/admin/agregarProducto', isAdmin, (req, res) => {
    res.render('../views/products/agregarProd.ejs')
})

router.post("/productos", isAdmin, async (req, res) => {
    let { title, price, thumbnail, stock, descripcion } = req.body
    let id = await container.saveItem(
        {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock,
            descripcion: descripcion,
            codigo: `COD000${title}`
        })
    res.redirect('/api/productos')
    console.log(`Producto agregado con exito, ID del producto: ${id}`)
})

//Form en http://localhost:8080/api/admin/actualizarProducto/:id solo para admins
router.get('/admin/actualizarProducto/:id', isAdmin, async (req, res) => {
    let { id } = (req.params)
    let producto = await container.getItemById(Number(id))
    res.render('../views/products/actualizarProd.ejs', { producto })
})

//Recibir y actualizar un producto segun su ID con PUT
router.put("/productos", isAdmin, async (req, res) => {
    let { id, title, price, thumbnail, descripcion, stock } = req.body
    let update = await container.updateProduct({ id: Number(id), title: title, price: price, thumbnail: thumbnail, descripcion: descripcion, stock: stock })
    res.redirect('/api/productos')
})

//Borrar un item por ID con DELETE
router.delete("/productos", isAdmin, async (req, res) => {
    let { id } = (req.body)
    let deleteItem = await container.deleteItemById(Number(id))
    res.redirect('/api/productos')
})


//Logearse como administrador
router.get("/login", (req, res) => {
    res.render('../views/login.ejs')
})

router.post("/login", (req, res) => {
    admin = true
    res.redirect('/api/productos')
})

module.exports = router