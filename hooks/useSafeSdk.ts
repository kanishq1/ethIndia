import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk';
import { useState, useEffect } from 'react';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import { ethers } from 'ethers';

const txServiceUrl = 'https://safe-transaction.polygon.gnosis.io/';

const useSafeSdk = (userSigner, safeAddress) => {
  const [safeSdk, setSafeSdk]: any = useState();
  const [safeFactory, setSafeFactory]: any = useState();
  const [safeService, setSafeClient]: any = useState();

  useEffect(() => {
    let isCurrent = true;

    const updateSafeSdk = async () => {
      if (!userSigner) return;
      try {
        const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: userSigner });
        console.log(ethAdapter);

        const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

        const factory = await SafeFactory.create({ ethAdapter });
        setSafeClient(safeService);
        setSafeFactory(factory);
        if (!safeAddress) {
          return null;
        }
        const safeSdk = await Safe.create({
          ethAdapter,
          safeAddress
        });
        if (isCurrent) {
          setSafeSdk(safeSdk);
        }
      } catch (error) {
        console.error(error);
      }
    };

    updateSafeSdk();

    return () => {
      isCurrent = false;
    };
  }, [userSigner, safeAddress]);

  return { safeSdk, safeFactory, safeService };
};

export default useSafeSdk;
