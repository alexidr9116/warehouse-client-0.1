import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hook/useAuth";
import { API_BILLING } from "../../utils/API";

export default function QPayBilling({ onSubmit, checked }) {
    const { user } = useAuth();
//     const [checked, setChecked] = useState((user?.role.includes("admin")));
    const [loading, setLoading] = useState(false);
    const defaultValues = useMemo(() => ({

        invoiceAlias: user?.invoiceAlias || "",
        payUsername: user?.payUsername || "",
        payPassword: user?.payPassword || "",
        payPassphrase: user?.payPassphrase || "",

    }), [user]);

    const { register, reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm(defaultValues);
    
    useEffect(() => {
        
        if (user)
            reset(defaultValues);
    }, [user, defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className="grid md:grid-cols-2 gap-5 mb-5">

                <div className="w-full">
                    <p className="font-bold text-sm pl-2"> {`Username`}</p>
                    <input className="input h-10 border border-stone-300 w-full" disabled={!checked} required
                        {...register("payUsername")} />
                </div>
                <div className="w-full">
                    <p className="font-bold text-sm pl-2"> {`Password`}</p>
                    <input className="input h-10 border border-stone-300 w-full "
                        {...register("payPassword")} disabled={!checked} />
                </div>
                <div className="w-full">
                    <p className="font-bold text-sm pl-2"> {`InvoiceAlias`}</p>
                    <input className="input h-10 border border-stone-300 w-full" required disabled={!checked}
                        {...register("invoiceAlias")} />
                </div>
                <div className="w-full">
                    <p className="font-bold text-sm pl-2"> {`Passphrase`}</p>
                    <input className="input h-10 border border-stone-300 w-full" required disabled={!checked}
                        {...register("payPassphrase")} />
                </div>

            </div>
            <div className="flex ">
                <button type="submit" className={`btn btn-info px-5 ml-auto ${loading && 'loading'}`} disabled={!checked}  >Save</button>
            </div>
        </form>
    )
}