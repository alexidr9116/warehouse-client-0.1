import { useEffect, useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Page from "../../component/Page";
import Image from '../../component/Image';
import useAuth from '../../hook/useAuth';


export default function Login() {
    const {t} = useTranslation();

    const { login, passwordVerify } = useAuth();

    const { state } = useLocation();

    const [step, setStep] = useState('login');

    const navigate = useNavigate();

    const defaultValue = {
        mobile: '',
    }
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: defaultValue });
    const [saving,setSaving] = useState(false);
    useEffect(() => {
        if (state?.verify)
            setStep('password')
    }, [state])

    const onSubmit = (data) => {
        setSaving(true);
        if (step === 'login')
            onLogin(data);
        else if (step === 'password')
            onPassword(data);
        else if (step === 'setpassword')
            onSetPassword(data);
    }

    const onLogin = async (data) => {
        try {
            const result = await login(data.mobile);
            setSaving(false)
            if (result === 'password') {
                setStep('password');
            } else if (result === 'otp') {
                navigate('/auth/verify-otp');
            } else if (result === 'navigate') {
                navigate('/');
            }
            else if (result === "error") {
                toast.error("Can not login, try again");
            }
            else{
                toast.error("Login with this mobile number, check your mobile number");
            }
        } catch (error) {

        }

        // setStep('pincode');
    };

    const onPassword = async (data) => {
        try {
            const result = await passwordVerify(data.mobile, data.password);
            setSaving(false)
            if (result.success) {
                navigate('/')
            } else {
                toast.error(result.message);
                navigate('/auth/login');
            }
        } catch (err) {
            toast.error("Can not login, try again");

            console.log(err);
        }
    }

    const onSetPassword = async (data) => {
        navigate('/');
    }

    return (
        <Page title="Login">
            <div className="container justify-center  p-6 flex">
                <div className="border flex p-2 rounded-sm">
                    <div className="flex items-center p-4" >
                        <Image src='../../assets/login.png' className='hidden sm:block'>

                        </Image>

                    </div>
                    <form className="rounded  flex flex-col items-center gap-4 p-8"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <img src='../../assets/avatar.jpg' className='block  w-16 h-16' alt={"login-avatar"}>

                        </img>
                        <p className="text-center  mb-1">{t('login.title')}</p>

                        <div className="w-full">
                            <p className="font-bold mb-2">{t('login.phoneNumber')}</p>
                            <input className="input h-10 border border-stone-300 w-full" required   {...register("mobile")} />
                        </div>

                        {step === 'password' &&
                            <div className="w-full">
                                <p className="font-bold mb-2">{t('login.password')}</p>
                                <input className="input h-10 border border-stone-300 w-full" type='password' required minLength={4} {...register("password")} />
                            </div>
                        }

                        {step === 'first'
                            ? <div className="w-full">
                                <p className="font-bold mb-2">{t('login.confirm')}</p>
                                <input className="input h-10 border border-stone-300 w-full" type='password' required minLength={4} {...register("confirm")} />
                            </div>
                            : <Link to="/auth/forget">{t('login.forgot')}</Link>
                        }

                        <button className={`btn mt-4 btn-info w-3/5  uppercase  ${saving && 'loading'}`} type="submit">{t('login.login')}
                        </button>
                    </form>
                </div>
            </div>
        </Page>
    )
}
