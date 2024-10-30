import {Account, CHAIN, TonProofItemReplySuccess} from "@tonconnect/ui-react";

export class BackendApi {
    //  baseUrl = 'https://demo.tonconnect.dev';
  baseUrl = 'http://localhost:3000';

    async generatePayload(): Promise<string | undefined> {
        try {
            const response = await (await fetch(`${this.baseUrl}/ton-proof/generate-payload`, {
                method: 'POST'
            })).json();

            return response.payload;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async checkProof(account: Account, proof: TonProofItemReplySuccess['proof']): Promise<string | undefined> {
        try {
            const body = {
                address: account.address,
                network: account.chain,
                public_key: account.publicKey,
                proof: {
                    ...proof,
                    state_init: account.walletStateInit
                }
            }

            const response = await (await fetch(`${this.baseUrl}/ton-proof/check-proof`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })).json();

            return response.token;


        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async getAccountInfo(authToken: string, network: CHAIN) {
        try {
            const response = await (await fetch(`${this.baseUrl}/dapp/get-account-info?network=${network}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })).json();

            return response;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }
}

export const backendApi = new BackendApi();
