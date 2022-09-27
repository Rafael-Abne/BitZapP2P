import React, { useState, useEffect } from "react";
import { useStateValue } from "../StateProvider";
import { toastInfo } from "../shared/toastInfo";
//importing components
import DrawerBottom from "./DrawerBottom";
import TooltipCustom from "../shared/TooltipCustom";
import { Picker } from "emoji-mart";
//importing material-ui
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Slide from "@material-ui/core/Slide";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";
//importing material-ui-icons
import CloseIcon from "@material-ui/icons/Close";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import PhotoIcon from "@material-ui/icons/Photo";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import PersonIcon from "@material-ui/icons/Person";
//importing styles
import "emoji-mart/css/emoji-mart.css";
import "./ChatFooter.css";
import api from "../services/api";

const attachFileLists = [
  {
    title: "Room",
    icon: <VideoCallIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Contato",
    icon: <PersonIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Documento",
    icon: <InsertDriveFileIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Camera",
    icon: <CameraAltIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Imagem ou Video",
    icon: <PhotoIcon />,
    id: Math.random() * 100000,
  },
];

function ChatFooter({ messagesApi, setMessagesApi, roomName, roomId, db, firebase, storage, contact }) {
  const [{ user }] = useStateValue();
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [fileVideoUrl, setFileVideoUrl] = useState(null);
  const [drawerBottom, setDrawerBottom] = useState(false);
  const [showAttachFile, setShowAttachFile] = useState(false);
  const [LoadingFileChange, setLoadingFileChange] = useState(true);

  const attachFile = () => {
    const attachToastId = "attach";
    toastInfo(
      "você só pode fazer upload de imagens, gifs e vídeos!",
      attachToastId,
      "top-center",
    );
    if (showAttachFile === false) {
      setShowAttachFile(true);
    } else {
      setShowAttachFile(false);
    }
    // console.log("attachFile click", attachToastId);
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
  };

  const handleEmoticons = () => {
    setEmoji(true);
  };

  const handleEmoticonsClose = () => {
    setEmoji(false);
  };

  const voiceMessage = () => {
    const voiceMessageToastId = "voiceMessage";
    toastInfo(
      "Ainda vai implementar!",
      voiceMessageToastId,
      "top-center"
    );
  };


  const onFileChange = async (e) => {
    setLoadingFileChange(true);
    setDrawerBottom(true);
    const fileSizeToastId = "fileSizeToastId";
    const file = e.target.files[0];
    if (file.size > 20 * 1024 * 1024) {
      toastInfo(
        "Arquivo não pode ser maior que 10MB",
        fileSizeToastId,
        "top-center"
      );
    } else {
      if (file.type.match("image.*")) {
        var reader = new FileReader();
        reader.onloadend = function () {
        }
        let imageBase64 = reader.readAsDataURL(file);

        setFileImageUrl(imageBase64);
        console.log(fileImageUrl)

      }
      setLoadingFileChange(false);
    }
  };

  const handleClickAway = () => {
    setShowAttachFile(false);
  };

  const sendMessageApi = () => {
    const bodyParameters = {
      fromAddress: "BM-2cUEu9SFaLHFmZo5N3qXqR8c97JadYFM6j",
      toAddress: contact,
      message: input,
      msgid: 'messageTemp',
      lastActionTime: new Date(),
      subject: subject
    };

    setMessagesApi(messagesApi => [...messagesApi, bodyParameters]);
    try {
      api.post('/sendMessage',
        bodyParameters
      ).then(function (message) {
        // setMessagesApi(messagesApi.filter(item => item.id !== 'messageTemp'));
        // setMessagesApi(messagesApi => [...messagesApi, message.data.message]);
      }).catch(function (err) {
        console.log(err)
      });
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() =>{
    console.log(fileImageUrl);
  }, [fileImageUrl?.search('data:image') >= 0])

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      sendMessageApi()

      const youtubeLink = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
      const facebookVideoLink = /^https?:\/\/www\.facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
      const vimeoLink = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
      const soundcloudLink = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
      const dailymotionLink = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      const urlLink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

      setInput("");
      setEmoji(false);
    }
  };

  return (
    <div className="chat__footer">
      <DrawerBottom
        drawerBottom={drawerBottom}
        setDrawerBottom={setDrawerBottom}
        fileVideoUrl={fileVideoUrl}
        fileImageUrl={fileImageUrl}
        setFileImageUrl={setFileImageUrl}
        setFileVideoUrl={setFileVideoUrl}
        roomId={roomId}
        db={db}
        firebase={firebase}
        storage={storage}
        showLoadingFile={LoadingFileChange}
      />

      {emoji ? (
        <Hidden only={["xs"]}>
          <TooltipCustom
            name="Close"
            icon={<CloseIcon />}
            onClick={() => handleEmoticonsClose()}
          />
        </Hidden>
      ) : null}

      <TooltipCustom
        name="Emoticons"
        icon={<InsertEmoticonIcon />}
        onClick={() => handleEmoticons()}
      />

      {emoji ? (
        <>
          <Hidden only={["xs"]}>
            <Picker onSelect={addEmoji} />
          </Hidden>
          <Hidden smUp>
            <ClickAwayListener onClickAway={handleEmoticonsClose}>
              <Picker onSelect={addEmoji} />
            </ClickAwayListener>
          </Hidden>
        </>
      ) : null}

      <div>
        <TooltipCustom
          name="Attach"
          icon={<AttachFileIcon />}
          onClick={attachFile}
        />
        {showAttachFile ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="chat__attachFile">
              {attachFileLists.map((attachFileList) => (
                <Slide
                  key={attachFileList.id}
                  direction="up"
                  in={attachFile}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tooltip
                    title={
                      <span
                        style={{ fontSize: "14px", padding: "8px 5px 8px 5px" }}
                      >
                        {attachFileList.title}
                      </span>
                    }
                    placement="left"
                  >
                    <Fab color="primary" aria-label="person">
                      <div className="chat__icon">
                        <label htmlFor="file-input">
                          {attachFileList.icon}
                        </label>
                        <input
                          id="file-input"
                          type="file"
                          onChange={onFileChange}
                          accept="image/*,video/mp4,video/3gpp,video/quicktime"
                        />
                      </div>
                    </Fab>
                  </Tooltip>
                </Slide>
              ))}
            </div>
          </ClickAwayListener>
        ) : null}
      </div>

      <form>
        <textarea
          className="subject_textarea"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Assunto"
          type="text"
          minLength="1"
          maxLength="100"
          rows="1"
        />
        <textarea
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="mensagem"
          type="text"
          rows="1"
          onKeyDown={onEnterPress}
        // cols="50"
        // minLength="1"
        // maxLength="700"
        />

        {/* <TextField
          id="filled-full-width"
          fullWidth
          multiline
          rowsMax={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        /> */}

        {/* <button onClick={sendMessage} type="submit">
          Send a message
        </button> */}
      </form>

      <TooltipCustom
        name="Voice Message"
        icon={<MicIcon />}
        onClick={() => voiceMessage()}
      />
    </div>
  );
}

export default ChatFooter;
