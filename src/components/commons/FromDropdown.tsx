import React, { Fragment, MouseEvent, ReactElement, useState, useEffect } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Label } from "reactstrap";

interface AccountDropdownProps {
    disabled?: boolean;
    onSelectAccount(account: string): void;
    accounts: any[]
    title?: string
}

export default function AccountDropdown(props: AccountDropdownProps): JSX.Element {
    const account = props.accounts && props.accounts.length > 0 ? props.accounts[0] : { name: "No wallet loaded" }
    const [selectedAccount, setSelectedAccount] = useState(account);
    const [isOpen, openDropdown] = useState(false);

    useEffect(() => {
        if(props.accounts.length > 0 ){
            props.onSelectAccount(props.accounts[0].address);
        }
    }, []);

    const onToggleAccount = (event: MouseEvent) => {
        event.preventDefault();
        openDropdown(!isOpen);
    }

    const onSelectAccount = (account: any) => {
        setSelectedAccount(account);
        props.onSelectAccount(account.address);
    }

    return <Fragment>
        <FormGroup className="align-items-center">
            <Label className="tx-label">
                {props.title || 'From'}
            </Label>
            <Dropdown
                disabled={props.disabled || !props.accounts || props.accounts.length === 0}
                className="from-dropdown"
                isOpen={isOpen}
                toggle={onToggleAccount}>
                <DropdownToggle caret disabled={props.disabled}>
                    <span className="text-ellipsis">
                        {selectedAccount ? selectedAccount.name : "No account loaded"}
                    </span>
                </DropdownToggle>
                <DropdownMenu>
                    {props.accounts && props.accounts.map((account): ReactElement => {
                        return (
                            <DropdownItem
                                onClick={() => onSelectAccount(account)}
                                key={`account-${account.address}`}
                            >
                                <span className="text-ellipsis">
                                    {account.name}
                                </span>
                            </DropdownItem>
                        );
                    })
                    }
                </DropdownMenu>
            </Dropdown>
        </FormGroup>
    </Fragment>
}