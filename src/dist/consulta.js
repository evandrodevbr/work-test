"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.fetchOrderedDataFromDB = exports.fetchDataFromDB = exports.saveData = exports.fetchData = exports.fetchAndSaveData = void 0;
var axios_1 = require("axios");
var mongoose_1 = require("mongoose");
var postSchema = new mongoose_1["default"].Schema({
    id: String,
    title: String,
    author_fullname: String,
    created_utc: { type: Number, index: true },
    created_date: String,
    ups: { type: Number, index: true },
    num_comments: { type: Number, index: true }
});
var Post = mongoose_1["default"].model('Post', postSchema);
var mongoConnection = null;
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!mongoConnection) return [3 /*break*/, 2];
                    return [4 /*yield*/, mongoose_1["default"].connect('mongodb://localhost:27017/redditData')];
                case 1:
                    _a.sent();
                    mongoConnection = mongoose_1["default"].connection;
                    console.log('Connected to MongoDB');
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function disconnectFromMongoDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mongoConnection) return [3 /*break*/, 2];
                    return [4 /*yield*/, mongoose_1["default"].disconnect()];
                case 1:
                    _a.sent();
                    mongoConnection = null;
                    console.log('Disconnected from MongoDB');
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function fetchAndSaveData() {
    return __awaiter(this, void 0, Promise, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetchData()];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, saveData(data)];
                case 2:
                    _a.sent();
                    console.log('Data fetched and saved successfully');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching and saving data:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchAndSaveData = fetchAndSaveData;
function fetchData() {
    return __awaiter(this, void 0, Promise, function () {
        var url, response, children, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = 'https://www.reddit.com/r/artificial/hot.json';
                    return [4 /*yield*/, axios_1["default"].get(url)];
                case 1:
                    response = _a.sent();
                    children = response.data.data.children;
                    return [2 /*return*/, children.map(function (child) { return ({
                            id: child.data.id,
                            title: child.data.title,
                            author_fullname: child.data.author_fullname,
                            created_utc: child.data.created_utc,
                            created_date: new Date(child.data.created_utc * 1000).toLocaleString('pt-BR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            ups: child.data.ups,
                            num_comments: child.data.num_comments
                        }); })];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching data from Reddit:', error_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.fetchData = fetchData;
function saveData(data) {
    return __awaiter(this, void 0, Promise, function () {
        var _i, data_1, item, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 9]);
                    return [4 /*yield*/, connectToMongoDB()];
                case 1:
                    _a.sent();
                    _i = 0, data_1 = data;
                    _a.label = 2;
                case 2:
                    if (!(_i < data_1.length)) return [3 /*break*/, 5];
                    item = data_1[_i];
                    return [4 /*yield*/, Post.findOneAndUpdate({ id: item.id }, item, { upsert: true, "new": true })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log('Data saved to MongoDB');
                    return [3 /*break*/, 9];
                case 6:
                    error_3 = _a.sent();
                    console.error('Error saving data to MongoDB:', error_3);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, disconnectFromMongoDB()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.saveData = saveData;
function fetchDataFromDB(startDate, endDate) {
    return __awaiter(this, void 0, Promise, function () {
        var posts, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 6]);
                    return [4 /*yield*/, connectToMongoDB()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Post.find({
                            created_utc: {
                                $gte: startDate.getTime() / 1000,
                                $lte: endDate.getTime() / 1000
                            }
                        }).sort({ created_utc: -1 })];
                case 2:
                    posts = _a.sent();
                    return [2 /*return*/, posts];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error fetching data from MongoDB:', error_4);
                    return [2 /*return*/, []];
                case 4: return [4 /*yield*/, disconnectFromMongoDB()];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.fetchDataFromDB = fetchDataFromDB;
function fetchOrderedDataFromDB(startDate, endDate, order) {
    return __awaiter(this, void 0, Promise, function () {
        var posts, error_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, 4, 6]);
                    return [4 /*yield*/, connectToMongoDB()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, Post.find({
                            created_utc: {
                                $gte: startDate.getTime() / 1000,
                                $lte: endDate.getTime() / 1000
                            }
                        }).sort((_a = {}, _a[order === 'ups' ? 'ups' : 'num_comments'] = -1, _a))];
                case 2:
                    posts = _b.sent();
                    return [2 /*return*/, posts];
                case 3:
                    error_5 = _b.sent();
                    console.error('Error fetching ordered data from MongoDB:', error_5);
                    return [2 /*return*/, []];
                case 4: return [4 /*yield*/, disconnectFromMongoDB()];
                case 5:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.fetchOrderedDataFromDB = fetchOrderedDataFromDB;
