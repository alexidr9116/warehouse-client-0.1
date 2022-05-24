import { useState, useEffect, useMemo } from "react";

import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import toast from 'react-hot-toast';
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { API_AUTH, SEND_POST_REQUEST, SEND_POST_REQUEST_WITH_FORM_DATA, ASSETS_URL, SEND_GET_REQUEST, API_CLIENT, API_WAREHOUSE, API_ADMIN, SEND_PUT_REQUEST } from "../../utils/API";

import Page from '../../component/Page';
import Image from "../../component/Image";
import { Tabs } from "react-daisyui";
import { Link } from "react-router-dom";



export default function GoodsRegister() {
    const [currentStep, setCurrentStep] = useState(0);
    const [checked, setChecked] = useState(false);
    const [useCamera, setUseCamera] = useState(false);
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();
    const [warehouse, setWarehouse] = useState({});
    const defaultValues = {
        barcode: "",
        title: "",
        mobile: "",
        weight: "",
        size: "",
        type: "",
        price: "",
        comment: "",
    };
    const { register, reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm(defaultValues);

    const barcode = (watch("barcode"));

    const onSubmit = (data) => {
        // console.log(data);
        setSaving(true);
        if (warehouse && warehouse._id) {
            SEND_PUT_REQUEST(API_ADMIN.editProduct, { ...data, warehouseId: warehouse._id }).then(res => {
                setSaving(false);
                if (res.status === 200) {
                    toast.success(res.message);
                    reset();
                    setCurrentStep(0);
                }
                else {
                    toast.error(res.message);
                }
            }).catch(err => {
                setSaving(false);
            });
        }
    }

    const handleResult = (err, result) => {
        if (result) {
            setValue('barcode', result?.text);
        }
        else{
            
        }
    }

    useEffect(() => {

        SEND_GET_REQUEST(API_WAREHOUSE.getSelf).then(res => {
            console.log(res);
            if (res.status === 200) {
                setWarehouse(res.data.warehouse);
            }
            else {
                toast('Please fill your warehouse information');
            }
        })
    }, []);


    return (
        <Page title={`Setting`} className="container px-5 py-8 text-gray-700 w-full ">

            <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full justify-center flex">
                    {currentStep === 0 &&
                        <div>
                            <div className="flex gap-10">
                                <div className="flex flex-col items-center  gap-4">
                                    <div className="text-center w-full text-lg">
                                        Scan Barcode
                                    </div>
                                    <div className="">
                                        <label className="label cursor-pointer">

                                            <input type="checkbox" className="toggle toggle-accent" onChange={() => { setUseCamera(!useCamera) }} checked={useCamera} />
                                            <span className="label-text mx-2">{t('home.scan_barcode')} </span>
                                        </label>
                                    </div>
                                    <div className="w-[280px] h-[280px] border border-stone" >
                                        {useCamera &&
                                            <BarcodeScannerComponent
                                                // width={500}
                                                // height={500}
                                                onUpdate={handleResult}
                                                style={{ width: "100%", height: "100%" }}
                                            />
                                            // <QrReader
                                            //     constraints={{ facingMode: (checked ? 'user' : 'environment') }}
                                            //     key={(checked ? 'user' : 'environment')}
                                            //     onResult={handleResult}
                                            //     delay={500}
                                            //     style={{ width: "100%", height: "100%" }}
                                            // />
                                        }
                                    </div>
                                    
                                    <input type="text" placeholder="Barcode ID" className="input input-bordered input-md w-full max-w-xs" {...register('barcode')} />

                                </div>

                                <div className="hidden lg:block mt-8">

                                    <div className="alert alert-warning shadow-sm rounded-md mb-4">
                                        <div>
                                            <Icon icon={'clarity:warning-standard-line'} width={40}> </Icon>
                                            <span>Warning: Let's Center the Barcode !</span>
                                        </div>
                                    </div>
                                    <Image src="../../assets/scan-barcode.jpg"></Image>
                                </div>

                            </div>
                            <div className="flex justify-center w-full mt-4">
                                <button disabled={(!warehouse || !warehouse._id || !barcode || (barcode && barcode.length === 0))} className="btn btn-info w-[200px] mt-2" onClick={() => setCurrentStep(1)} >Next</button>
                            </div>
                        </div>
                    }
                    {
                        currentStep === 1 && <div className="w-full flex-col max-w-xl">
                            <div className="text-lg"><IconButton onClick={() => (setCurrentStep(0))}><ArrowBackIcon></ArrowBackIcon></IconButton> General Information</div>
                            <div className="grid md:grid-cols-2 items-center justify-center  gap-4  p-4">

                                <div className="flex flex-col gap-2">
                                    <label>Mobile *</label>
                                    <input type="number" className="input input-bordered rounded"  {...register('mobile')} />
                                    <label>Weight (Kg) *</label>
                                    <input type="number" step={0.01} className="input input-bordered rounded"  {...register('weight')} />
                                    <label>Price (₮) *</label>
                                    <input type="number" step={0.01} className="input input-bordered rounded"  {...register('price')} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label>Title</label>
                                    <input className="input input-bordered rounded"  {...register('title')} />

                                    <label>Size</label>
                                    <input className="input input-bordered rounded"  {...register('size')} />
                                    <label>Type</label>
                                    <input className="input input-bordered rounded"  {...register('type')} />

                                </div>
                                <div className=" w-full md:col-span-2 flex-col flex">
                                    <label>Comment</label>
                                    <input className="input input-bordered rounded"  {...register('comment')} />
                                </div>
                                <div className=" w-full mt-4 md:col-span-2 justify-center flex">

                                    <button className={`btn btn-info w-3/4 ${saving ? 'loading' : ''}`} type="submit">Register</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </form>

        </Page >
    )


}
