import webstomp from "webstomp-client";

const RECONNECT_DELAY = 10000; //10 seconds
const MAX_RECONNECT_RETRIES = 180;
let retries = 0;
let webstompClient;
let subscriptionsResult = [];
export function configureWebsocketClient(token, subscriptions) {
  webstompClient = webstomp.client(
    `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_FRETTO_DOMAIN}/wamya-backend/wamya-ws?access_token=${token}`,

    {
      heartbeat: { incoming: 10000, outgoing: 10000 },
      protocols: ["v12.stomp"],
    }
  );

  webstompClient.connect(
    {},
    (frame) => {
      subscriptions.forEach((subscription) => {
        const subscriptionResult = webstompClient.subscribe(
          subscription.url,
          subscription.callback,
          subscription.headers
        );
        subscriptionsResult.push(subscriptionResult);
      });
    },
    (error) => {
      if (error instanceof CloseEvent) {
        console.log("Websocket connection closed!\n " + error);
        tryReconnecting(token, subscriptions);
      } else {
        console.log("Unknown error:\n" + error);
      }
    }
  );

  return {
    webstompClient: webstompClient,
    subscriptionsResult: subscriptionsResult,
  };
}

function tryReconnecting(token, subscriptions) {
  let reconnectInterval = setInterval(() => {
    retries++;
    if (retries <= MAX_RECONNECT_RETRIES) {
      console.log(
        "Connection retry attept " + retries + "/" + MAX_RECONNECT_RETRIES
      );
      webstompClient = webstomp.client(
        `${FRETTO_WS_DOMAIN}?access_token=${token}`,

        {
          heartbeat: { incoming: 10000, outgoing: 10000 },
          protocols: ["v12.stomp"],
        }
      );

      webstompClient.connect(
        {},
        (frame) => {
          retries = 0;
          clearInterval(reconnectInterval);
          subscriptionsResult = [];
          subscriptions.forEach((subscription) => {
            const subscriptionResult = webstompClient.subscribe(
              subscription.url,
              subscription.callback,
              subscription.headers
            );

            subscriptionsResult.push(subscriptionResult);
          });
        },
        (error) => {
          if (error instanceof CloseEvent) {
            console.log("Websocket connection closed!\n " + error);
            clearInterval(reconnectInterval);
            tryReconnecting(token, subscriptions);
          } else {
            console.log("Error encountred:\n" + error);
          }
        }
      );
    } else {
      clearInterval(reconnectInterval);
      console.log(
        "Unable to reconnect after connection closed!" +
          "\n Max retry " +
          MAX_RECONNECT_RETRIES +
          " reached."
      );
    }
  }, RECONNECT_DELAY);
}
