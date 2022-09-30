---
sidebar_position: 4
---

# Important Considerations

### Browser events and blocked popups

To avoid popup spam, all browsers have restricted the use of popups. In order to use them, each popup must be opened inside a function that has been triggered in an onClick event. Each function can only open one popup, if it tries to open a second popup, it will be blocked by the browser. Therefore, connect and signTransaction methods must be called in two different actions.

### Firefox and Safari issues

Firefox and Safari browsers have a different behavior on managing DOM events. For both browsers, an onClick event will disappear after an asynchronous function is called. Therefore, it is important for all MyAlgo Connect methods to be the first asynchronous function to be called in the onClick event. If this does not happen, the browser will block the popup opened by MyAlgo Connect and the user must manually allow the popup to interact with it through the browser settings.

### Hardware wallet issues

Since v2.0.7, the Algorand ledger application supports all fields and limits as specified by the [consensus protocol](https://github.com/algorand/go-algorand/blob/master/config/consensus.go), save for a few specific listed below. In order to prevent issues when using ledger to interact with DApps, users still using v1 versions of the application should upgrade to the latest.

The only limitations still in place are for application approval and clear programs.

<center>

| Transaction field   | Ledger V2 (>= v2.0.7)      |
| :---                | :----:                     |
| appApprovalProgram  | 128 bytes                  |
| appClearProgram     | 32 bytes                   |

</center>
