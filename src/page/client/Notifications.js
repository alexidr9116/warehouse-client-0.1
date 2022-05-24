import { Icon } from "@iconify/react";
import { DeleteOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import SearchInput from "../../component/core/SearchInput";
import Image from "../../component/Image";
import Page from "../../component/Page";
import { setNotificationsToStore } from "../../store/action/notificationAction";


import { API_CLIENT, ASSETS_URL, SEND_DELETE_REQUEST, SEND_GET_REQUEST, SEND_POST_REQUEST, SEND_PUT_REQUEST } from "../../utils/API";
import { fShortDate } from "../../utils/uFormatter";

export default function Notifications() {
    const [senders, setSenders] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const { notifications } = useSelector((state) => state.notification);
    const handleSelectUser = (id) => {
        
        const _sender = senders.filter(u => (u._id === id))[0];
        setSelected(_sender.notifications)
        setSelectedUser(_sender);
    }
    const handleDeleteNotification = (id) => {
        SEND_DELETE_REQUEST(`${API_CLIENT.deleteNotification}`,id).then(res => {
            if (res.status === 200) {
                const __notifications = [];
                for (const _notification of notifications.slice(0, notifications.length)) {
                    if (_notification._id !== id) {
                        __notifications.push({ ..._notification})
                    }
                }
                setNotificationsToStore(__notifications);
                loadList();
            }
        });
        

    }
    const loadList = () => {
        SEND_GET_REQUEST(API_CLIENT.getReceivedNotifications).then((res) => {
            if (res.status === 200) {
                const _senders = [];
                const _data = res.data.notifications;
                setSelected(_data);
                // await setNotificationsToStore(_data);
             
                for (const _notification of _data) {
                    const _filter = _senders.filter((u) => (u._id === _notification.sender._id));
                    if (_filter.length === 0) {
                        const _sender = _notification.sender;

                        _sender.notifications = [];
                        _sender.notifications.push(_notification);
                        _senders.push(_sender);
                    }
                    else {
                        const _sender = _filter[0];
                        _sender.notifications.push(_notification);

                    }
                }
                // console.log(_senders);
                setSenders(_senders);
            }
            else {
                toast.error(res.message);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const handleRead = async (id) => {
        const __notifications = [];
        for (const _notification of notifications.slice(0, notifications.length)) {
            if (_notification._id === id) {
                __notifications.push({ ..._notification, read: true })
            }
            else {
                __notifications.push({ ..._notification })
            }
        }
        setNotificationsToStore(__notifications);

        setSelected((prev) => (prev.map((p, index) => {
            if (p._id === id) {
                p.read = true;

            }
            return p;
        })));

        if (selectedUser && selectedUser.notifications) {
            const _notifications = selectedUser.notifications;
            for (const _notification of _notifications) {
                if (_notification._id === id) {
                    _notification.read = true;
                }
            }
            const _selectedUser = { ...selectedUser, notifications: _notifications };
            setSelectedUser(_selectedUser);
        }
        SEND_PUT_REQUEST(API_CLIENT.readNotification, { id });

    }
    useEffect(() => {
        loadList();
    }, []);
    return (
        <Page title="Notification" className="flex flex-col lg:flex-row gap-4 p-2">
            {/* Contacts */}
            <div className="flex flex-col">
                <div className="flex w-full mb-2">
                    <SearchInput button={true} />
                </div>
                {senders.map((sender, index) => {
                    return (
                        <div className="w-full flex cursor-pointer gap-1 items-center border-b p-2 " key={index} onClick={() => handleSelectUser(sender._id)}>
                            <Image src={`${ASSETS_URL.root}${sender.avatar}`} alt="avatar"
                                className="rounded-full w-10 h-10 " width={40} height={40} />
                            <label className="grow">{sender.firstName}{sender.lastName}-{sender.mobile}</label>
                            <label className="badge badge-error">&nbsp;{sender.notifications.filter((n) => (n.read === false)).length}</label>
                        </div>
                    )
                })}
            </div>
            {/* Messages */}
            <div className="flex flex-col p-2 border rounded-md h-full overflow-y-auto w-full lg:min-w-[300px] min-h-[600px]">
                {selected.map((notification, index) => {
                    return (
                        <React.Fragment key={index}>
                            {
                                notification && (notification.type === "sms") &&
                                <div className="alert alert-warning shadow-sm rounded-md mb-4" >
                                    <div>
                                        <IconButton onClick={()=>handleDeleteNotification(notification._id)} ><DeleteOutlined></DeleteOutlined></IconButton>

                                        <div className="flex flex-col gap-2">
                                            <Icon icon={'fa-solid:sms'} width={40}> </Icon>
                                            <p>{notification.content}</p>
                                            <div className="flex justify-between">
                                                <p>{fShortDate(notification.created)}</p>
                                                {notification.read &&
                                                    <Icon icon="akar-icons:double-check"></Icon>
                                                }
                                                {!notification.read &&
                                                    <Icon icon="akar-icons:check" onClick={() => handleRead(notification._id)}></Icon>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                notification && (notification.type === "payment") &&
                                <div className="alert alert-info shadow-sm rounded-md mb-4">
                                    <div>
                                        <IconButton  onClick={()=>handleDeleteNotification(notification._id)} ><DeleteOutlined></DeleteOutlined></IconButton>

                                        <div className="flex flex-col gap-2">
                                            <Icon icon={'material-symbols:payments-outline'} width={40} > </Icon>
                                            <p>{notification.content}</p>
                                            <div className="flex justify-between">
                                                <p>{fShortDate(notification.created)}</p>

                                                {notification.read &&
                                                    <Icon icon="akar-icons:double-check"></Icon>
                                                }
                                                {!notification.read &&
                                                    <Icon icon="akar-icons:check" onClick={() => handleRead(notification._id)} className="cursor-pointer"></Icon>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            }

                        </React.Fragment>
                    )
                }
                )}

            </div>
        </Page>
    )
}