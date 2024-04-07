import { createPublicClient, createWalletClient, http, PrivateKeyAccount, SimulateContractReturnType } from 'viem';
import { printError, printInfo, printSuccess } from '../../data/logger/logPrinter';
import { Config, TelepathyConfig } from '../../config';
import { gnosis, mainnet } from 'viem/chains';
import {
    generateRandomString,
    goerliChainData,
    mailBoxContractAddress,
    telepathyContractAddress,
} from './telepathyData';
import { telepathyABI } from '../../abis/telepathy';
import { checkGwei } from '../../data/gweiChecker/gweiChecker';

export async function sendMailEthereum(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль Telepathy from Ethereum`);

    const randomMessage = generateRandomString(TelepathyConfig.messageLength.min, TelepathyConfig.messageLength.max);

    const hexRepr = '0x' + Buffer.from(randomMessage, 'utf8').toString('hex');

    const randomChainData =
        TelepathyConfig.chainDstData[Math.floor(Math.random() * TelepathyConfig.chainDstData.length)];

    printInfo(`Буду производить send mail Ethereum -> ${randomChainData.chainName}, message: ${randomMessage}`);

    const client = createPublicClient({
        chain: mainnet,
        transport: Config.ethereumRpc == '' ? http() : http(Config.ethereumRpc),
    });

    await checkGwei();

    printInfo(`Произвожу send mail Ethereum -> ${randomChainData.chainName}, message: ${randomMessage}`);

    const walletClient = createWalletClient({
        chain: mainnet,
        transport: Config.ethereumRpc == '' ? http() : http(Config.ethereumRpc),
    });

    const { request } = await client
        .simulateContract({
            address: telepathyContractAddress,
            abi: telepathyABI,
            functionName: 'sendMail',
            args: [randomChainData.chainId, mailBoxContractAddress, hexRepr],
            account: account,
        })
        .then((result) => result as SimulateContractReturnType)
        .catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля Telepathy - ${e}`);
            return { request: undefined };
        });

    if (request !== undefined) {
        const hash = await walletClient.writeContract(request).catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля Telepathy - ${e}`);
            return false;
        });

        if (hash == false) {
            return false;
        }

        const url = `${mainnet.blockExplorers?.default.url + '/tx/' + hash}`;

        printSuccess(`Транзакция успешно отправлена. Хэш транзакции: ${url}\n`);
    }

    return true;
}

export async function sendMailGnosis(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль Telepathy from Gnosis`);

    const randomMessage = generateRandomString(TelepathyConfig.messageLength.min, TelepathyConfig.messageLength.max);

    const hexRepr = '0x' + Buffer.from(randomMessage, 'utf8').toString('hex');

    printInfo(`Буду производить send mail Gnosis -> ${goerliChainData.chainName}, message: ${randomMessage}`);

    const client = createPublicClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });

    printInfo(`Произвожу send mail Gnosis -> ${goerliChainData.chainName}, message: ${randomMessage}`);

    const walletClient = createWalletClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });

    const { request } = await client
        .simulateContract({
            address: telepathyContractAddress,
            abi: telepathyABI,
            functionName: 'sendMail',
            args: [goerliChainData.chainId, mailBoxContractAddress, hexRepr],
            account: account,
        })
        .then((result) => result as SimulateContractReturnType)
        .catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля Telepathy - ${e}`);
            return { request: undefined };
        });

    if (request !== undefined) {
        const hash = await walletClient.writeContract(request).catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля Telepathy - ${e}`);
            return false;
        });

        if (hash == false) {
            return false;
        }

        const url = `${gnosis.blockExplorers?.default.url + '/tx/' + hash}`;

        printSuccess(`Транзакция успешно отправлена. Хэш транзакции: ${url}\n`);
    }

    return true;
}
