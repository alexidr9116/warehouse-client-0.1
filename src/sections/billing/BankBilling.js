import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Image from "../../component/Image";
import useAuth from "../../hook/useAuth";
import { API_BILLING, ASSETS_URL } from "../../utils/API";

export default function BankBilling({ onSubmit, checked }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    // const [checked, setChecked] = useState((user?.role.includes("admin")));
    const [loading, setLoading] = useState(false);
    const defaultValues = useMemo(() => ({

        bankName: user?.bank?.bankName || "",
        bankAccountName: user?.bank?.accountName || "",
        bankAccountNumber: user?.bank?.accountNumber || "",
        bankQr: user?.bank?.qr || "",

    }), [user]);

    const { register, reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm(defaultValues);
    const bankQr = watch("bankQr");
    
    const imageChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setValue('bankQr', event.target.files[0]);
        }
    };
    useEffect(() => {
        if (user)
            reset(defaultValues);
    }, [user, defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className="grid lg:grid-cols-2 gap-2 p-4 w-full max-w-[700px]">

                <div className="card p-6  gap-3  h-full text-center ">
                    <h4 className="text-lg">{t('billing.chooseQr')}</h4>
                    {/* img */}
                    <div className="mx-auto relative ">
                        {bankQr && 
                            <Image className="w-32 h-32 rounded  outline-dashed outline-stone-300 outline-offset-4 outline-1"
                                src={typeof bankQr === 'string' ? `${ASSETS_URL.root}${bankQr}` : URL.createObjectURL(bankQr)}
                            />
                        }
                        {!bankQr &&
                            <Image className="w-32 h-32 rounded  outline-dashed outline-stone-300 outline-offset-4 outline-1"
                                src={`${ASSETS_URL.image}empty.jpg`}
                            />}
                        <input hidden id="img" type="file" accept="image/*" onChange={imageChange} />
                        <label htmlFor="img" className="rounded-lg border bg-gray-50 w-9 h-9 cursor-pointer flex absolute bottom-0 right-0">
                            <Icon icon={'fa:pencil'} width={20} className="m-auto text-stone-500" />
                        </label>
                    </div>

                    <p className="text-gray-500 text-center text-sm mb-2">
                        Allowed *.jpeg, *.jpg, *.png, *.gif <br />
                        max size of 3.1 MB
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <label>{t('billing.bankName')}</label>
                    <input required className="input input-bordered "{...register("bankName")} disabled={!checked}></input>

                    <label>{t('billing.bankAccountName')}</label>
                    <input required className="input input-bordered "{...register("bankAccountName")} disabled={!checked}></input>

                    <label>{t('billing.bankAccountNumber')}</label>
                    <input type = "number" required className="input input-bordered "{...register("bankAccountNumber")} disabled={!checked}></input>
                </div>
            </div>
            <div className="flex ">
                <button type="submit" className={`btn btn-info px-5 ml-auto ${loading && 'loading'}`} disabled={!checked}  >{t('words.save')}</button>
            </div>
        </form>
    )
}