import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VideocamIcon from '@material-ui/icons/Videocam';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import './SidebarChat.css';

import Pusher from "pusher-js";

const pusher = new Pusher('4a3f7bae1fc10026e12f', {
  cluster: 'us2'
});

const channel = pusher.subscribe('my-channel');

function SidebarChat2({ id, contact, last_message }) {
    const [lastMessage, setLastMessage] = useState([]);

    const notificationsNewMessage = () => {
        channel.bind('my-event', function(data) {
           if(data[0].uuid_contact === contact.uuid){
               setLastMessage(data[0])
           }
        });
    }

    useEffect(() => {
        setLastMessage(last_message)
        notificationsNewMessage()
    }, []);
    
    return (
        <Link to={`/contact/${contact.address}/messages`} className="sidebarChat__link">
            <div className="sidebarChat">
                <Avatar>{contact.label[0]}</Avatar>
                <div className="sidebarChat__info">
                    <h2>
                        {contact.label}
                    </h2>
                     
                    {lastMessage?.photo?
                        <div className="sideChat__photo">
                            <PhotoCameraIcon /> <span>Photo</span>
                        </div>
                    :null}
                    {lastMessage?.video?
                        <div className="sideChat__photo">
                            <VideocamIcon /> <span>Video</span>
                        </div>
                    :null}
                    <p>{lastMessage?.text} </p>
                    <p>{lastMessage?.url}</p>
                </div>
                <IconButton aria-label="unread messages">
                    <Badge className="badge_unread_messages" badgeContent={4}></Badge>
                </IconButton>
            </div>
        </Link>
    );   
}

export default SidebarChat2
