import { Icon } from "@iconify/react";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "../../component/Image";
import Page from "../../component/Page";

import { API_ADMIN, ASSETS_URL, SEND_DELETE_REQUEST, SEND_POST_REQUEST } from "../../utils/API";
import Accordion from '../../component/Accordion';

import Pagination from "../../component/core/Pagination";
import SearchInput from "../../component/core/SearchInput";
import AlertModal from "../../component/core/AlertModal";

import toast from "react-hot-toast";
export default function UsersList() {

    const [users, setUsers] = useState([]);
    const [current, setCurrent] = useState({});
    const [filtered, setFiltered] = useState([]);
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState(false);
    const [promptAdmin, setPromptAdmin] = useState(false);
    const [promptTitle, setPromptTitle] = useState("");
    const [promptActive, setPromptActive] = useState(false);
    const pagePerCount = 10;
    useEffect(() => {
        SEND_POST_REQUEST(API_ADMIN.users, {}).then(res => {
            if (res.status === 200) {
                const list = res.data.users;

                setUsers(list);
                setFiltered(list.slice(0, Math.min(pagePerCount, list.length)))
            }
        });

    }, [])
    const handleChangeSearch = (text) => {
        setFiltered(users.filter((user) => (user.mobile.includes(text) || user.email.includes(text) || user.firstName.includes(text) || user.lastName.includes(text))));
    }
    const handleChangePage = (index) => {
        setFiltered(users.slice((index - 1) * pagePerCount, Math.min((index) * pagePerCount, users.length)));
    }
    const handleActiveOk = () => {
        SEND_POST_REQUEST(API_ADMIN.changeUserStatus, { id: current._id }).then(res => {
            if (res.status === 200) {
                toast.success(res.message);
                setUsers((prev) => (prev.map((user, index) => {
                    if (user._id === current._id) {
                        user.status = (user.status === "active" ? "inactive" : "active");
                    }
                    return user;
                })));
            }
            else {
                toast.error(res.message);
            }
            setPromptActive(false);
        });


    }
    const handleSwithcAdminOk = () => {
        SEND_POST_REQUEST(API_ADMIN.changeAdminStatus, { id: current._id }).then(res => {
            if (res.status === 200) {
                toast.success(res.message);
                setUsers((prev) => (prev.map((user, index) => {
                    if (user._id === current._id) {
                        user.role = (user.role.includes("admin") ? "user" : "admin");
                    }
                    return user;
                })));
            }
            else {
                toast.error(res.message);
            }
            setPromptAdmin(false);
        });


    }
    const handleActive = (user, index) => {
        setCurrent(user);
        setPromptActive(true);
        setPromptTitle("Do you want to change this user's status, really?")
    }
    const handleAdmin = (user,index)=>{
        setCurrent(user);
        setPromptAdmin(true);
        setPromptTitle("Do you want to change this user's status, really?")
    }
    const handleRemove = (user, index) => {
        setCurrent(user);
        setPrompt(true);
        setPromptTitle("Do you want to delete this user from system, really?")
    }
    const handleRemoveOk = () => {

        SEND_DELETE_REQUEST(API_ADMIN.removeUser, current._id).then(res => {
            if (res.status === 200) {
                toast.success(res.message);
                setUsers((prev) => (prev.filter(user => user._id !== current._id)));
            }
            else {
                toast.error(res.message);
            }
            setPrompt(false);
        });
    }
    return (
        <Page title='UserManagement' className="flex w-full flex-col gap-4">
            {/* Date chooser */}

            <div className="container p-2">
                <div className="flex w-full justify-end mb-2">
                    <SearchInput handleChangeSearch={handleChangeSearch} />

                </div>
                <div className="overflow-x-auto w-full" >
                    <table className="table w-full border-b table-compact">
                        <thead className= "">
                            <tr>
                                <td ></td>
                                <td className="py-4">Mobile</td>
                                <td>Name</td>
                                <td>Address</td>
                                <td>Email</td>
                                <td>Active</td>
                                <td>Admin?</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>

                            {filtered.length === 0 && <tr><td colSpan={7}><div className="text-center p-4 text-lg">No Users Found</div></td></tr>}
                            {filtered.map((user, index) => {

                                return (
                                    <tr key={index}>
                                        <td>  <Image effect="blur" src={`${ASSETS_URL.root}${user.avatar}`} height={50} width={50} /></td>
                                        <td>{user?.mobile}</td>
                                        <td>{user?.firstName} {user?.lastName}</td>
                                        <td>{user?.address}</td>
                                        <td>{user?.email}</td>
                                        <td><input type="checkbox" className="toggle toggle-accent" onChange={() => handleActive(user, index)} checked={user.status === "active"} /></td>
                                        <td><input type="checkbox" className="toggle toggle-accent" onChange={() => handleAdmin(user, index)} checked={user.role.includes("admin")} /></td>
                                        <td> <button className="btn btn-outline btn-error btn-sm" onClick={() => handleRemove(user, index)}><Icon icon='ei:trash' width={30}></Icon></button></td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>
                {filtered.length > 0 &&
                    <div className="flex justify-end w-full" >
                        <Pagination totalCount={users.length} handleChangePage={handleChangePage} perPageCount={pagePerCount} /></div>
                }
                {promptActive &&
                    <AlertModal onAccept={handleActiveOk} title={promptTitle} description={"If you proceed this operation, the user status will be change from db. "}
                        onCancel={() => setPromptActive(false)} />
                }
                {promptAdmin &&
                    <AlertModal onAccept={handleSwithcAdminOk} title={promptTitle} description={"If you proceed this operation, the user status will be change from db. "}
                        onCancel={() => setPromptAdmin(false)} />
                }
                {prompt &&
                    <AlertModal onAccept={handleRemoveOk} title={promptTitle} description={"If you proceed this operation, the user data will be remove from db. "}
                        onCancel={() => setPrompt(false)} />
                }

            </div>
        </Page>
    )
}