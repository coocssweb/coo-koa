/**
 * 管理员表
 * Created by 王佳欣 on 2018/4/28.
 */
import Mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import { validate, encrypt } from '../../utils/encryption';

// 定义模式
let AdministratorSchema = new Mongoose.Schema({
    administrator: {
        type: String,
        unique: true,
        require: true,
    },
    password: String,
    nickname: String,
    avatar: Object,
    status: Number
}, {
        versionKey: false
    });

// 新增之前的中间件
AdministratorSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await encrypt(this.password);
    }

    next();
});

// 方法
AdministratorSchema.methods = {
    comparePassword: async function (password) {
        return await validate(password, this.password);
    }
};

// 静态查询方法
AdministratorSchema.statics = {
    fetch: function (query, skip, limit) {
        return this.find({ ...query }, { password: 0 }).skip(skip).limit(limit).sort('meta.updateAt');
    },
    findByName: function (name, checkPwd = false) {
        let options = {
            meta: 0
        };

        if (!checkPwd) {
            options.password = 0;
        }
        return this.findOne({ administrator: name }, options);
    },
    findById: function (id) {
        return this.findOne({ _id: ObjectID(id) }, { password: 0, meta: 0 });
    }
};

module.exports = AdministratorSchema;