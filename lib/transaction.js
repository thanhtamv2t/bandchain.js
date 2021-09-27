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
const constant_1 = require("./constant");
const error_1 = require("./error");
const utils_1 = require("./utils");
const tx_pb_1 = require("../proto/cosmos/tx/v1beta1/tx_pb");
const signing_pb_1 = require("../proto/cosmos/tx/signing/v1beta1/signing_pb");
const any_pb_1 = require("google-protobuf/google/protobuf/any_pb");
const tx_pb_2 = require("../proto/cosmos/tx/v1beta1/tx_pb");
class Transaction {
    constructor() {
        this.msgs = [];
        this.fee = new tx_pb_2.Fee();
        this.memo = '';
    }
    withMessages(...msg) {
        this.msgs.push(...msg);
        return this;
    }
    withSender(client, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.msgs.length === 0) {
                throw new error_1.EmptyMsgError('Message is empty, please use withMessages at least 1 message.');
            }
            let account = yield client.getAccount(sender);
            if (!account) {
                throw new error_1.NotFoundError(`Account doesn't exist.`);
            }
            this.accountNum = account.accountNumber;
            this.sequence = account.sequence;
            return this;
        });
    }
    withAccountNum(accountNum) {
        if (!Number.isInteger(accountNum)) {
            throw new error_1.NotIntegerError('accountNum is not an integer');
        }
        this.accountNum = accountNum;
        return this;
    }
    withSequence(sequence) {
        if (!Number.isInteger(sequence)) {
            throw new error_1.NotIntegerError('sequence is not an integer');
        }
        this.sequence = sequence;
        return this;
    }
    withChainId(chainId) {
        this.chainId = chainId;
        return this;
    }
    withFee(fee) {
        this.fee = fee;
        return this;
    }
    withMemo(memo) {
        if (memo.length > constant_1.MAX_MEMO_CHARACTERS) {
            throw new error_1.ValueTooLargeError('memo is too large.');
        }
        this.memo = memo;
        return this;
    }
    getInfo(publicKey, signMode) {
        let txBody = new tx_pb_1.TxBody();
        txBody.setMessagesList(this.msgs.map((msg) => msg.toAny()));
        txBody.setMemo(this.memo);
        let txBodyBytes = txBody.serializeBinary();
        let modeInfo = new tx_pb_1.ModeInfo();
        let modeSingle = new tx_pb_1.ModeInfo.Single();
        modeSingle.setMode(signMode);
        modeInfo.setSingle(modeSingle);
        let publicKeyAny = new any_pb_1.Any();
        publicKeyAny.pack(publicKey.toPubkeyProto().serializeBinary(), 'cosmos.crypto.secp256k1.PubKey', '/');
        let signerInfo = new tx_pb_1.SignerInfo();
        signerInfo.setModeInfo(modeInfo);
        signerInfo.setSequence(this.sequence);
        signerInfo.setPublicKey(publicKeyAny);
        let authInfo = new tx_pb_1.AuthInfo();
        authInfo.addSignerInfos(signerInfo);
        authInfo.setFee(this.fee);
        let authInfoBytes = authInfo.serializeBinary();
        return [txBodyBytes, authInfoBytes];
    }
    getSignDoc(publicKey) {
        if (this.msgs.length === 0) {
            throw new error_1.EmptyMsgError('message is empty');
        }
        if (this.accountNum === undefined) {
            throw new error_1.UndefinedError('accountNum should be defined');
        }
        if (this.sequence === undefined) {
            throw new error_1.UndefinedError('sequence should be defined');
        }
        if (this.chainId === undefined) {
            throw new error_1.UndefinedError('chainId should be defined');
        }
        const [txBodyBytes, authInfoBytes] = this.getInfo(publicKey, signing_pb_1.SignMode.SIGN_MODE_DIRECT);
        let signDoc = new tx_pb_1.SignDoc();
        signDoc.setBodyBytes(txBodyBytes);
        signDoc.setAuthInfoBytes(authInfoBytes);
        signDoc.setChainId(this.chainId);
        signDoc.setAccountNumber(this.accountNum);
        return signDoc.serializeBinary();
    }
    getTxData(signature, publicKey, signMode = signing_pb_1.SignMode.SIGN_MODE_DIRECT) {
        const [txBodyBytes, authInfoBytes] = this.getInfo(publicKey, signMode);
        let txRaw = new tx_pb_1.TxRaw();
        txRaw.setBodyBytes(txBodyBytes);
        txRaw.setAuthInfoBytes(authInfoBytes);
        txRaw.addSignatures(signature);
        return txRaw.serializeBinary();
    }
    getSignMessage() {
        return Buffer.from(utils_1.sortAndStringify({
            account_number: this.accountNum.toString(),
            chain_id: this.chainId,
            fee: {
                amount: this.fee.getAmountList().map(coin => coin.toObject()),
                gas: this.fee.getGasLimit().toString(),
            },
            memo: this.memo,
            msgs: this.msgs.map((msg) => msg.toJSON()),
            sequence: this.sequence.toString(),
        }));
    }
}
exports.default = Transaction;
