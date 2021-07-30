import React, { PropsWithChildren, createContext } from "react";

export const AccountsContext = createContext<any[]>([]);

export default function AccountsContextComponent(props: PropsWithChildren<{ accounts: any[] }>): JSX.Element {
    return <AccountsContext.Provider value = {props.accounts}>{props.children}</AccountsContext.Provider>;
}