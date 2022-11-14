var express = require('express');
var router = express.Router();
const Validator = require("fastest-validator");
const v = new Validator();
const {Notes} = require("../models")

router.get("/", async (req, res, next) => {
    const notes = await Notes.findAll();
    return res.json({status: 200, message: "ok", data: notes});
});

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    let note = await Notes.findByPk(id);
    if (!note) {
        return res.status(404).json({
            status: 404,
            message: "not found",
            data: ""
        });
    }
    return res.json({status: 200, message: "ok", data: note});
})

router.get("/env", function (req, res, next) {
    res.send(process.env.APP_NAME);
})

router.post("/", async (req, res, next) => {
    const schema = {
        title: "string|min:1",
        description: "string|optional"
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(400).json(validate);
    }
    const note = await Notes.create(req.body);
    res.json({
        status: 200,
        message: "success create data",
        data: note
    })
});

router.put("/:id", async (req, res, next) => {
    const schema = {
        title: "string|min:1",
        description: "string|optional"
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(400).json(validate);
    }
    const id = req.params.id;
    let note = await Notes.findByPk(id);
    if (!note) {
        return res.status(404).json({
            status: 404,
            message: "not found",
            data: ""
        });
    }
    note = await note.update(req.body);
    res.json({
        status: 200,
        message: "success update data",
        data: note
    })
})

router.delete("/:id", async (req, res, next) => {

    const id = req.params.id;
    let note = await Notes.findByPk(id);
    if (!note) {
        return res.status(404).json({
            status: 404,
            message: "not found",
            data: ""
        });
    }
    await note.destroy(id);
    res.json({
        status: 200,
        message: "success delete data",
        data: ""
    })
})

module.exports = router;