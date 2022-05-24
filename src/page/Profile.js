import Image from "../component/Image";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import useAuth from "../hook/useAuth";
import { useEffect, useMemo } from "react";
import { API_AUTH, SEND_POST_REQUEST, SEND_POST_REQUEST_WITH_FORM_DATA, ASSETS_URL } from "../utils/API";
import toast from 'react-hot-toast';
import Page from '../component/Page';


export default function Profile() {
    const { user, initialize } = useAuth();

    const defaultValues = useMemo(() => ({
        avatar: user?.avatar,
        firstName: user?.firstName,
        lastName: user?.lastName,
        mobile: user?.mobile,
        email: user?.email,
        address: user?.address,
        chStaff: user?.chStaff || "",
        mnStaff: user?.mnStaff || "",

    }), [user]);
    const { register, reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm(defaultValues);
    const avatar = watch("avatar");
    const imageChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setValue('avatar', event.target.files[0]);
        }
    };

    const onSubmit = (data) => {
        const iData = new FormData();
        const { firstName, lastName, address, email, avatar } = data;
        iData.append("firstName", firstName);
        iData.append("lastName", lastName);
        iData.append("address", address);
        iData.append("email", email);
        iData.append("avatar", avatar);
        if (typeof avatar === "string") {
            SEND_POST_REQUEST(API_AUTH.setProfileWithoutImage, data).then(res => {
                if (res.status === 200) {
                    toast.success("Your profile was changed");
                    initialize();
                }
                else {
                    toast.error(res.message);
                }


            });
        }
        if (typeof avatar === "object") {
            SEND_POST_REQUEST_WITH_FORM_DATA(API_AUTH.setProfileWithImage, iData).then(res => {
                if (res.status === 200) {
                    toast.success("Your profile was changed");
                    initialize();
                }
                else {
                    toast.error(res.message);
                }
            });
        }
    }
    useEffect(() => {
        if (user)
            reset(defaultValues);
    }, [user, defaultValues, reset]);

    return (
        <Page title={`Profile`}>
            <div className="container px-5 py-8 text-gray-700 ">
                <p className=" font-bold text-2xl mb-5"> {`User Profile`}</p>
                <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-5 rounded-2xl shadow-lg bg-white">
                    <div className="card p-6  gap-5  h-full ">
                        {/* avatar */}
                        <div className="mx-auto relative ">
                            {avatar &&
                                <Image className="w-32 h-32 rounded-full outline-dashed outline-stone-300 outline-offset-4 outline-1"
                                    src={typeof avatar === 'string' ? `${ASSETS_URL.root}${avatar}` : URL.createObjectURL(avatar)}
                                />
                            }
                            <input hidden id="avatar" type="file" accept="image/*" onChange={imageChange} />
                            <label htmlFor="avatar" className="rounded-lg border bg-gray-50 w-9 h-9 cursor-pointer flex absolute bottom-0 right-0">
                                <Icon icon={'fa:pencil'} width={20} className="m-auto text-stone-500" />
                            </label>
                        </div>

                        <p className="text-gray-500 text-center text-sm">
                            Allowed *.jpeg, *.jpg, *.png, *.gif <br />
                            max size of 3.1 MB
                        </p>
                    </div>

                    <div className=" md:col-span-2   p-6 gap-3">
                        <div className="grid md:grid-cols-2 gap-5 mb-5">
                            <div className="w-full">
                                <p className="font-bold text-sm pl-2"> {`First Name`}</p>
                                <input className="input h-10 border border-stone-300 w-full" required
                                    {...register("firstName")} />
                            </div>
                            <div className="w-full">
                                <p className="font-bold text-sm pl-2"> {`Last Name`}</p>
                                <input className="input h-10 border border-stone-300 w-full" required
                                    {...register("lastName")} />
                            </div>
                            <div className="w-full">
                                <p className="font-bold text-sm pl-2"> {`Mobile`}</p>
                                <input className="input h-10 border border-stone-300 w-full " readOnly disabled
                                    {...register("mobile")} />
                            </div>
                            <div className="w-full">
                                <p className="font-bold text-sm pl-2"> {`Email`}</p>
                                <input className="input h-10 border border-stone-300 w-full" required
                                    {...register("email")} />
                            </div>
                            {user && user.role.includes('admin') && <>
                                <div className="w-full">
                                    <p className="font-bold text-sm pl-2"> {`Chinese Staff Key`}</p>
                                    <input className="input h-10 border border-stone-300 w-full " readOnly disabled
                                        {...register("chStaff")} />
                                </div>
                                <div className="w-full">
                                    <p className="font-bold text-sm pl-2"> {`Mongolian Staff Key`}</p>
                                    <input className="input h-10 border border-stone-300 w-full" readOnly disabled
                                        {...register("mnStaff")} />
                                </div></>
                            }
                            <div className="w-full  md:col-span-2">
                                <p className="font-bold text-sm pl-2">{`Address`}</p>
                                <input className="input h-10 border border-stone-300 w-full" required
                                    {...register("address")} />
                            </div>
                        </div>
                        <div className="flex ">
                            <button type="submit" className={`btn btn-info px-5 ml-auto ${isSubmitting && 'loading'}`}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </Page>
    )


}
