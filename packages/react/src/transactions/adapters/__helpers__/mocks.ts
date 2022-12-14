import { faker } from '@faker-js/faker';
import { TransactionError, TransactionRequestModel } from '@lens-protocol/domain/entities';
import {
  mockNonce,
  mockSignedProtocolCall,
  mockTransactionHash,
  mockTransactionRequestModel,
} from '@lens-protocol/domain/mocks';
import { ChainType, Result, success } from '@lens-protocol/shared-kernel';
import { mock } from 'jest-mock-extended';

import { ITransactionObserver, TransactionFactory } from '../../infrastructure/TransactionFactory';
import {
  AsyncRelayReceipt,
  DeferredMetaTransactionInit,
  DeferredNativeTransactionInit,
  MetaTransactionData,
  NativeTransactionData,
  RelayReceipt,
} from '../ITransactionFactory';

export function mockITransactionFactory(
  transactionObserver: ITransactionObserver = mock<ITransactionObserver>(),
) {
  // we create a TransactionFactory instance so to minimize the amount of mocking required,
  // although consumers can still rely solely on the ITransactionFactory interface
  return new TransactionFactory(transactionObserver);
}

export function mockRelayReceipt(): RelayReceipt {
  return {
    indexingId: faker.datatype.uuid(),
    txHash: mockTransactionHash(),
  };
}

export function mockAsyncRelayReceipt(
  result: Result<RelayReceipt, TransactionError>,
): AsyncRelayReceipt {
  return Promise.resolve(result);
}

export function mockDeferredMetaTransactionInit<T extends TransactionRequestModel>({
  request = mockTransactionRequestModel() as T,
  relayReceipt = mockRelayReceipt(),
}: { request?: T; relayReceipt?: RelayReceipt } = {}): DeferredMetaTransactionInit<T> {
  return {
    chainType: ChainType.ETHEREUM,
    signedCall: mockSignedProtocolCall(request),
    asyncRelayReceipt: mockAsyncRelayReceipt(success(relayReceipt)),
  };
}

export function mockDeferredNativeTransactionInit<T extends TransactionRequestModel>({
  request = mockTransactionRequestModel() as T,
  relayReceipt = mockRelayReceipt(),
}: { request?: T; relayReceipt?: RelayReceipt } = {}): DeferredNativeTransactionInit<T> {
  return {
    chainType: ChainType.ETHEREUM,
    id: faker.datatype.uuid(),
    request,
    asyncRelayReceipt: mockAsyncRelayReceipt(success(relayReceipt)),
  };
}

export function mockMetaTransactionData<T extends TransactionRequestModel>({
  request = mockTransactionRequestModel() as T,
  ...others
}: Partial<MetaTransactionData<T>> = {}): MetaTransactionData<T> {
  return {
    chainType: ChainType.ETHEREUM,
    id: faker.datatype.uuid(),
    indexingId: faker.datatype.uuid(),
    nonce: mockNonce(),
    request,
    txHash: mockTransactionHash(),
    ...others,
  };
}

export function mockNativeTransactionData<T extends TransactionRequestModel>({
  request = mockTransactionRequestModel() as T,
  ...others
}: Partial<NativeTransactionData<T>> = {}): NativeTransactionData<T> {
  return {
    chainType: ChainType.ETHEREUM,
    id: faker.datatype.uuid(),
    request,
    txHash: mockTransactionHash(),
    ...others,
  };
}
