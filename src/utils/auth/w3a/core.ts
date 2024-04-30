// import { SecurityQuestionsModule } from '@tkey/security-questions';
// import { TorusServiceProvider } from '@tkey/service-provider-torus';
// import type ThresholdKey from '@tkey/default';
// import { SeedPhraseModule } from '@tkey/seed-phrase';
// import { PrivateKeyModule } from '@tkey/private-keys';
// import type { ISeedPhraseFormat, ModuleMap, IPrivateKeyFormat } from '@tkey/common-types';
// import { generateID } from '@tkey/common-types';

// export enum SeedPhraseFormatType {
// 	PRIMARY = 'primary-seed-phrase',
// }

// export enum PrivateKeyFormatType {
//     PRIMARY = 'primary-private-key',
// }

// export const berrySeedPhraseFormat: Partial<ISeedPhraseFormat> = {
// 	type: SeedPhraseFormatType.PRIMARY,
// 	validateSeedPhrase: () => true,
// 	createSeedPhraseStore: async (seedPhrase) => {
// 		if (!seedPhrase) throw Error('seed phrase can not be empty');
// 		return {
// 			id: generateID(),
// 			type: SeedPhraseFormatType.PRIMARY,
// 			seedPhrase: seedPhrase,
// 		};
// 	},
// };

// export const berryPrivateKeyFormat: Partial<IPrivateKeyFormat> = {
//     type: PrivateKeyFormatType.PRIMARY,
//     validatePrivateKey: () => true,
//     createPrivateKeyStore: async (privateKey) => {
//         if (!privateKey) throw Error('private key can not be empty');
//         return {
//             id: generateID(),
//             type: PrivateKeyFormatType.PRIMARY,
//             privateKey: privateKey,
//         };
//     },
// };

// export type CoreModules = ModuleMap & {
//     seedPhraseModule: SeedPhraseModule;
//     privateKeyModule: PrivateKeyModule;
//     securityQuestionsModule: SecurityQuestionsModule;
// }

// export const coreModule: CoreModules = {
//     seedPhraseModule: new SeedPhraseModule([berrySeedPhraseFormat as ISeedPhraseFormat]),
//     privateKeyModule: new PrivateKeyModule([berryPrivateKeyFormat as IPrivateKeyFormat]),
//     securityQuestionsModule: new SecurityQuestionsModule(),
// };

// export type CoreThresholdKey = ThresholdKey & {
//     serviceProvider: TorusServiceProvider;
//     modules: CoreModules;
// }