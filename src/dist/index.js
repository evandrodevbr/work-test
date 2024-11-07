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
var mongoose_1 = require("mongoose");
var axios_1 = require("axios");
var node_cron_1 = require("node-cron");
// Inicialização do Express
var app = express_1["default"]();
var PORT = 3000;
// Middleware
app.use(helmet_1["default"]());
app.use(cors_1["default"]());
app.use(express_1["default"].json());
// Conexão com o MongoDB
mongoose_1["default"].connect('mongodb://localhost:27017/redditData')
    .then(function () {
    console.log('Conectado ao MongoDB');
})["catch"](function (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
});
var db = mongoose_1["default"].connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
var postSchema = new mongoose_1["default"].Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author_fullname: { type: String, required: true },
    created_utc: { type: Number, required: true, index: true },
    created_date: { type: String, required: true },
    ups: { type: Number, required: true, index: true },
    num_comments: { type: Number, required: true, index: true }
});
var Post = mongoose_1["default"].model('Post', postSchema);
// Função para buscar os dados do Reddit
function fetchData() {
    return __awaiter(this, void 0, Promise, function () {
        var url, response, children, error_1;
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
                    error_1 = _a.sent();
                    console.error('Erro ao buscar dados do Reddit:', error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Função para salvar os dados no MongoDB usando bulkWrite
function saveData(data) {
    return __awaiter(this, void 0, Promise, function () {
        var bulkOps, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (data.length === 0) {
                        console.log('Nenhum dado para salvar.');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    bulkOps = data.map(function (item) { return ({
                        updateOne: {
                            filter: { id: item.id },
                            update: { $set: item },
                            upsert: true // Criar um novo documento se ele não existir
                        }
                    }); });
                    return [4 /*yield*/, Post.bulkWrite(bulkOps)];
                case 2:
                    _a.sent(); // Executa todas as operações em lote
                    console.log('Todos os dados foram salvos no MongoDB com sucesso');
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    // Verificação se o erro é uma instância de Error
                    if (error_2 instanceof Error) {
                        console.error('Erro ao salvar os dados no MongoDB:', error_2.message);
                    }
                    else {
                        console.error('Erro desconhecido ao salvar os dados no MongoDB', error_2);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Função que busca e salva os dados
function fetchAndSaveData() {
    return __awaiter(this, void 0, Promise, function () {
        var data, error_3;
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
                    console.log('Dados buscados e salvos com sucesso');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Erro ao buscar e salvar os dados:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Função para gerar conteúdo HTML usando Tailwind CSS
function generateHtmlContent(data) {
    return __awaiter(this, void 0, Promise, function () {
        var postsHtml;
        return __generator(this, function (_a) {
            postsHtml = data.map(function (post) { return "\n    <li class=\"mb-6\">\n      <div class=\"bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105\">\n        <div class=\"mb-4\">\n          <h2 class=\"text-xl font-semibold\">" + post.title + "</h2>\n          <p class=\"text-sm text-gray-600\">Autor: " + post.author_fullname + "</p>\n          <p class=\"text-sm text-gray-600\">Publicado em: " + post.created_date + "</p>\n        </div>\n        <div class=\"flex justify-between items-center\">\n          <p class=\"text-sm font-medium text-blue-600\">Upvotes: <strong>" + post.ups + "</strong></p>\n          <p class=\"text-sm font-medium text-green-600\">Coment\u00E1rios: <strong>" + post.num_comments + "</strong></p>\n        </div>\n      </div>\n    </li>\n  "; }).join('');
            return [2 /*return*/, "\n    <!DOCTYPE html>\n    <html lang=\"pt-BR\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Posts Quentes do Reddit</title>\n      <script src=\"https://cdn.tailwindcss.com\"></script>\n    </head>\n    <body class=\"bg-gray-100 p-10\">\n      <h1 class=\"text-4xl font-bold mb-8\">Posts Quentes do r/artificial</h1>\n      <p class=\"text-lg mb-4\">N\u00FAmero de posts: " + data.length + "</p>\n      <button id=\"saveButton\" class=\"bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors\">Salvar Dados no MongoDB</button>\n      <p id=\"saveStatus\" class=\"mt-4 text-red-500\"></p>\n      <ul class=\"mt-6 space-y-4\">\n        " + postsHtml + "\n      </ul>\n      <script>\n        document.getElementById('saveButton').addEventListener('click', async () => {\n          const saveStatus = document.getElementById('saveStatus');\n          saveStatus.textContent = 'Salvando...';\n          try {\n            const response = await fetch('/save', { method: 'POST' });\n            if (response.ok) {\n              saveStatus.textContent = 'Dados salvos com sucesso!';\n              saveStatus.classList.remove('text-red-500');\n              saveStatus.classList.add('text-green-500');\n              console.log('Dados salvos com sucesso no MongoDB');\n            } else {\n              saveStatus.textContent = 'Erro ao salvar os dados.';\n              console.error('Erro no servidor ao tentar salvar os dados.');\n            }\n          } catch (error) {\n            saveStatus.textContent = 'Erro ao salvar os dados.';\n            console.error('Erro ao salvar os dados no MongoDB:', error);\n          }\n        });\n      </script>\n    </body>\n    </html>\n  "];
        });
    });
}
// Rota para salvar os dados no MongoDB
app.post('/save', function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var data, error_4;
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
                res.status(200).json({ message: 'Dados salvos com sucesso' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Erro ao salvar os dados:', error_4);
                res.status(500).json({ message: 'Erro ao salvar os dados' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Rota principal para exibir os posts
app.get('/', function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var data, htmlContent, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log('Buscando dados...');
                return [4 /*yield*/, fetchData()];
            case 1:
                data = _a.sent();
                console.log("Foram buscados " + data.length + " itens");
                return [4 /*yield*/, generateHtmlContent(data)];
            case 2:
                htmlContent = _a.sent();
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(htmlContent);
                console.log('Resposta enviada com sucesso');
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Erro ao gerar HTML:', error_5);
                res.status(500).send('Erro interno do servidor');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Middleware de tratamento de erros
app.use(function (err, req, res, next) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});
// Tarefa agendada com cron para rodar diariamente à meia-noite
node_cron_1["default"].schedule('0 0 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Executando tarefa diária de busca e salvamento de dados');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetchAndSaveData()];
            case 2:
                _a.sent();
                console.log('Tarefa diária concluída com sucesso');
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error('Erro na tarefa diária:', error_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
console.log('Tarefa cron agendada para rodar diariamente à meia-noite');
// Inicia o servidor
app.listen(PORT, function () {
    console.log("Servidor rodando em http://localhost:" + PORT);
});
