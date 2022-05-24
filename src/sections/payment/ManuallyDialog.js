import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "../../component/Image";
import { ASSETS_URL } from "../../utils/API";
import { fPrice } from "../../utils/uFormatter";

export default function ManuallyDialog({bank, warehouse, products, onAccept, onClose }) {
    const [currentTab, setCurrentTab] = useState(1);
    const { t } = useTranslation();
    return (
        <div className={`modal modal-open bg-black/0 `}>
            <div className=" fixed inset-0 bg-black/80" onClick={onClose} />
            <div className='z-50 bg-white rounded-xl p-5 px-3 h-full overflow-y-auto'>
                <p className="text-center font-bold text-xl mb-3">Manually Pay to {warehouse?.name} </p>
                <div className='grid  w-full p-5'>

                    <div className="tabs mb-4" >
                        <div className={`tab tab-lifted ${currentTab === 1 ? 'tab-active' : ''}`} onClick={() => { setCurrentTab(1) }}>QPay</div>
                        <div className={`tab tab-lifted ${currentTab === 2 ? 'tab-active' : ''}`} onClick={() => { setCurrentTab(2) }}>Products</div>
                        <div className="tab tab-lifted mr-6 flex-1 cursor-default"></div>
                    </div>
                    {
                        currentTab === 1 &&
                        <div className="grid lg:grid-cols-2 gap-2 p-4 w-full ">

                            <div className="card p-6  gap-3  h-full text-center ">
                                <h4 className="text-lg">QR Image</h4>
                                {/* img */}
                                <div className="mx-auto relative ">

                                    <Image className="w-32 h-32 rounded  outline-dashed outline-stone-300 outline-offset-4 outline-1"
                                        src={`${ASSETS_URL.root}${bank?.qr}`}
                                    />

                                </div>

                            </div>

                            <div className="flex flex-col gap-2">
                                <label>{t('billing.bankName')}</label>
                                <input required className="input input-bordered " disabled defaultValue={bank?.bankName}></input>

                                <label>{t('billing.bankAccountName')}</label>
                                <input required className="input input-bordered " disabled defaultValue={bank?.accountName}></input>

                                <label>{t('billing.bankAccountNumber')}</label><input required className="input input-bordered " disabled defaultValue={bank?.accountNumber}></input>
                            </div>
                        </div>

                    }
                    {
                        currentTab === 2 &&
                        <div className="w-full p-2 gap-2 flex flex-col min-w-[300px]">
                            <div className="w-full overflow-x-auto ">
                                <table className="table table-compact w-full ">
                                    <tbody>
                                        <tr className="uppercase">
                                            <td>barcode</td>
                                            <td>totalCost</td>
                                            <td>price</td>
                                            <td>deliveryType</td>
                                            <td>deliveryCost</td>
                                        </tr>    
                                        {products.map((product, index) => (
                                            <tr key={index}>
                                                <td>{product?.barcode}</td>
                                                <td>{fPrice(product?.totalCost,'₮')}</td>
                                                <td>{fPrice(product?.price,'₮')}</td>
                                                <td>{product?.deliveryType}</td>
                                                <td>{fPrice(product?.deliveryCost,'₮')}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={5}>
                                                <div className = "flex flex-col gap-2 ">
                                                    <label>
                                                    Selected:{products.length}
                                                    </label>
                                                    <label>
                                                    Total:{fPrice(products.reduce((a,b)=>(a+b.totalCost),0),'₮')}
                                                    </label>
                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2">
                                <button className="btn btn-accent btn-sm" onClick={onAccept}>{t('words.pay')}</button>
                                <button className="btn btn-accent btn-sm" onClick={onClose}>{t('words.cancel')}</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}