import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useStateValue } from "../StateProvider";
//importing firebase
import db from "../firebase";
import { auth, storage, firebase } from "../firebase";
import api from "../services/api";
//importing components
import UserAvatar from "./UserAvatar";
import NewChat from "./NewChat";
import Status from "./Status";
import DropdownMenu from "../shared/DropdownMenu";
import DrawerLeft from "./DrawerLeft";
import SearchBar from "../shared/SearchBar";
import SidebarChat from "./SidebarChat";
import SidebarChat2 from "./SidebarChat2";
import { toastInfo } from "../shared/toastInfo";
import TooltipCustom from "../shared/TooltipCustom";
//importing material-ui

import CircularProgress from "@material-ui/core/CircularProgress";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

//importing styles
import "./Sidebar.css";

function Sidebar({ rooms, setIsRoomExist, isRoomExist }) {
  const history = useHistory();
  const { roomId } = useParams();
  const [{ user }] = useStateValue();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [menuSidebar, setMenuSidebar] = useState(null);
  const [isSearchFound, setIsSetSearchFound] = useState(false);
  const [status, setStatus] = useState('');
  const [contacts, setContacts] = useState('');

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const getContacts = async () => {
    try {
      await api.get('getContactsBook')
      .then(function (data) {
        setContacts(data.data)
      }).catch(function (err) {
          console.log(err)
      });
    } catch (err) {
      console.log("erro", err);
    }
  };

  const findRoom = function (myRooms) {
    return function (x) {
      var searchRoom = x.data.name + "";
      return (
        searchRoom.toLowerCase().includes(myRooms.toLowerCase()) || !myRooms
      );
    };
  };

  useEffect(() => {
    const roomResult = () => {
      return (
        <>
          {rooms.filter(findRoom(search)).map((room) => (
            <p key={room.id}>{room.name}</p>
          ))}
        </>
      );
    };

    if (search) {
      var result = roomResult();
      // console.log("result", result)
      if (result.props.children.length > 0) {
        setIsSetSearchFound(true);
        // console.log("search sucess");
      } else {
        setIsSetSearchFound(false);
        // console.log("search fail");
      }
    }

    //checks if room exists, else will be redirect to landing screen
    var roomList = rooms;
    if (roomList) {
      //checks if the current route(roomId) exists in roomList(array)
      const index = roomList.findIndex(function (id, index) {
        return id.id === roomId;
      });

      if (index >= 0) {
        setIsRoomExist(index);
        // console.log("ROOM EXISTS");
      } else if (index === -1) {
        setIsRoomExist(index);
        // history.push("/");
        // console.log("ROOM DOES NOT EXIST");
      }
    }
  }, [search, rooms, roomId, history, setIsRoomExist]);

  useEffect(() => {
    if (rooms) {
      if (rooms.length > 0) {
        setNoRooms(false);
        setLoading(true);
      } else if (rooms.length === 0 && isRoomExist === -1) {
        setNoRooms(true);
        setLoading(true);
      }
    }
  }, [rooms]);

  useEffect(() => {
    getContacts();
  }, []);

  // console.log("ROOMS> >", noRooms);
  // console.log("ROOMS EXIST> >", isRoomExist);

  const handleDrawerLeftOpen = () => {
    setMenuSidebar(null);
    setDrawerLeft(true);
  };

  const handleMenuOpen = (event) => {
    setMenuSidebar(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuSidebar(null);
  };

  const archive = () => {
    const archive = "archive";
    toastInfo("Archive is not yet available!", archive, "top-center");
  };

  const starred = () => {
    const starred = "starred";
    toastInfo("Starred is not yet available!", starred, "top-center");
  };

  const settings = () => {
    const settings = "settings";
    toastInfo("Settings is not yet available!", settings, "top-center");
  };

  const logout = () => {
    if (user.isAnonymous === true) {
      auth.currentUser
        .delete()
        .then(function () {
          history.push("/");
        })
        .catch(function (error) {
          // An error happened.
          console.log("error deleting anonymous user", error);
        });
    } else {
      auth.signOut();
    }
  };

  const menuLists = [
    {
      title: "Profile",
      onClick: () => handleDrawerLeftOpen(),
      id: Math.random() * 100000,
    },
    {
      title: "Archived",
      onClick: () => archive(),
      id: Math.random() * 100000,
    },
    {
      title: "Starred",
      onClick: () => starred(),
      id: Math.random() * 100000,
    },
    {
      title: "Settings",
      onClick: () => settings(),
      id: Math.random() * 100000,
    },
    {
      title: "Logout",
      onClick: () => logout(),
      id: Math.random() * 100000,
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <UserAvatar
          id="UserProfile"
          photoURL={user.photoURL}
          onClick={() => handleDrawerLeftOpen()}
        />
        <DrawerLeft
          drawerLeft={drawerLeft}
          setDrawerLeft={setDrawerLeft}
          db={db}
          auth={auth}
          storage={storage}
        />

        <div className="sidebar__headerRight">
          <Status />
          <NewChat db={db} user={user} firebase={firebase} />
          <TooltipCustom
            name="Menu"
            icon={<MoreVertIcon />}
            onClick={handleMenuOpen}
          />
          <DropdownMenu
            menuLists={menuLists}
            menu={menuSidebar}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
          />
        </div>
      </div>

      <FormControl className="select_status">
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          onChange={handleChangeStatus}
        >
          <MenuItem value={0}>Em atendimento</MenuItem>
          <MenuItem value={1}>Espernando atendimento</MenuItem>
          <MenuItem value={2}>Encerrado</MenuItem>
        </Select>
      </FormControl>

      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Search or start new chat"
      />

      <div className="sidebar__chats">
        {loading ? (
          <>
            {search ? (
              <>
                {isSearchFound ? (
                  <div>
                    {contacts.filter((c) => c.label === search).map((contact) => (
                      <SidebarChat2
                        key={contact.address}
                        id={contact.address}
                        contact={contact}
                        last_message='test'
                      />
                    ))}

                  </div>
                ) : (
                  <div className="sidebar__chatsContainer_empty">
                    <span>No chat found</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {contacts ? contacts.map((contact) => (
                  <SidebarChat2
                    key={contact.address}
                    id={contact.address}
                    contact={contact}
                    last_message='test'
                  />
                )): <></>}
              </>
            )}
          </>
        ) : (
          <div className="sidebar__chatsContainer_loading">
            <div>
              <CircularProgress />
            </div>
          </div>
        )}

        {noRooms && loading ? (
          <div className="sidebar__chatsContainer_empty">
            <span>No chats</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Sidebar;
