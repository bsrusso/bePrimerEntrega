const fs = require("fs");
const { title } = require("process");

class Container {
    constructor(path) {
        this.path = path;
    }

    async getAll() {
        const data = await fs.promises.readFile(this.path, "utf8", function (err, data) {
            if (err) throw err;
            const json = JSON.parse(data);
            return json;
        });
        return JSON.parse(data);
    }

    async getItemById(id) {
        let data = await fs.promises.readFile(this.path, "utf8", function (err, data) {
            if (err) throw err;
            return JSON.parse(data)
        });
        const json = JSON.parse(data);
        const item = json.find((item) => item.id === id);
        if (typeof item === "undefined") {
            return { error: 'producto no encontrado' };
        } else {
            return item
        }
    }

    async saveItem(obj) {
        const json = await this.getAll();
        if (json.length == 0) {
            const id = 1
        } else { const id = json[json.length - 1].id + 1; }
        obj.id = id;
        json.push(obj);
        fs.writeFileSync(this.path, JSON.stringify(json), function (err) {
            if (err) throw err;
        });
        return id;
    }

    async updateProduct(obj) {
        let data = await fs.promises.readFile(this.path, "utf8", function (err, data) {
            if (err) throw err;
            return JSON.parse(data)
        });
        const json = JSON.parse(data);
        const item = json.find((item) => item.id === obj.id);
        if (typeof item === "undefined") {
            return { error: 'producto no encontrado' };
        } else {
            item.title = obj.title,
                item.price = obj.price,
                item.thumbnail = obj.thumbnail,
                item.stock = obj.stock,
                item.descripcion = obj.descripcion
        }
        fs.writeFileSync(this.path, JSON.stringify(json), function (err) {
            if (err) throw err
        })
    }

    async deleteItemById(id) {
        const json = await this.getAll();
        const newArray = json.filter((item) => item.id !== id);
        fs.writeFileSync(this.path, JSON.stringify(newArray), function (err) {
            if (err) throw err;
        });
    }

    async deleteAllItems() {
        const json = await this.getAll();
        for (let i = json.length; i > 0; i--) {
            json.pop();
        }
        fs.writeFileSync(this.path, JSON.stringify(json), function (err) {
            if (err) throw err;
            console.log("Archivo guardado correctamente.");
        });
    }
}

module.exports = Container;