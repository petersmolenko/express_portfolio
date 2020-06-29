const fs = require("fs");
const util = require("util");
const path = require("path");
const read = fs.readFileSync;
const write = fs.writeFileSync;

module.exports = class {
    constructor(db) {
        this.dbDir = path.join(process.cwd(), db);
        this.read();
    }

    read() {
        try {
            this.dbBuffer = JSON.parse(read(this.dbDir, "utf-8"));
        } catch (error) {
            console.log(error);
        }
    }

    write() {
        try {
            write(this.dbDir, JSON.stringify(this.dbBuffer));
        } catch (error) {
            console.log(error);
        }
    }

    value() {
        return this.val;
    }

    getState() {
        try {
            return this.dbBuffer;
        } catch (error) {
            console.log(error);
        }
    }

    set(field, value) {
        this.dbBuffer[field] = value;
        return this;
    }

    get(field) {
        this.val = this.dbBuffer[field] ? this.dbBuffer[field] : null;
        return this;
    }

    has(field) {
        this.val = this.dbBuffer[field] ? true : false;
        return this;
    }

    push(value) {
        if (Array.isArray(this.val)) this.val.push(value);
        return this;
    }
};
