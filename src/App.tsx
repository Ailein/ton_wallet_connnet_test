import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "./Header.tsx";
import {SendTx} from "./SendTx.tsx";
import {Settings} from "./Settings.tsx";
import {BackendTokenContext} from "./BackendTokenContext.ts";
import {useState} from "react";
import {ProvideBackendAuth} from "./ProvideBackendAuth.tsx";
import {OnlyAuthUserData} from "./OnlyAuthUserData.tsx";
import WebApp from '@twa-dev/sdk'


// WebApp.showAlert('Hey there!');

// WebApp.showAlert(JSON.stringify(WebApp.initData));


function App() {

  const [token, setToken] = useState<string | undefined>(undefined);

  return <TonConnectUIProvider
      manifestUrl="https://ailein.github.io/ton_wallet_connnet_test/tonconnect-manifest.json"
      uiPreferences={{
        borderRadius: 'none',
        colorsSet: {
          [THEME.DARK]: {
              connectButton: {
                background: 'orange'
              }
          },
          [THEME.LIGHT]: {
            background: {
              qr: 'red'
            }
          }
        }
      }}
      actionsConfiguration={{
          modals: 'all',
          notifications: ['error']
      }}
  >
      <BackendTokenContext.Provider value={{ token, setToken }}>
          <ProvideBackendAuth />
          <Header />
          <SendTx />
          <Settings />
          <OnlyAuthUserData />
          {/* 显示 WebApp.initData 内容 */}
        <div>
          <h2>WebApp Init Data:</h2>
          <p>{JSON.stringify(WebApp.initData)}</p>
        </div>
      </BackendTokenContext.Provider>
  </TonConnectUIProvider>
}

export default App
