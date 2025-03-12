import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "approved": indexed(p.address), "tokenId": indexed(p.uint256)}),
    ApprovalForAll: event("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", "ApprovalForAll(address,address,bool)", {"owner": indexed(p.address), "operator": indexed(p.address), "approved": p.bool}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "tokenId": indexed(p.uint256)}),
}

export const functions = {
    BAYC_PROVENANCE: viewFun("0x607e20e3", "BAYC_PROVENANCE()", {}, p.string),
    MAX_APES: viewFun("0xbb8a16bd", "MAX_APES()", {}, p.uint256),
    REVEAL_TIMESTAMP: viewFun("0x18e20a38", "REVEAL_TIMESTAMP()", {}, p.uint256),
    apePrice: viewFun("0x7a3f451e", "apePrice()", {}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"to": p.address, "tokenId": p.uint256}, ),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"owner": p.address}, p.uint256),
    baseURI: viewFun("0x6c0360eb", "baseURI()", {}, p.string),
    emergencySetStartingIndexBlock: fun("0x7d17fcbe", "emergencySetStartingIndexBlock()", {}, ),
    flipSaleState: fun("0x34918dfd", "flipSaleState()", {}, ),
    getApproved: viewFun("0x081812fc", "getApproved(uint256)", {"tokenId": p.uint256}, p.address),
    isApprovedForAll: viewFun("0xe985e9c5", "isApprovedForAll(address,address)", {"owner": p.address, "operator": p.address}, p.bool),
    maxApePurchase: viewFun("0x571dff3b", "maxApePurchase()", {}, p.uint256),
    mintApe: fun("0xa723533e", "mintApe(uint256)", {"numberOfTokens": p.uint256}, ),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    ownerOf: viewFun("0x6352211e", "ownerOf(uint256)", {"tokenId": p.uint256}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    reserveApes: fun("0xb0f67427", "reserveApes()", {}, ),
    'safeTransferFrom(address,address,uint256)': fun("0x42842e0e", "safeTransferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "tokenId": p.uint256}, ),
    'safeTransferFrom(address,address,uint256,bytes)': fun("0xb88d4fde", "safeTransferFrom(address,address,uint256,bytes)", {"from": p.address, "to": p.address, "tokenId": p.uint256, "_data": p.bytes}, ),
    saleIsActive: viewFun("0xeb8d2444", "saleIsActive()", {}, p.bool),
    setApprovalForAll: fun("0xa22cb465", "setApprovalForAll(address,bool)", {"operator": p.address, "approved": p.bool}, ),
    setBaseURI: fun("0x55f804b3", "setBaseURI(string)", {"baseURI": p.string}, ),
    setProvenanceHash: fun("0x10969523", "setProvenanceHash(string)", {"provenanceHash": p.string}, ),
    setRevealTimestamp: fun("0x018a2c37", "setRevealTimestamp(uint256)", {"revealTimeStamp": p.uint256}, ),
    setStartingIndex: fun("0xe9866550", "setStartingIndex()", {}, ),
    startingIndex: viewFun("0xcb774d47", "startingIndex()", {}, p.uint256),
    startingIndexBlock: viewFun("0xe36d6498", "startingIndexBlock()", {}, p.uint256),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    tokenByIndex: viewFun("0x4f6ccce7", "tokenByIndex(uint256)", {"index": p.uint256}, p.uint256),
    tokenOfOwnerByIndex: viewFun("0x2f745c59", "tokenOfOwnerByIndex(address,uint256)", {"owner": p.address, "index": p.uint256}, p.uint256),
    tokenURI: viewFun("0xc87b56dd", "tokenURI(uint256)", {"tokenId": p.uint256}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "tokenId": p.uint256}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    withdraw: fun("0x3ccfd60b", "withdraw()", {}, ),
}

export class Contract extends ContractBase {

    BAYC_PROVENANCE() {
        return this.eth_call(functions.BAYC_PROVENANCE, {})
    }

    MAX_APES() {
        return this.eth_call(functions.MAX_APES, {})
    }

    REVEAL_TIMESTAMP() {
        return this.eth_call(functions.REVEAL_TIMESTAMP, {})
    }

    apePrice() {
        return this.eth_call(functions.apePrice, {})
    }

    balanceOf(owner: BalanceOfParams["owner"]) {
        return this.eth_call(functions.balanceOf, {owner})
    }

    baseURI() {
        return this.eth_call(functions.baseURI, {})
    }

    getApproved(tokenId: GetApprovedParams["tokenId"]) {
        return this.eth_call(functions.getApproved, {tokenId})
    }

    isApprovedForAll(owner: IsApprovedForAllParams["owner"], operator: IsApprovedForAllParams["operator"]) {
        return this.eth_call(functions.isApprovedForAll, {owner, operator})
    }

    maxApePurchase() {
        return this.eth_call(functions.maxApePurchase, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    ownerOf(tokenId: OwnerOfParams["tokenId"]) {
        return this.eth_call(functions.ownerOf, {tokenId})
    }

    saleIsActive() {
        return this.eth_call(functions.saleIsActive, {})
    }

    startingIndex() {
        return this.eth_call(functions.startingIndex, {})
    }

    startingIndexBlock() {
        return this.eth_call(functions.startingIndexBlock, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    tokenByIndex(index: TokenByIndexParams["index"]) {
        return this.eth_call(functions.tokenByIndex, {index})
    }

    tokenOfOwnerByIndex(owner: TokenOfOwnerByIndexParams["owner"], index: TokenOfOwnerByIndexParams["index"]) {
        return this.eth_call(functions.tokenOfOwnerByIndex, {owner, index})
    }

    tokenURI(tokenId: TokenURIParams["tokenId"]) {
        return this.eth_call(functions.tokenURI, {tokenId})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type BAYC_PROVENANCEParams = FunctionArguments<typeof functions.BAYC_PROVENANCE>
export type BAYC_PROVENANCEReturn = FunctionReturn<typeof functions.BAYC_PROVENANCE>

export type MAX_APESParams = FunctionArguments<typeof functions.MAX_APES>
export type MAX_APESReturn = FunctionReturn<typeof functions.MAX_APES>

export type REVEAL_TIMESTAMPParams = FunctionArguments<typeof functions.REVEAL_TIMESTAMP>
export type REVEAL_TIMESTAMPReturn = FunctionReturn<typeof functions.REVEAL_TIMESTAMP>

export type ApePriceParams = FunctionArguments<typeof functions.apePrice>
export type ApePriceReturn = FunctionReturn<typeof functions.apePrice>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BaseURIParams = FunctionArguments<typeof functions.baseURI>
export type BaseURIReturn = FunctionReturn<typeof functions.baseURI>

export type EmergencySetStartingIndexBlockParams = FunctionArguments<typeof functions.emergencySetStartingIndexBlock>
export type EmergencySetStartingIndexBlockReturn = FunctionReturn<typeof functions.emergencySetStartingIndexBlock>

export type FlipSaleStateParams = FunctionArguments<typeof functions.flipSaleState>
export type FlipSaleStateReturn = FunctionReturn<typeof functions.flipSaleState>

export type GetApprovedParams = FunctionArguments<typeof functions.getApproved>
export type GetApprovedReturn = FunctionReturn<typeof functions.getApproved>

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>

export type MaxApePurchaseParams = FunctionArguments<typeof functions.maxApePurchase>
export type MaxApePurchaseReturn = FunctionReturn<typeof functions.maxApePurchase>

export type MintApeParams = FunctionArguments<typeof functions.mintApe>
export type MintApeReturn = FunctionReturn<typeof functions.mintApe>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type ReserveApesParams = FunctionArguments<typeof functions.reserveApes>
export type ReserveApesReturn = FunctionReturn<typeof functions.reserveApes>

export type SafeTransferFromParams_0 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256)']>
export type SafeTransferFromReturn_0 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256)']>

export type SafeTransferFromParams_1 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>
export type SafeTransferFromReturn_1 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>

export type SaleIsActiveParams = FunctionArguments<typeof functions.saleIsActive>
export type SaleIsActiveReturn = FunctionReturn<typeof functions.saleIsActive>

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>

export type SetBaseURIParams = FunctionArguments<typeof functions.setBaseURI>
export type SetBaseURIReturn = FunctionReturn<typeof functions.setBaseURI>

export type SetProvenanceHashParams = FunctionArguments<typeof functions.setProvenanceHash>
export type SetProvenanceHashReturn = FunctionReturn<typeof functions.setProvenanceHash>

export type SetRevealTimestampParams = FunctionArguments<typeof functions.setRevealTimestamp>
export type SetRevealTimestampReturn = FunctionReturn<typeof functions.setRevealTimestamp>

export type SetStartingIndexParams = FunctionArguments<typeof functions.setStartingIndex>
export type SetStartingIndexReturn = FunctionReturn<typeof functions.setStartingIndex>

export type StartingIndexParams = FunctionArguments<typeof functions.startingIndex>
export type StartingIndexReturn = FunctionReturn<typeof functions.startingIndex>

export type StartingIndexBlockParams = FunctionArguments<typeof functions.startingIndexBlock>
export type StartingIndexBlockReturn = FunctionReturn<typeof functions.startingIndexBlock>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TokenByIndexParams = FunctionArguments<typeof functions.tokenByIndex>
export type TokenByIndexReturn = FunctionReturn<typeof functions.tokenByIndex>

export type TokenOfOwnerByIndexParams = FunctionArguments<typeof functions.tokenOfOwnerByIndex>
export type TokenOfOwnerByIndexReturn = FunctionReturn<typeof functions.tokenOfOwnerByIndex>

export type TokenURIParams = FunctionArguments<typeof functions.tokenURI>
export type TokenURIReturn = FunctionReturn<typeof functions.tokenURI>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

