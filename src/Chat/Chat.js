import React, { useEffect, useState } from "react";
import { useStateValue } from "../StateProvider";
import { useHistory, useParams } from "react-router-dom";
//importing firebase
import { storage, firebase } from "../firebase";
import db from "../firebase";
//importing components
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import ChatLandingScreen from "./ChatLandingScreen";
//importing material-ui
import CircularProgress from "@material-ui/core/CircularProgress";
//importing styles

import "react-toastify/dist/ReactToastify.css";
import "./Chat.css";

import api from "../services/api";
import Pusher from "pusher-js";

const pusher = new Pusher('4a3f7bae1fc10026e12f', {
  cluster: 'us2'
});

const channel = pusher.subscribe('my-channel');

function Chat({ isRoomExist }) {
  const history = useHistory();
  const [{ user, userApi }] = useStateValue();
  const { roomId, contact } = useParams();
  const [_roomId, set_RoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCreatedBy, setRoomCreatedBy] = useState("");
  const [roomOwner, setRoomOwner] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLandingScreenPhoto, setShowLandingScreenPhoto] = useState(false);
  const [messagesApi, setMessagesApi] = useState([]);
  const [contactData, setContactData] = useState([]);

  const notificationsNewMessage = () => {
    channel.bind('my-event', function (data) {
      if (data[0].readMessage == 0) {
        apiMessages(contact)
      } else {
        setMessagesApi(messagesApi => [...messagesApi, data[0]]);
      }
    });
  }

  const apiMessages = async () => {
    if (contact) {
      try {
        await api.get('getAllInboxMessages'
        ).then(function (messagesD) {
          try {
            api.get('getAllMessagesSent'
            ).then(function (messagesSent) {
              var ids = new Set(messagesD.data.map(d => d.msgid));
              var merged = [...messagesD.data, ...messagesSent.data.filter(d => !ids.has(d.msgid))];
              const merged2 = merged.filter((p) => p.fromAddress === contact || p.toAddress === contact).map(p => p)

              const sorted2 = merged2.sort(function(a,b){
                if (new Date(a.receivedTime) > new Date(b.lastActionTime)) return 1;
                if (new Date(a.lastActionTime) > new Date(b.receivedTime)) return 1;
                else return  0;
              });
              setMessagesApi(sorted2)
            }).catch(function (err) {
              console.log(err)
            });
          } catch (err) {
            console.log("erro", err);
          }
          setLoading(true);
        }).catch(function (err) {
          console.log(err)
        });
      } catch (err) {
        console.log("erro", err);
      }
    }

    setLoading(true);
  };

  useEffect(() => {
    apiMessages()
    notificationsNewMessage()
  }, [contact]);

  return (
    <div className="chat">
      {contact ? (
        <>
          <div>
            <ChatHeader
              roomCreatedBy={roomCreatedBy}
              roomOwner={roomOwner}
              roomName={roomName}
              roomId={roomId}
              _roomId={_roomId}
              messages={messages}
              db={db}
              history={history}
              isRoomExist={isRoomExist}
            />
          </div>

          <div className="chat__body">
            {loading ? (
              <ChatBody
                roomCreatedBy={roomCreatedBy}
                roomOwner={roomOwner}
                roomId={roomId}
                messages={messages}
                messagesApi={messagesApi}
                setMessagesApi={setMessagesApi}
                user={user}
                isRoomExist={isRoomExist}
                contact={contactData}
              />
            ) : (
              <div className="chat__body_loading">
                <div>
                  <CircularProgress />
                </div>
              </div>
            )}
          </div>

          <div>
            <ChatFooter
              messagesApi={messagesApi}
              setMessagesApi={setMessagesApi}
              roomName={roomName}
              roomId={roomId}
              db={db}
              firebase={firebase}
              storage={storage}
              contact={contact}
            />
          </div>
        </>
      ) : (
        <ChatLandingScreen showLandingScreenPhoto={showLandingScreenPhoto} />
      )}
    </div>
  );
}

export default Chat;
