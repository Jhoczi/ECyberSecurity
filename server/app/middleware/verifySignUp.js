const db = require("../models");
var Roles = db.roles;
var User = db.users;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(409).send({
                message: 'Failed! Username is already in use!'
            });
        }
        return;
    });

    User.findOne({
        where: {
            username: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(422).send({
                message: 'Failed! Email is already in use!'
            });
            return;
        }
        next();
    });
};

checkRoleExisted = (req, res, next) => {
    if (req.body.role) {
        if (!Roles.includes(req.body.role)) {
            res.status(409).send({
                message: 'Failed! Role does not exist = ' + req.body.role
            });
            return;
        }
    }
    next();
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRoleExisted: checkRoleExisted
};

module.exports = verifySignUp;