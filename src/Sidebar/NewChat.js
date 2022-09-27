import React, { useState } from 'react';
import TooltipCustom from '../shared/TooltipCustom';
// import db from '../firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ChatIcon from '@material-ui/icons/Chat';
import api from '../services/api';

function NewChat({ user, db, firebase }) {
    const [roomName, setRoomName] = useState("");
    const [address, setAddress] = useState("");
    const [open, setOpen] = useState(false);
    
    const handleNewChatOpen = () => {
        setOpen(true);
    };

    const handleNewChatClose = () => {
        setOpen(false);
        setRoomName("");
    };

    const createChat = (e) => {
        e.preventDefault();
        let bodyParameters = {
            address: address,
            label: roomName
        }

        try {
            api.post('/addAddressBook',
             bodyParameters
             ).then(function (success) {
                console.log(success);
                setOpen(false)
             }).catch(function (err) {
                 console.log(err)
             });
           } catch (err) {
             console.log("error", err);
        }
    }

    return (
        <div>
            <TooltipCustom 
                name="New Chat" 
                onClick={() => handleNewChatOpen()} 
                icon={<ChatIcon />}
            />

            <Dialog open={open} onClose={handleNewChatClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Novo contato</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nome"
                    type="text"
                    fullWidth
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="address"
                    label="Address"
                    type="text"
                    fullWidth
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleNewChatClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={createChat} color="primary" disabled={!roomName}>
                    Create
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default NewChat
