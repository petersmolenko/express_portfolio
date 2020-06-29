const db = require("../models/db");
const fs = require("fs");
const util = require("util");
const validation = require("../libs/validation");
const psw = require("../libs/password");
const path = require("path");
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const formidable = require("formidable");

module.exports.index = (req, res, next) => {
    const products = db.getState().products || [];
    const skills = db.getState().skills || [];
    const msgeml = req.flash("msgemail");
    return res.render("./pages/index", {
        msgemail: msgeml.length ? msgeml : null,
        products,
        skills,
    });
};

module.exports.contact = (req, res, next) => {
    if (!db.has("contacts").value()) db.set("contacts", []).write();
    db.get("contacts").push(req.body).write();

    req.flash("msgemail", "Контакты отправлены!");
    return res.redirect("/index");
};

module.exports.login = (req, res, next) => {
    const msglg = req.flash("msglogin");
    return res.render("./pages/login", {
        msglogin: msglg.length ? msglg : null,
    });
};

module.exports.auth = (req, res, next) => {
    const { email, password } = req.body;
    const user = db.getState().user;

    if (user.email === email && psw.validPassword(password)) {
        req.session.isAuthorized = true;
        req.flash("msglogin", "Авторизация выполнена успешно!");
    } else {
        req.flash("msglogin", "Ошибка! Не верный логин или пароль.");
    }
    return res.redirect("/login");
};

module.exports.admin = (req, res, next) => {
    const msgkl = req.flash("msgskill");
    const msgfl = req.flash("msgfile");
    if (req.session.isAuthorized) {
        return res.render("./pages/admin", {
            msgskill: msgkl.length ? msgkl : null,
            msgfile: msgfl.length ? msgfl : null,
        });
    } else {
        return res.redirect("/login");
    }
};

module.exports.skills = (req, res, next) => {
    const { age, concerts, cities, years } = req.body;
    const error = validation.validSkillsForm(age, concerts, cities, years);

    if (error) {
        req.flash("msgskill", `Ошибка! ${error}`);
    } else {
        db.set("skills", [
            {
                number: age,
                text: "Возраст начала занятий на гитаре",
            },
            {
                number: concerts,
                text: "Концертов отыграл",
            },
            {
                number: cities,
                text: "Максимальное число городов в туре",
            },
            {
                number: years,
                text: "Лет на сцене в качестве гитариста",
            },
        ]).write();
        req.flash("msgskill", "Данные обновлены!");
    }
    return res.redirect("/admin");
};

module.exports.products = (req, res, next) => {
    let form = new formidable.IncomingForm();
    let upload = path.join("./public", "upload");
    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
    }
    form.uploadDir = path.join(process.cwd(), upload);
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return next(err);
        }
        const { name: title, price } = fields;
        const { name, size, path: photoPath } = files.photo;
        const error = validation.validPoductForm(title, price, name, size);
        try {
            if (error) {
                await unlink(photoPath);
                throw new Error(error);
            }
            let fileName = path.join(form.uploadDir, name);
            const errUpload = await rename(photoPath, fileName);
            if (errUpload)
                throw new Error("При загрузке фото произошла ошибка!");
            if (!db.has("products").value()) db.set("products", []).write();
            db.get("products")
                .push({
                    name: title,
                    price,
                    src: path.join("upload", name),
                })
                .write();
            req.flash("msgfile", "Продукт сохранен!");
        } catch (err) {
            req.flash("msgfile", err.message);
        }
        return res.redirect("/admin");
    });
};
