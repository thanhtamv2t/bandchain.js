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
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_web_node_http_transport_1 = require("@improbable-eng/grpc-web-node-http-transport");
const error_1 = require("./error");
const query_pb_service_1 = require("../proto/oracle/v1/query_pb_service");
const query_pb_service_2 = require("../proto/cosmos/base/tendermint/v1beta1/query_pb_service");
const query_pb_service_3 = require("../proto/cosmos/auth/v1beta1/query_pb_service");
const service_pb_service_1 = require("../proto/cosmos/tx/v1beta1/service_pb_service");
const query_pb_1 = require("../proto/oracle/v1/query_pb");
const query_pb_2 = require("../proto/cosmos/base/tendermint/v1beta1/query_pb");
const query_pb_3 = require("../proto/cosmos/auth/v1beta1/query_pb");
const service_pb_1 = require("../proto/cosmos/tx/v1beta1/service_pb");
const service_pb_2 = require("../proto/cosmos/tx/v1beta1/service_pb");
const auth_pb_1 = require("../proto/cosmos/auth/v1beta1/auth_pb");
class Client {
    constructor(grpcUrl, transporter = grpc_web_node_http_transport_1.NodeHttpTransport) {
        this.queryClient = new query_pb_service_1.QueryClient(grpcUrl, {
            transport: transporter(),
        });
        this.serviceClient = new query_pb_service_2.ServiceClient(grpcUrl, {
            transport: transporter(),
        });
        this.authQueryClient = new query_pb_service_3.QueryClient(grpcUrl, {
            transport: transporter(),
        });
        this.txServiceClient = new service_pb_service_1.ServiceClient(grpcUrl, {
            transport: transporter(),
        });
    }
    getDataSource(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(id))
                throw new error_1.NotIntegerError('id is not an integer');
            const request = new query_pb_1.QueryDataSourceRequest();
            request.setDataSourceId(id);
            return new Promise((resolve, reject) => {
                this.queryClient.dataSource(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null && response.hasDataSource()) {
                        resolve(response.getDataSource().toObject());
                        return;
                    }
                    reject(new error_1.NotFoundError(`data source with ID ${id} does not exist`));
                });
            });
        });
    }
    getOracleScript(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(id))
                throw new error_1.NotIntegerError('id is not an integer');
            const request = new query_pb_1.QueryOracleScriptRequest();
            request.setOracleScriptId(id);
            return new Promise((resolve, reject) => {
                this.queryClient.oracleScript(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null && response.hasOracleScript()) {
                        resolve(response.getOracleScript().toObject());
                        return;
                    }
                    reject(new error_1.NotFoundError(`oracle script with ID ${id} does not exist`));
                });
            });
        });
    }
    getRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(id))
                throw new error_1.NotIntegerError('id is not an integer');
            const request = new query_pb_1.QueryRequestRequest();
            request.setRequestId(id);
            return new Promise((resolve, reject) => {
                this.queryClient.request(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null) {
                        resolve(response.toObject());
                    }
                });
            });
        });
    }
    getReporters(validator) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new query_pb_1.QueryReportersRequest();
            request.setValidatorAddress(validator);
            return new Promise((resolve, reject) => {
                this.queryClient.reporters(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null) {
                        resolve(response.getReporterList());
                    }
                });
            });
        });
    }
    getLatestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new query_pb_2.GetLatestBlockRequest();
            return new Promise((resolve, reject) => {
                this.serviceClient.getLatestBlock(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null) {
                        resolve(response.toObject());
                    }
                });
            });
        });
    }
    getAccount(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new query_pb_3.QueryAccountRequest();
            request.setAddress(address);
            return new Promise((resolve, reject) => {
                this.authQueryClient.account(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null && response.hasAccount()) {
                        let accBaseAccount = response
                            .getAccount()
                            .unpack(auth_pb_1.BaseAccount.deserializeBinary, 'cosmos.auth.v1beta1.BaseAccount');
                        if (accBaseAccount !== null) {
                            resolve(accBaseAccount.toObject());
                            return;
                        }
                        reject(new error_1.ValueError(`only base account allowed, expected BaseAccount, got ${response
                            .getAccount()
                            .getTypeName()}`));
                    }
                });
            });
        });
    }
    getRequestIdByTxHash(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new service_pb_1.GetTxRequest();
            request.setHash(txHash);
            return new Promise((resolve, reject) => {
                this.txServiceClient.getTx(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response === null || !response.hasTxResponse()) {
                        reject(new error_1.NotFoundError('the given tx hash does not exists'));
                    }
                    let reqIdList = [];
                    response.toObject().txResponse.logsList.forEach((txLog) => {
                        txLog.eventsList.forEach((event) => {
                            if (event.type === 'report' || event.type === 'request') {
                                event.attributesList.forEach((attribute) => {
                                    if (attribute.key === 'id') {
                                        reqIdList.push(Number(attribute.value));
                                    }
                                });
                            }
                        });
                    });
                    if (reqIdList.length === 0) {
                        reject(new error_1.NotFoundError('request ID is not found in given transaction hash'));
                        return;
                    }
                    resolve(reqIdList);
                });
            });
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            const latestBlock = yield this.getLatestBlock();
            return latestBlock.block.header.chainId;
        });
    }
    sendTxSyncMode(txBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new service_pb_2.BroadcastTxRequest();
            request.setTxBytes(txBytes);
            request.setMode(2);
            return new Promise((resolve, reject) => {
                this.txServiceClient.broadcastTx(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null && response.hasTxResponse()) {
                        resolve(response.getTxResponse().toObject());
                    }
                });
            });
        });
    }
    sendTxAsyncMode(txBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new service_pb_2.BroadcastTxRequest();
            request.setTxBytes(txBytes);
            request.setMode(3);
            return new Promise((resolve, reject) => {
                this.txServiceClient.broadcastTx(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null && response.hasTxResponse()) {
                        resolve(response.getTxResponse().toObject());
                    }
                });
            });
        });
    }
    sendTxBlockMode(txBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new service_pb_2.BroadcastTxRequest();
            request.setTxBytes(txBytes);
            request.setMode(1);
            return new Promise((resolve, reject) => {
                this.txServiceClient.broadcastTx(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null && response.hasTxResponse()) {
                        resolve(response.getTxResponse().toObject());
                    }
                });
            });
        });
    }
    getReferenceData(pairs, minCount, askCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new query_pb_1.QueryRequestPriceRequest();
            let symbolSet = new Set();
            pairs.forEach((pair) => {
                let symbols = pair.split('/');
                symbols.forEach((symbol) => {
                    if (symbol === 'USD')
                        return;
                    symbolSet.add(symbol);
                });
            });
            request.setSymbolsList(Array.from(symbolSet));
            request.setAskCount(askCount);
            request.setMinCount(minCount);
            return new Promise((resolve, reject) => {
                this.queryClient.requestPrice(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    const finalResult = [];
                    const symbolMap = {};
                    symbolMap['USD'] = {
                        symbol: 'USD',
                        multiplier: 1000000000,
                        px: 1000000000,
                        requestId: 0,
                        resolveTime: Math.floor(Date.now() / 1000),
                    };
                    response.toObject().priceResultsList.forEach((priceResult) => {
                        symbolMap[priceResult.symbol] = priceResult;
                    });
                    pairs.forEach((pair) => {
                        let [baseSymbol, quoteSymbol] = pair.split('/');
                        finalResult.push({
                            pair,
                            rate: (Number(symbolMap[baseSymbol].px) *
                                Number(symbolMap[quoteSymbol].multiplier)) /
                                (Number(symbolMap[quoteSymbol].px) *
                                    Number(symbolMap[baseSymbol].multiplier)),
                            updatedAt: {
                                base: Number(symbolMap[baseSymbol].resolveTime),
                                quote: Number(symbolMap[quoteSymbol].resolveTime),
                            },
                            requestId: {
                                base: Number(symbolMap[baseSymbol].requestId),
                                quote: Number(symbolMap[quoteSymbol].requestId),
                            },
                        });
                    });
                    resolve(finalResult);
                });
            });
        });
    }
    getLatestRequest(oid, calldata, minCount, askCount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(oid))
                throw new error_1.NotIntegerError('oid is not an integer');
            if (!Number.isInteger(minCount))
                throw new error_1.NotIntegerError('minCount is not an integer');
            if (!Number.isInteger(askCount))
                throw new error_1.NotIntegerError('askCount is not an integer');
            const request = new query_pb_1.QueryRequestSearchRequest();
            request.setOracleScriptId(oid);
            request.setCalldata(calldata);
            request.setAskCount(askCount);
            request.setMinCount(minCount);
            return new Promise((resolve, reject) => {
                this.queryClient.requestSearch(request, {}, (err, response) => {
                    if (err !== null) {
                        reject(err);
                        return;
                    }
                    if (response !== null && response.hasRequest()) {
                        resolve(response.getRequest().toObject());
                        return;
                    }
                    reject(new error_1.NotFoundError('request not found'));
                });
            });
        });
    }
}
exports.default = Client;
