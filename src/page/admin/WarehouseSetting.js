import { useState, useEffect, useMemo } from "react";

import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import toast from 'react-hot-toast';



import useAuth from "../../hook/useAuth";

import { API_AUTH, SEND_POST_REQUEST, SEND_POST_REQUEST_WITH_FORM_DATA, ASSETS_URL, SEND_GET_REQUEST, API_CLIENT, API_WAREHOUSE, API_ADMIN, SEND_PUT_REQUEST } from "../../utils/API";

import Page from '../../component/Page';
import Image from "../../component/Image";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PriceInput from "../../component/core/PriceInput";
import { fNumber, fPrice } from "../../utils/uFormatter";
import DeliveryCostInput from "../../component/core/DeliveryCostInput";



export default function WarehouseSetting() {
    const [warehouse, setWarehouse] = useState({});
    const {t}= useTranslation();
    const defaultValues = useMemo(() => ({
        img: warehouse?.img,
        chinaAddress: warehouse?.china?.address,
        chinaTel1: warehouse?.china?.address,
        chinaTel2: warehouse?.china?.address,
        chinaFrom: warehouse?.china?.from,
        chinaTo: warehouse?.china?.to,
        ubAddress: warehouse?.ub?.address,
        ubTel1: warehouse?.ub?.address,
        ubTel2: warehouse?.ub?.address,
        ubFrom: warehouse?.ub?.from,
        ubTo: warehouse?.ub?.to,
        name: warehouse?.name,
        haveBusiness: warehouse?.haveBusiness,
        openAlways: warehouse?.openAlways,
        price: warehouse?.price,
        priceY: warehouse?.priceY,
        price1: warehouse?.price1,
        price1Y: warehouse?.price1Y,
        period: warehouse?.period,
        deliveryCost1: warehouse?.deliveryCost1,
        deliveryCost2: warehouse?.deliveryCost2,
        deliveryCost3: warehouse?.deliveryCost3,
        description: warehouse?.description,
        payMethods: warehouse?.payMethods,
        increaseIndex:warehouse?.increaseIndex || 0,
        rateEmpty:0,
        rateTotal:((warehouse && warehouse.increaseRate)? warehouse.increaseRate[1] : 10),
        rateKg:(warehouse && warehouse.increaseRate)? warehouse.increaseRate[2] : 500,
        rateM3:(warehouse && warehouse.increaseRate)? warehouse.increaseRate[3] : 500,
    }), [warehouse]);
    const { register, reset, handleSubmit,getValues, setValue, watch, formState: { isSubmitting } } = useForm(defaultValues);
    const img = watch("img");
    const imageChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setValue('img', event.target.files[0]);
        }
    };

    const onSubmit = (data) => {

        const iData = new FormData();
        const {
            description,

            chinaAddress, chinaTel1, chinaTel2, chinaFrom, chinaTo,
            ubAddress, ubTel1, ubTel2, ubFrom, ubTo, payMethods,
            name, openAlways, period, price, haveBusiness, img, priceY, price1, price1Y, deliveryCost1, deliveryCost2, deliveryCost3, increaseIndex,rateKg,rateTotal,rateM3 } = data;

        iData.append("chinaAddress", chinaAddress);
        iData.append("chinaFrom", chinaFrom);
        iData.append("chinaTo", chinaTo);
        iData.append("chinaTel1", chinaTel1);
        iData.append("chinaTel2", chinaTel2);
        iData.append("ubAddress", ubAddress);
        iData.append("ubFrom", ubFrom);
        iData.append("ubTo", ubTo);
        iData.append("ubTel1", ubTel1);
        iData.append("ubTel2", ubTel2);
        iData.append("name", name);
        iData.append("haveBusiness", haveBusiness);
        iData.append("price", price);
        iData.append("priceY", priceY);
        iData.append("price1", price1);
        iData.append("price1Y", price1Y);
        iData.append("period", period);
        iData.append("description", description);
        iData.append("openAlways", openAlways);
        iData.append("payMethods", payMethods);
        iData.append("deliveryCost1", deliveryCost1);
        iData.append("deliveryCost2", deliveryCost2);
        iData.append("deliveryCost3", deliveryCost3);
        iData.append("increaseIndex", increaseIndex);
        iData.append("rateEmpty", 0);
        iData.append("rateTotal", rateTotal);
        iData.append("rateKg",rateKg);
        iData.append("rateM3", rateM3);
        iData.append("img", img);
        iData.append("id", warehouse?._id || "add");

        if (typeof img === "string") {
            SEND_PUT_REQUEST(API_ADMIN.editWarehouse, { ...data, id: (warehouse?._id || "add") }).then(res => {
                if (res.status === 200) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }

            });
        }
        if (typeof img === "object") {
            SEND_PUT_REQUEST(API_ADMIN.addWarehouse, iData).then(res => {
                if (res.status === 200) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }
            });
        }
    }
    const loadWarehouseSetting = async () => {
        SEND_GET_REQUEST(API_WAREHOUSE.getSelf).then(res => {

            if (res.status === 200) {
                setWarehouse(res.data.warehouse);
            }
            else {

            }
        })
    }
    useEffect(() => {
        loadWarehouseSetting();
    }, []);
    useEffect(() => {

        if (warehouse)
            reset(defaultValues);
    }, [warehouse, defaultValues, reset]);

    const price = watch('price');
    const price1 = watch("price1");

    useEffect(() => {
        if (price > 0) {
            setValue('priceY', parseFloat(fNumber(price / 460)));
        }
        if (price1 > 0) {
            setValue('price1Y', parseFloat(fNumber(price1 / 460)));
        }
    }, [price, price1])
    const [currentTab, setCurrentTab] = useState(1);
    return (
        <Page title={`Setting`} className="container px-5 py-8 text-gray-700 w-full ">

            <p className=" font-bold text-2xl mb-5"> {`Warehouse Setting`}</p>
            <div className="tabs" >
                <div className={`tab tab-lifted ${currentTab === 1 ? 'tab-active' : ''}`} onClick={() => { setCurrentTab(1) }}>{t('select.general')}</div>
                <div className={`tab tab-lifted ${currentTab === 2 ? 'tab-active' : ''}`} onClick={() => { setCurrentTab(2) }}>{t('select.ch')}</div>
                <div className={`tab tab-lifted ${currentTab === 3 ? 'tab-active' : ''}`} onClick={() => { setCurrentTab(3) }}>{t('select.ub')}</div>

                <div className="tab tab-lifted mr-6 flex-1 cursor-default"></div>
            </div>

            <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full justify-center flex">
                    {currentTab === 1 &&
                        <div className="grid lg:grid-cols-2 gap-2 p-4 w-full max-w-[700px]">

                            <div className="card p-6  gap-3  h-full text-center ">
                                <h4 className="text-lg">{t('warehouse.chooseImage')}</h4>
                                {/* img */}
                                <div className="mx-auto relative ">
                                    {img &&
                                        <Image className="w-32 h-32 rounded  outline-dashed outline-stone-300 outline-offset-4 outline-1"
                                            src={typeof img === 'string' ? `${ASSETS_URL.root}${img}` : URL.createObjectURL(img)}
                                        />
                                    }
                                    {!img &&
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
                                <div className="w-full flex flex-col gap-2 mt-1">

                                    <label className="w-full text-left">{t('warehouse.name')}*</label>
                                    <input required placeholder="Input your warehouse name" className="input border-cyan-500 input-bordered rounded w-full" {...register("name")} />
                                    <label className="w-full text-left">{t('warehouse.description')}</label>
                                    <textarea className="textarea textarea-bordered rounded w-full" {...register("description")} rows={4} />
                                </div>


                            </div>

                            <div className="flex flex-col gap-2">
                                <label>{t('table.alwaysOpen')}?</label>
                                <select className="select select-bordered " {...register("openAlways")} >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                                <label>{t('warehouse.period')}*</label>
                                <input required type="number" className="input input-bordered "{...register("period")} ></input>
                                <label>{t('table.price')}(Kg)* {warehouse && `${fPrice(warehouse?.price, '₮')},${fPrice(warehouse?.priceY, '¥')}`}</label>
                                <PriceInput registers={[{ ...register("price") }, { ...register("priceY") }]} />
                                <label>{t('table.price')}(M³)* {warehouse && `${fPrice(warehouse?.price1, '₮')},${fPrice(warehouse?.price1Y, '¥')}`}</label>
                                <PriceInput registers={[{ ...register("price1") }, { ...register("price1Y") }]} />
                                <label>{t('warehouse.certification')}?</label>
                                <select className="select select-bordered " {...register("haveBusiness")} >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                                <label>{t('table.paymentMethods')}</label>
                                <select className="select select-bordered " {...register("payMethods")} >
                                    <option value={''} disabled>{t('select.payment')}</option>
                                    <option value={'any'}>{t('select.any')}</option>
                                    <option value={'qpay'}>{t('select.qpay')}</option>
                                    <option value={'manually'}>{t('table.manually')}</option>
                                </select>
                            </div>
                        </div>
                    }
                    {currentTab === 2 &&
                        <div className="grid gap-2 p-4 max-w-[450px] w-full">

                            <label>{t('warehouse.address')}</label>
                            <input className="input input-bordered rounded w-full" {...register("chinaAddress")} />
                            <label>{t('warehouse.time')} (From,To)</label>
                            <div className="flex justify-between items-center">
                                <input type="number" className="input  input-bordered rounded  w-full" {...register("chinaFrom")} />
                                &nbsp;To&nbsp;
                                <input type="number" className="input  input-bordered rounded  w-full"  {...register("chinaTo")} />
                            </div>
                            <label>{t('warehouse.telephones')}</label>
                            <div className="flex justify-between items-center">
                                <input type="number" className="input  input-bordered rounded  w-full" placeholder="Telephone1"  {...register("chinaTel1")} />
                                &nbsp;,&nbsp;
                                <input type="number" className="input  input-bordered rounded  w-full" placeholder="Telephone2"  {...register("chinaTel2")} />
                            </div>
                            <label>{t('warehouse.increaseRate')}</label>
                            <DeliveryCostInput defaultValue={0} prefix={
                                <label className="label cursor-pointer ">

                                    <input type="radio" name="radio-6"  {...register('increaseIndex')}
                                        className="radio checked:bg-red-500" value ={0} defaultChecked = {(getValues('increaseIndex') === 0)}/>
                                    <span className="label-text">&nbsp; No Setting</span>
                                </label>} suffix="disabled" registers={[{ ...register('rateEmpty') }]} />
                            <DeliveryCostInput defaultValue={10} prefix={
                                <label className="label cursor-pointer">

                                    <input type="radio" name="radio-6"
                                        className="radio checked:bg-red-500" value ={1} {...register('increaseIndex')} defaultChecked = {(getValues('increaseIndex') === 1)} />
                                    <span className="label-text">&nbsp; {t('warehouse.total')}</span>
                                </label>} suffix="%" registers={[{ ...register('rateTotal') }]} />
                            <DeliveryCostInput defaultValue={500} prefix={
                                <label className="label cursor-pointer">

                                    <input type="radio" name="radio-6" value ={2} defaultChecked = {(getValues('increaseIndex') === 2)} 
                                        className="radio checked:bg-red-500" {...register('increaseIndex')} />
                                    <span className="label-text">&nbsp; + {t('warehouse.costPer')} Kg</span>
                                </label>} suffix="₮/Kg" registers={[{ ...register('rateKg') }]} />
                            <DeliveryCostInput defaultValue={500} prefix={
                                <label className="label cursor-pointer">

                                    <input type="radio" name="radio-6" value ={3} defaultChecked = {(getValues('increaseIndex') === 3)} 
                                        className="radio checked:bg-red-500" {...register('increaseIndex')} />
                                    <span className="label-text">&nbsp;  + {t('warehouse.costPer')} M³ </span>
                                </label>} suffix="₮/M³" registers={[{ ...register('rateM3') }]} />
                        </div>
                    }
                    {currentTab === 3 &&
                        <div className="grid gap-2 p-4 max-w-[450px] w-full">

                            <label>{t('warehouse.address')}</label>
                            <input className="input input-bordered rounded w-full" {...register("ubAddress")} />
                            <label>{t('warehouse.time')} (From,To)</label>
                            <div className="flex justify-between items-center">
                                <input type="number" className="input  input-bordered rounded  w-full" {...register("ubFrom")} />
                                &nbsp;To&nbsp;
                                <input type="number" className="input  input-bordered rounded  w-full"  {...register("ubTo")} />
                            </div>
                            <label>{t('warehouse.telephones')}</label>
                            <div className="flex justify-between items-center">
                                <input type="number" className="input  input-bordered rounded  w-full" placeholder="Telephone1"  {...register("ubTel1")} />
                                &nbsp;,&nbsp;
                                <input type="number" className="input  input-bordered rounded  w-full" placeholder="Telephone2"  {...register("ubTel2")} />
                            </div>
                            <label>{t('warehouse.deliveryCost')}</label>
                            <DeliveryCostInput defaultValue={10} prefix={t('select.general')} suffix="%" registers={[{ ...register('deliveryCost1') }]} />
                            <DeliveryCostInput defaultValue={40000} prefix={t('select.box')} suffix="less ₮" registers={[{ ...register('deliveryCost2') }]} />
                            <DeliveryCostInput defaultValue={0} prefix={t('select.personal')} suffix="₮" registers={[{ ...register('deliveryCost3') }]} />
                        </div>
                    }

                </div>
                <div className="w-full justify-center flex border-t p-4">
                    <button className="btn btn-info" type="submit">{t('words.saveSetting')}</button>

                </div>
            </form>

        </Page >
    )


}
