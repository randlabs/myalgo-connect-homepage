---
sidebar_position: 4
---

# Important Considerations

### Browser events and blocked popups

To avoid popup spam, all browsers have restricted the use of popups. In order to use them, each popup must be opened inside a function that has been triggered in an onClick event. Each function can only open one popup, if it tries to open a second popup, it will be blocked by the browser. Therefore, connect and signTransaction methods must be called in two different actions.

### Firefox and Safari issues

Firefox and Safari browsers have a different behavior on managing DOM events. For both browsers, an onClick event will disappear after an asynchronous function is called. Therefore, it is important for all MyAlgo Connect methods to be the first asynchronous function to be called in the onClick event. If this does not happen, the browser will block the popup opened by MyAlgo Connect and the user must manually allow the popup to interact with it through the browser settings.

### Hardware wallet issues

Unfortunately, Ledger Nano has hardware limitations that limit some transaction fields, especially for application transactions. Furthermore, signing stateless teal is not implemented yet in the Algorand ledger application.

The MyAlgo Connect team is pushing Ledger to add full functionality for Algorand applications. This section will be updated with the newest changes.

The following table lists the limits for some fields, depending on the algorand ledger application version. The listed values apply for both Ledger Nano S and X devices, unless explicitly specified otherwise.

<center>

| Transaction field   | Ledger V2 (>= v2.0.7)      | Ledger V1 (>= v1.2.16)    |
| :---                | :----:                     |   :----:                  |
| note                | 1024 bytes                 |  32 bytes                 |
| appAccounts         | 4                          |   2                       |
| appForeignAssets    | 8                          |   1                       |
| appForeignApps      | 8                          |   1                       |
| appArgs             | 16, of max size 2048 bytes |   2, of max size 32 bytes |
| appApprovalProgram  | 128 bytes                  | 128 bytes                 |
| appClearProgram     | 32 bytes                   | 32 bytes                  |
| assetURL            | 96 bytes                   | 32 bytes                  |
| extraPages          | Supported                  |  Field not supported      |
| lease               | Supported                  |  Field not supported      |

</center>

Additionally, for Ledger V2, the following restriction must hold: `appAccounts + appForeignAssets + appForeignApps <= 8`