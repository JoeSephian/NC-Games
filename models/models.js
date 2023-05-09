const db = require("../db/connection");

exports.allCategories = () => {
    return db.query(`
    SELECT slug, description FROM categories;
    `)
    .then(({rows}) => {
        return rows
    })
}
