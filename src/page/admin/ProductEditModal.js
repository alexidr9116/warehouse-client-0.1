import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AlertModal from "../../component/core/AlertModal";
import LoadingScreen from "../../component/custom/LoadingScreen";
import Image from "../../component/Image";
import { API_ADMIN, ASSETS_URL, SEND_DELETE_REQUEST, SEND_PUT_REQUEST } from "../../utils/API";

export default function ProductEditModal({ onClose, product, vendorId }) {

    const [loading, setLoading] = useState(false);
    const [removeModal,setRemoveModal] = useState(false);
    const defaultValues = useMemo(() => ({
        img: product?.img || "",
        index: product?.index || 1,
        title: product?.title || "",
        price: product?.price || 0,
        reuse: product?.reuse || 0,
        status: product?.status || 0,

    }), [product]);


    const { register, handleSubmit, setValue,getValues,  watch, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues });
    const img = watch('img');
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setValue('img', e.target.files[0]);
        }
    }
     const onSubmit = (data)=>{
        setLoading(true);
        let iData = new FormData();
        if (typeof img === "object") {

            iData.append("img", img);
            iData.append("vendorId", vendorId);
            iData.append("index", data.index);
            iData.append("title", data.title);
            iData.append("reuse", data.reuse);
            iData.append("status", data.status);
            iData.append("price", data.price);
            iData.append("id", product === null?"":product._id);
            SEND_PUT_REQUEST(API_ADMIN.addProduct, iData).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    toast.success(res.message)
                    onClose()
                }
                else {
                    toast.error(res.message)
                }

            }).catch(err=>{
                toast.error("Internal Server Error")
            });;
        }
        else {

            if (product === null) {
                toast.error("Choose Image File");
                setLoading(false);
                return;
            }
            else {
                SEND_PUT_REQUEST(API_ADMIN.editProduct, { ...data,id: product._id,vendorId }).then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        toast.success(res.message)
                        onClose()
                    }
                    else {
                        toast.error(res.message)
                    }

                }).catch(err=>{
                    setLoading(false);
                    console.log(err);
                    toast.error("Server Error")
                });
            }

        }
    }
    const handleRemoveOk = ()=>{
        SEND_DELETE_REQUEST(`${API_ADMIN.deleteProduct}`,product._id).then(res=>{
            if(res.status === 200){
                toast.success(res.message)
                setRemoveModal(false)
                onClose();
            }
            else{
                toast.error(res.message)
            }
        })
    }
    const handleRemove = ()=>{
        setRemoveModal(true);
    }
    useEffect(()=>{
        if(product!==null){
            reset(defaultValues)
            setValue('img',`${ASSETS_URL.root}${product.img}`);
         }
    },[product,reset,defaultValues,setValue])
    return (
        <div className={`modal modal-open bg-black/0 `}>
            <div className=" fixed inset-0 bg-black/80" onClick={onClose} />
            <div className='z-50 bg-white rounded-xl py-5 px-3'>
                <p className="text-center font-bold text-xl mb-3">{product === null ? `Add New Product` : `Edit Product`} </p>
                <form className="flex flex-col items-center gap-3 p-2"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='grid grid-cols-2 w-full'>
                        <div>
                            <div className="w-full mb-3">
                                <p className="">Reusable*</p>
                                <select className="select select-sm h-10 select-info w-full mb-2" {...register("reuse")} >
                                    <option value={1}  >Yes</option>
                                    <option value={0}  >No</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <p className="">Status*</p>
                                <select className="select  select-sm h-10 select-info w-full mb-2" {...register("status")} >
                                    <option value={1} >Filled</option>
                                    <option value={0} >Empty</option>
                                </select>

                            </div>

                        </div>
                        <div className="card p-3  gap-5  h-full">
                            {/* avatar */}
                            <div className="mx-auto relative  ">

                                <Image className="w-36 h-36 rounded-lg outline-dashed outline-stone-300 outline-offset-4 outline-1"
                                    src={typeof img === 'string' ? img : (img ? URL.createObjectURL(img) : '')}
                                />

                                <input hidden id="img" type="file" accept="image/*" onChange={imageChange} />
                                <label htmlFor="img" className="rounded-lg border bg-gray-50 w-9 h-9 cursor-pointer flex absolute bottom-0 right-0">
                                    <Icon icon={'fa:pencil'} width={20} className="m-auto text-stone-500" />
                                </label>
                            </div>

                        </div>
                    </div>
                    

                    <div className="w-full ">
                        <p className="">Product Title</p>
                        <input className="input h-10 border border-stone-300 w-full" required  {...register("title")} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <div className="w-full">
                                <p className="">SlotIndex*</p>
                                <input className="input h-10 border border-stone-300 w-full" required  {...register("index")} type = 'number' />
                            </div>
                        </div>
                        <div>
                            <div className="w-full">
                                <p className="">Price(₮)*</p>
                                <input type='number' step={0.1}  className="input h-10 border border-stone-300 w-full" required  {...register("price")} />
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-3 gap-2">
                        <button className={`btn btn-sm btn-info ${isSubmitting && 'loading'}`} type="submit">
                            Save
                        </button>
                        <button className={`btn  btn-sm btn-info `} onClick={handleRemove} type = 'button' disabled={(product===null)}>
                            Delete
                        </button>
                        <button className={`btn  btn-sm btn-info  `} onClick={onClose}>
                            Cancel
                        </button>
                    </div>


                </form>

            </div>
            {removeModal && <AlertModal onCancel={()=>setRemoveModal(false)} onAccept={handleRemoveOk} title="Do you want to remove, Sure?" description="If you have proceed this operation, the data will be removed from  database"  />}
            {loading && <LoadingScreen message='Saving' />}
        </div>
    )
}