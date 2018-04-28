/**
 * 管理员表
 * Created by 王佳欣 on 2018/4/28.
 */
import Mongoose from 'mongoose';
import {validate, encrypt} from '../../utils/passport';

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
    token: String,
    status: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// 新增之前的中间件
AdministratorSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await encrypt(this.password);
    }

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
});

// 静态查询方法
AdministratorSchema.statics = {
    fetch: function() {
        return this.find({}).sort('meta.updateAt').exec();
    },
    findByName: function(name) {
        console.log(name);
        return this.findOne({administrator: name}).exec();
    },
    comparePassword: function (password) {
        return validate(password, this.password);
    }
};

module.exports = AdministratorSchema;