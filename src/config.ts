import { IBridgeRange, IChainData, IDelayRange } from './data/utils/interfaces';

export class Config {
    public static readonly delayBetweenAccounts: IDelayRange = { min: 15, max: 25 }; // задержка между аккаунтами (в минутах)
    public static readonly delayBetweenGweiCheck: IDelayRange = { min: 0.3, max: 1 }; // задержка перед получением нового гвея (в минутах)
    public static readonly maxBridgeL1Gwei = 15; // до какого гвея будет использоваться бридж
    public static readonly ethereumRpc: string = 'https://rpc.ankr.com/eth'; // rpc для Ethereum chain, если нет необходимости то оставить ''
    public static readonly gnosisRpc: string = 'https://rpc.ankr.com/gnosis'; // rpc для Gnosis chain, если нет необходимости то оставить ''
}

export class TelepathyConfig {
    public static readonly isUseEthereumChain: boolean = false; // использовать ли ethereum сеть
    public static readonly isUseGnosisChain: boolean = true; // использовать ли gnosis сеть
    public static readonly chainDstData: IChainData[] = [
        {
            chainId: 42161,
            chainName: 'Arbitrum',
        },
        {
            chainId: 43114,
            chainName: 'Avalanche',
        },
        {
            chainId: 56,
            chainName: 'BNB Smart Chain',
        },
        {
            chainId: 100,
            chainName: 'Gnosis Chain',
        },
        {
            chainId: 10,
            chainName: 'Optimism',
        },
        {
            chainId: 137,
            chainName: 'Polygon',
        },
    ]; // удалить, закоментировать сети, которые не надо использовать как получателя
    public static readonly messageLength: IBridgeRange = { min: 7, max: 15 }; // в каком диапазоне будут генерироваться символы в сообщении
}
