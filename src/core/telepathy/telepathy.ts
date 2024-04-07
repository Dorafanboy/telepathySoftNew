import { createPublicClient, createWalletClient, http, PrivateKeyAccount, SimulateContractReturnType } from 'viem';
import { printError, printInfo, printSuccess } from '../../data/logger/logPrinter';
import { Config, TelepathyConfig } from '../../config';
import { mainnet } from 'viem/chains';
import { generateRandomString, mailBoxContractAddress, telepathyContractAddress } from './telepathyData';
import { telepathyABI } from '../../abis/telepathy';
import { checkGwei } from '../../data/gweiChecker/gweiChecker';

export async function sendMail(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль Telepathy`);

    const randomMessage = generateRandomString(TelepathyConfig.messageLength.min, TelepathyConfig.messageLength.max);

    const hexRepr = '0x' + Buffer.from(randomMessage, 'utf8').toString('hex');

    const randomChainData =
        TelepathyConfig.chainDstData[Math.floor(Math.random() * TelepathyConfig.chainDstData.length)];

    printInfo(`Буду производить send mail Ethereum -> ${randomChainData.chainName}, message: ${randomMessage}`);

    const client = createPublicClient({
        chain: mainnet,
        transport: Config.rpc == '' ? http() : http(Config.rpc),
    });

    await checkGwei();

    printInfo(`Произвожу send mail Ethereum -> ${randomChainData.chainName}, message: ${randomMessage}`);

    const walletClient = createWalletClient({
        chain: mainnet,
        transport: Config.rpc == '' ? http() : http(Config.rpc),
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
