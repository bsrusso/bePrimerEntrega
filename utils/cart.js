const res = require("express/lib/response");
const fs = require("fs");
const path = './products.json'

class Cart {
    constructor(cartPath) {
        this.cartPath = cartPath
    }

    async getAll() {
        const data = await fs.promises.readFile(this.cartPath, "utf8", function (err, data) {
            if (err) throw err;
            const json = JSON.parse(data);
            return json;
        });
        return JSON.parse(data);
    }

    async createCart() {
        const json = await this.getAll();
        let id = 0
        if (json.length == 0) {
            id = 1
        } else { id = json[json.length - 1].id + 1; }
        const carro = {
            id: id,
            timestamp: Date.now(),
            productos: []
        }
        json.push(carro);
        fs.writeFileSync(this.cartPath, JSON.stringify(json), function (err) {
            if (err) throw err;
        });
        return id;
    }

    async deleteCartByID(id) {
        const json = await this.getAll();
        const newArray = json.filter((item) => item.id !== id);
        console.log(newArray)
        fs.writeFileSync(this.cartPath, JSON.stringify(newArray), function (err) {
            if (err) throw err;
        });
    }

    async saveItem(idCarrito, idProducto) {
        const json = await this.getAll();
        const carrito = json.find((item) => item.id == idCarrito);
        if (carrito.productos == undefined) {
            carrito.productos = []
        }
        carrito.productos.push(await this.getProductoById(path, idProducto))
        fs.writeFileSync(this.cartPath, JSON.stringify(json), function (err) {
            if (err) throw err
        })
        return carrito.id;
    }

    async deleteItemById(idCarrito, idProducto) {
        const json = await this.getAll();
        const carrito = json.find((item) => item.id == idCarrito);
        if (carrito.productos == undefined) {
            carrito.productos = []
        }
        carrito.productos = carrito.productos.filter((item) => item.id != idProducto);
        fs.writeFileSync(this.cartPath, JSON.stringify(json), function (err) {
            if (err) throw err;
        });
    }

    async getProductosCart(id) {
        const json = await this.getAll();
        const carrito = json.find((item) => item.id == id);
        if (carrito.productos.length == 0) {
            return 'No hay productos en el carrito'
        }
        return (carrito.productos)
    }

    async getProductoById(path, id) {
        let data = await fs.promises.readFile(path, "utf8", function (err, data) {
            if (err) throw err;
            return JSON.parse(data)
        });
        const json = JSON.parse(data);
        const item = json.find((item) => item.id == id);
        if (typeof item === "undefined") {
            return { error: 'producto no encontrado' };
        } else {
            return item
        }
    }

}





module.exports = Cart;