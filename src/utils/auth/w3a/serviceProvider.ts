import type ThresholdKey  from '@tkey/default';
import { TorusServiceProvider } from "@tkey/service-provider-torus";
import { CustomAuthArgs } from "@toruslabs/customauth";

const web3AuthClientId = "BIMAQkspF4q7v2dOyZHY3lWnBHj_G3dWZnEBc8qkCsu96qsGP9jd_NFyusSdxTLd7l7pxlBHxhAeYcuSopN1Fz4";

const customAuthArgs: CustomAuthArgs = {
    web3AuthClientId,
    baseUrl: `${window.location.origin}/serviceworker`,
    network: "sapphire_devnet",
    uxMode: "popup",
};

export const serviceProvider = new TorusServiceProvider({
    enableLogging: false,
    customAuthArgs,
});

export const initServiceProvider = async (tkey: ThresholdKey) => {
    await tkey.serviceProvider.init({
        skipSw: true,
        skipPrefetch: true,
    })
};