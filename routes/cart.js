const express = require("express")
const { Router } = express
const router = new Router
const Cart = require('../utils/cart')
const cartPath = './cart.json'
const path = './products.json'
const carrito = new Cart(cartPath)

//Crear nuevo carrito
router.post('/carrito', async (req, res) => {
    let id = await carrito.createCart()
    res.send('Se ha creado un carrito nuevo, id: ' + id)
})

//Borrar un carrito
router.delete("/carrito/:id", async (req, res) => {
    let { id } = (req.params)
    await carrito.deleteCartByID(Number(id))
    res.send('Se ha borrado el carrito: ' + id)
})

//Agregar items al carrito
router.post('/carrito/:id/productos', async (req, res) => {
    let id = await carrito.saveItem(req.params.id, req.body.id)
    res.send('Producto agregado al carrito: ' + id)
})

//Mostrar items del carrito
router.get('/carrito/:id/productos', async (req, res) => {
    let item = await carrito.getProductosCart(req.params.id)
    res.json(item)
})

//Borrar un item por su id de carrito y de producto
router.delete('/carrito/:id/productos/:id_prod', async (req, res) => {
    await carrito.deleteItemById(req.params.id, req.params.id_prod)
    res.send('El producto fue borrado con exito')
})

module.exports = router