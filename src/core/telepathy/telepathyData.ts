import { IChainData } from '../../data/utils/interfaces';

export const telepathyContractAddress = '0xa3b31028893c20bEAA882d1508Fe423acA4A70e5';
export const mailBoxContractAddress = '0xF8f0929809fe4c73248C27DA0827C98bbE243FCc';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomString(min: number, max: number): string {
    const length = Math.floor(Math.random() * (max - min + 1)) + min;

    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const goerliChainData: IChainData = {
    chainId: 5,
    chainName: 'Goerli Testnet',
};
