import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";



// importing component
import DrawerRightInfo from "./DrawerRightInfo";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

// import DialogCustom from '../shared/DialogCustom';
//importing material-ui-icon
import NoEncryptionIcon from "@material-ui/icons/NoEncryption";
import AlarmIcon from "@material-ui/icons/Alarm";
import DoneIcon from "@material-ui/icons/Done";
//importing styles
import "./ChatBody.css";

function ChatBody({
  roomOwner,
  roomCreatedBy,
  messages,
  messagesApi,
  setMessagesApi,
  user,
  roomId,
  isRoomExist,
  contact
}) {
  const messagesEndRef = useRef(null);
  // const { roomId } = useParams();
  const [playing, setPlaying] = useState(false);
  // const [showDialog, setShowDialog] = useState(false);
  const userAddress = 'BM-2cUEu9SFaLHFmZo5N3qXqR8c97JadYFM6j';

  useEffect(() => {
    //listens when room is changed, then it sets playing to false
    if (isRoomExist >= 0) {
      setPlaying(false);
    }

  }, [isRoomExist]);

  const handlePlay = () => {
    setPlaying(true);
  };


  const handlePause = () => {
    setPlaying(false);
  };

  // const handleDialogOpen = () => {
  //     setShowDialog(true);
  // }

  // const handleDialogClose = () => {
  //     setShowDialog(false);
  // }


  const scrollToBottom = () => {
    if (messagesApi) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };
  useEffect(scrollToBottom, [messages, messagesApi]);

  return (
    <div>
      <p className="chat__message_reminder">
        <NoEncryptionIcon /> As mensagens são criptografadas pelo protocolo <a target="_blank" href="https://wiki.bitmessage.org/index.php/Main_Page">Bitmessage</a>.
      </p><br />
      {/* <p className="chat__message_reminder chat__createdBy">
          chat iniciado
      </p> */}

      {messagesApi?.map((message) => (
        <div
          key={message.msgid}
          className={`chat__message 
                    ${message.fromAddress === userAddress && "chat__sender"} 
                    ${message.photo && "chat__message_media_image"}
                    ${message.video && "chat__message_media_video"}
                    ${
                      message.video &&
                      !message.caption &&
                      "chat__message_media_video_noCaption"
                    } `}
        >
          <span
            className={`chat__name ${
              message.fromAddress === userAddress && "chat__name_sender"
            }`}
          >
            {message.fromAddress}
          </span>

          <div className="chat__body_image_container">
            {message.message.search('data:image') >= 0 ? (
              <>
                {/* <img
                  alt=""
                  className="chat__body_image"
                  src={message.photo}
                  // onClick={handleDialogOpen}
                />
                 */}
                <InnerImageZoom hasSpacer={true} src={message.message} zoomSrc={message.message} />

                {/* <DialogCustom 
                                    open={showDialog}
                                    close={handleDialogClose}
                                    photo={message.photo}
                                    user={user}
                                /> */}
              </>
            ) : null}
          </div>

          <div className="chat__body_video_container">
            {message.video ? (
              <>
                <div className="player-wrapper">
                  <ReactPlayer
                    className="react-player"
                    width="100%"
                    height="100%"
                    url={message.video}
                    controls={true}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handlePause}
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="chat__message_box">
            <div
              className={`chat__message_box_text ${
                message.fromAddress === userAddress && "chat__message_box_text_sender"
              }
              ${
                message.photo &&
                !message.caption &&
                "chat__message_box_text_no_caption"
              } `}
            >
              <strong>{message.subject+'\n'}</strong>
              {message.message.search('data:image') < 0 ? message?.message: ''}
              {message?.caption}
              {message.url ? (
                <a
                  target="_blank"
                  href={`${message.url}`}
                  rel="noopener noreferrer"
                >
                  {message.url}
                </a>
              ) : null}

              <div
                className={`chat__timestamp_container ${
                  message.fromAddress === userAddress && "chat__timestamp_container_sender"
                }`}
              >
                {message.receivedTime ? (
                  <div
                    className={`chat__timestamp 
                                    ${
                                      message.photo &&
                                      !message.caption &&
                                      "chat__timestamp_media_photo"
                                    }  
                                    ${
                                      message.video &&
                                      !message.caption &&
                                      "chat__timestamp_media_video"
                                    }
                                    ${
                                      message.video &&
                                      !message.caption &&
                                      playing === true &&
                                      "chat__timestamp_media_displayNone"
                                    }`}
                  >
                    <span>
                      {new Date(message.receivedTime).toLocaleTimeString(
                        "pt-BR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric"
                        }
                      )}
                      { message.receivedTime !== '' ? <><DoneIcon /><DoneIcon /></> : null}
                    </span>
                  </div>
                ) : (
                  <div className="chat__timestamp">
                    <span>
                      {new Date(message.lastActionTime).toLocaleTimeString(
                        "pt-BR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric"
                        }
                      )}
                      {message.msgid === 'messageTemp' ? <AlarmIcon /> : null}
                      {message.status === 'ackreceived' ? <><DoneIcon /><DoneIcon /></> : null}
                      {message.status === 'msgsent' ? <><DoneIcon /></> : null}
                      {message.status === 'msgsentnoackexpected' ? <><DoneIcon /></> : null}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* it will automatically scroll drown everytime the user enters new chat message */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatBody;
