import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import webstomp from "webstomp-client";
import { countMissedMessages } from "../lib/discussions-api";
import AuthContext from "./auth-context";

const FRETTO_WS_DOMAIN = "wss://192.168.50.4:8443/wamya-backend/wamya-ws";

const RECONNECT_DELAY = 10000; //10 seconds
const MAX_RECONNECT_RETRIES = 5;
let retries = 0;

export const WebSocketContext = createContext({
  missedMessagesCount: 0,
  currentDiscussionMessages: [],
  currentDiscussions: [],
});

export const WebSocketContextMethods = createContext({
  connect: (token) => {},
  disconnect: () => {},
  updateMissedMessagesCount: (count) => {},
  incrementMissedMessagesCount: (count) => {},
  decrementMissedMessagesCount: (count) => {},
  updateCurrentDiscussionMessages: (messages, doReset) => {},
  updateCurrentDiscussions: (discussions) => {},
});

export const WebSocketMessagesContextController = (props) => {
  const webSocketClient = useRef();
  const subscriptionsResult = useRef([]);

  const [missedMessagesCount, setMissedMessagesCount] = useState();
  const [currentDiscussionMessages, setCurrentDiscussionMessages] = useState(
    []
  );
  const [currentDiscussions, setCurrentDiscussions] = useState([]);

  const updateMissedMessagesCount = useCallback((newCount) => {
    setMissedMessagesCount((currentCount) => newCount);
  }, []);

  const incrementMissedMessagesCount = useCallback(
    () => setMissedMessagesCount((currentCount) => currentCount + 1),
    []
  );

  const decrementMissedMessagesCount = useCallback(
    () => setMissedMessagesCount((currentCount) => currentCount - 1),
    []
  );

  const updateCurrentDiscussionMessages = useCallback(
    (newMessages, doReset) => {
      if (doReset) {
        setCurrentDiscussionMessages((oldMessages) => [
          ...newMessages.reverse(),
        ]);
      } else {
        setCurrentDiscussionMessages((oldMessages) => [
          ...newMessages.reverse(),
          ...oldMessages,
        ]);
      }
    },
    []
  );

  const updateCurrentDiscussions = useCallback((newDiscussions) => {
    setCurrentDiscussions([...newDiscussions]);
  }, []);

  const updateDiscussionLatestMessage = useCallback(
    (discussionId, latestMessage) => {
      setCurrentDiscussions((oldDiscussions) => {
        const discussion = oldDiscussions.find((d) => d.id === discussionId);
        const discussionIndex = oldDiscussions.findIndex(
          (d) => d.id === discussionId
        );
        if (discussion) {
          discussion.latestMessage = latestMessage;
          return [
            ...oldDiscussions.slice(0, discussionIndex),
            discussion,
            ...oldDiscussions.slice(discussionIndex + 1),
          ];
        } else {
          return [...oldDiscussions];
        }
      });
    },
    []
  );
  const authContext = useContext(AuthContext);

  const subscribe = useCallback(
    (stompClient) => {
      const subscriptions = [
        {
          url: "/user/exchange/amq.direct/messages",
          callback: (message) => {
            message.ack();
            const messageBody = JSON.parse(message.body);

            if (messageBody.type === "CHAT_MESSAGE") {
              setCurrentDiscussionMessages((oldMessages) => [
                ...oldMessages,
                messageBody.messageDto,
              ]);

              updateDiscussionLatestMessage(
                messageBody.discussionId,
                messageBody.messageDto
              );
              setMissedMessagesCount((oldCount) => oldCount + 1);
            }
          },
          headers: { ack: "client-individual" },
        },
      ];

      const subs = [];
      subscriptions.forEach((subscription) => {
        const subscriptionResult = stompClient.subscribe(
          subscription.url,
          subscription.callback,
          subscription.headers
        );
        subs.push(subscriptionResult);
      });
      subscriptionsResult.current = subs;
    },
    [updateDiscussionLatestMessage]
  );

  const tryReconnecting = useCallback(
    (token) => {
      let reconnectInterval = setInterval(() => {
        retries++;
        if (retries <= MAX_RECONNECT_RETRIES) {
          console.log(
            "Connection retry attept " + retries + "/" + MAX_RECONNECT_RETRIES
          );

          let stompClient = webstomp.client(
            `${FRETTO_WS_DOMAIN}?access_token=${token}`,

            {
              heartbeat: { incoming: 10000, outgoing: 10000 },
              protocols: ["v12.stomp"],
            }
          );

          stompClient.connect(
            {},
            (frame) => {
              clearInterval(reconnectInterval);
              retries = 0;

              subscribe(stompClient);
              webSocketClient.current = stompClient;
            },
            (error) => {
              if (error instanceof CloseEvent) {
                console.log("Websocket connection closed!\n " + error);
                clearInterval(reconnectInterval);
                tryReconnecting(token);
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
    },
    [subscribe]
  );

  const connect = useCallback(
    (token) => {
      let stompClient = webstomp.client(
        `${FRETTO_WS_DOMAIN}?access_token=${token}`,

        {
          heartbeat: { incoming: 10000, outgoing: 10000 },
          protocols: ["v12.stomp"],
        }
      );

      stompClient.connect(
        {},
        () => {
          subscribe(stompClient);
          webSocketClient.current = stompClient;
        },
        (error) => {
          if (error instanceof CloseEvent) {
            console.log("Websocket connection closed!\n " + error);
            tryReconnecting(token);
          } else {
            console.log("Error encountred:\n" + error);
          }
        }
      );
    },
    [subscribe, tryReconnecting]
  );

  const disconnect = useCallback(() => {
    subscriptionsResult.current.forEach((subscription) => {
      subscription.unsubscribe();
    });
    webSocketClient.current.disconnect();
  }, []);

  useEffect(() => {
    if (authContext.isLoggedIn) {
      countMissedMessages({ token: authContext.token })
        .then((count) => setMissedMessagesCount(count))
        .catch((error) =>
          console.log("Failed to fetch missed messages count: \n", error)
        );
      connect(authContext.token);
    }
  }, [authContext.isLoggedIn, authContext.token, connect]);

  const contextValue = {
    missedMessagesCount: missedMessagesCount,
    currentDiscussionMessages: currentDiscussionMessages,
    currentDiscussions: currentDiscussions,
  };

  const contextMethodsValue = useMemo(
    () => ({
      connect,
      disconnect,
      updateMissedMessagesCount,
      incrementMissedMessagesCount,
      decrementMissedMessagesCount,
      updateCurrentDiscussionMessages,
      updateCurrentDiscussions,
    }),
    [
      connect,
      disconnect,
      updateMissedMessagesCount,
      incrementMissedMessagesCount,
      decrementMissedMessagesCount,
      updateCurrentDiscussionMessages,
      updateCurrentDiscussions,
    ]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      <WebSocketContextMethods.Provider value={contextMethodsValue}>
        {props.children}
      </WebSocketContextMethods.Provider>
    </WebSocketContext.Provider>
  );
};
