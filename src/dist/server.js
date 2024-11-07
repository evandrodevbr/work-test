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
var express_1 = require("express");
var helmet_1 = require("helmet");
var cors_1 = require("cors");
var express_validator_1 = require("express-validator");
var mongoose_1 = require("mongoose");
var app = express_1["default"]();
var PORT = 3000;
// Middleware
app.use(helmet_1["default"]());
app.use(cors_1["default"]());
app.use(express_1["default"].json());
// MongoDB connection
mongoose_1["default"].connect('mongodb://localhost:27017/redditData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose_1["default"].connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});
var postSchema = new mongoose_1["default"].Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    author_fullname: { type: String, required: true },
    created_utc: { type: Number, required: true },
    created_date: { type: String, required: true },
    ups: { type: Number, required: true },
    num_comments: { type: Number, required: true }
});
var Post = mongoose_1["default"].model('Post', postSchema);
// Utility function to validate date range
var validateDateRange = function (startDate, endDate) {
    return !(isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate);
};
// Route: Consulta por Período e Ordem
app.get('/posts/ordered', [
    express_validator_1.query('startDate')
        .exists()
        .isISO8601()
        .withMessage('startDate must be a valid ISO 8601 date'),
    express_validator_1.query('endDate')
        .exists()
        .isISO8601()
        .withMessage('endDate must be a valid ISO 8601 date'),
    express_validator_1.query('order')
        .exists()
        .isIn(['ups', 'comments'])
        .withMessage('order must be either "ups" or "comments"')
], function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var errors, startDate, endDate, order, sortField, posts, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return [2 /*return*/];
                }
                startDate = new Date(req.query.startDate);
                endDate = new Date(req.query.endDate);
                order = req.query.order;
                // Validate date range
                if (!validateDateRange(startDate, endDate)) {
                    res.status(400).json({ error: 'Invalid date range or format' });
                    return [2 /*return*/];
                }
                sortField = order === 'ups' ? 'ups' : 'num_comments';
                return [4 /*yield*/, Post.find({
                        created_utc: {
                            $gte: startDate.getTime() / 1000,
                            $lte: endDate.getTime() / 1000
                        }
                    }).sort((_a = {}, _a[sortField] = -1, _a))];
            case 1:
                posts = _b.sent();
                res.json(posts);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Error handling middleware
app.use(function (err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start the server
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:" + PORT);
});
