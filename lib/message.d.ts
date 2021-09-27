/// <reference types="node" />
import { Any } from 'google-protobuf/google/protobuf/any_pb';
import { MsgRequestData as MsgRequestDataProto } from '../proto/oracle/v1/tx_pb';
import { MsgSend as MsgSendProto } from '../proto/cosmos/bank/v1beta1/tx_pb';
import { MsgDelegate as MsgDelegateProto, MsgUndelegate as MsgUndelegateProto, MsgBeginRedelegate as MsgBeginRedelegateProto } from '../proto/cosmos/staking/v1beta1/tx_pb';
import { MsgWithdrawDelegatorReward as MsgWithdrawDelegatorRewardProto } from '../proto/cosmos/distribution/v1beta1/tx_pb';
import { Coin } from '../proto/cosmos/base/v1beta1/coin_pb';
import { Message as JSPBMesage } from 'google-protobuf';
export interface BaseMsg extends JSPBMesage {
    toJSON(): object;
    toAny(): Any;
}
export declare class MsgRequestData extends MsgRequestDataProto implements BaseMsg {
    constructor(oracleScriptId: number, calldata: Buffer, askCount: number, minCount: number, clientId: string, sender: string, feeLimitList?: Coin[], prepareGas?: number, executeGas?: number);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgSend extends MsgSendProto implements BaseMsg {
    constructor(from: string, to: string, amountList: Coin[]);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgDelegate extends MsgDelegateProto implements BaseMsg {
    constructor(delegator: string, validator: string, amount: Coin);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgUndelegate extends MsgUndelegateProto implements BaseMsg {
    constructor(delegator: string, validator: string, amount: Coin);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgBeginRedelegate extends MsgBeginRedelegateProto implements BaseMsg {
    constructor(delegator: string, srcValidator: string, dstValidator: string, amount: Coin);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgWithdrawDelegatorReward extends MsgWithdrawDelegatorRewardProto implements BaseMsg {
    constructor(delegator: string, validator: string);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
