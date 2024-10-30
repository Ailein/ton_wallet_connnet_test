import {CHAIN, TonConnectButton, toUserFriendlyAddress, useTonWallet} from "@tonconnect/ui-react";

export const Header = () => {
    const wallet = useTonWallet();

    return <div style={{display: 'flex', justifyContent:'space-between'}}>
        {
            wallet ? <>
                {
                    'name' in wallet ? <div>
                        <div>钱包: {wallet.name}</div>
                        <div>地址: {toUserFriendlyAddress(wallet.account.address, wallet.account.chain === CHAIN.TESTNET)}</div>
                        <img src={wallet.imageUrl} height="50px" width="50px" />

                    </div> : `已连接未知钱包 ${wallet.device.appName}`
                }
            </> : '钱包未连接'
        }
        <TonConnectButton />
    </div>
}
