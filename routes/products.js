const Product = require("../models/Product");
const Store = require("../models/Store");

const Router = require("express").Router();

Router.get("/search", async (req, res) => {
    // res.json(req.query);
    if (Object.keys(req.query).length === 0) {
        res.status(400).json({
            msg: "query cannot be empty",
        });
        return;
    }

    try {
        let result = {};
        let detailed = [];
        const product = await Store.find({
            "products.name": { $regex: `(?i)${req.query.name}` },
        });
        let charact = req.query.name.toLowerCase();
        const re = RegExp(`${charact}`, "i");
        // res.json(product);
        product.forEach((store) => {
            let storeId = console.log(store.storeId);
            let obj = {
                store: store.storeNo,
            };
            // console.log(store.storeNo);
            // -------------------------------------------
            store.products.forEach((pro) => {
                let assignname = pro.name.toLowerCase();
                if (re.test(assignname)) {
                    // console.log(pro.name);
                    if (Object.keys(result).length === 0) {
                        result.price = pro.price;
                        result.storeId = store.storeNo;
                    } else {
                        if (pro.price < result.price) {
                            result.price = pro.price;
                            result.storeId = store.storeNo;
                        }
                    }
                    obj.price = pro.price;
                }
            });
            detailed.push(obj);
            // ---------------------------------
        });
        res.json({
            result,
            detailed,
        });
    } catch (error) {
        res.json(error);
    }
});

// Router.get("/getAllDeals", async (req, res) => {
//     let products = req.body;
//     res.json(products);
// });

Router.get("/", async (req, res) => {
    // res.json(req.query);
    if (Object.keys(req.query).length === 0) {
        res.status(400).json({
            msg: "query cannot be empty",
        });
        return;
    }

    // `(?i)^[${req.query.name}][a-zA-Z]+$`;

    try {
        let result = {};
        const retrievedProducts = await Store.find({
            "products.name": { $regex: `(?i)^${req.query.name}+.*$` },
        });
        //2214: taking all to lower case

        let charact = req.query.name.toLowerCase();
        const re = RegExp(`^${charact}+.*`, "i");
        // let matchChar = /\${charact}+.*/;
        retrievedProducts.forEach((store) => {
            // console.log(store.products);
            store.products.forEach((pro) => {
                let assignname = pro.name.toLowerCase();
                // console.log(assignname);
                // if (re.test(assignname)) {
                //     console.log(`${assignname} matches...`);
                // }
                // console.log(pro.price);
                // result.push(pro.price);
                if (re.test(assignname)) {
                    if (assignname in result) {
                        // console.log(`${pro.00110111name} exists in the obj`);
                        let tmp1 =
                            result[assignname].price * result[assignname].store;
                        let tmp2 = tmp1 + pro.price;
                        result[assignname].store = result[assignname].store + 1;
                        result[assignname].price =
                            tmp2 / result[assignname].store;
                        result[assignname].price =
                            result[assignname].price.toFixed(2);
                    } else {
                        let assignname = pro.name.toLowerCase();
                        result[`${assignname}`] = {
                            store: 1,
                            price: pro.price,
                        };
                    }
                }
            });
        });
        // console.log(result);
        //709: old code... do not delete
        // const retrivedProducts = await Product.find({
        //     name: { $regex: `(?i)^00110001${req.query.name}+.*$` },
        // });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error });
    }
});

Router.post("/", async (req, res) => {
    res.json(req.query);
    try {
        const newProduct = new Product({
            name: req.query.item,
            stores: req.query.store,
            avgPrice: req.query.price,
        });
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(400).json({
            error: error,
        });
    }
});

module.exports = Router;
