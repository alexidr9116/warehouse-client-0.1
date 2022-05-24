import PropTypes from 'prop-types';
import { Icon } from "@iconify/react";
import { useForm } from 'react-hook-form';
import toast  from 'react-hot-toast';
import { API_AUTH, SEND_POST_REQUEST } from '../utils/API';
import {useTranslation} from 'react-i18next'; 

ChangePassword.propTypes = {
  onClose: PropTypes.func, 
}

export default function ChangePassword({onClose}) {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const {t}= useTranslation();
  const onSubmit = (data) => {
    
    if(data.newPassword!==data.confirmPassword){
        toast.error("Password is not matched, please input again");
        return;
    }
    SEND_POST_REQUEST(API_AUTH.changePassword,data).then(res=>{
        console.log(res);
        if(res.status === 200){
            toast.success(res.message)
            onClose()
        }
        else{
            toast.error(res.message)   
        }
        
    });
    
  }
  return (
    <div className={`modal modal-open bg-black/0`}>
      <div className=" fixed inset-0 bg-black/80" onClick={onClose} />
      <div className='z-50 bg-white rounded-2xl py-5 px-3'>
        <p className="text-center font-bold text-2xl mb-3">{t('changePassword.title')}</p>
        <form className="flex flex-col items-center gap-3 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {!!errors.afterSubmit &&
            <div className="alert alert-error shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{errors.afterSubmit.message}</span>
              </div>
            </div>
          }

          <div className="w-full">
            <p className="font-bold ">{t('changePassword.oldPassword')}</p>
            <input className="input h-10 border border-stone-300 w-full"   {...register("oldPassword")} />
          </div>

          <div className="w-full">
            <p className="font-bold ">{t('changePassword.newPassword')}</p>
            <input className="input h-10 border border-stone-300 w-full" required type='password' {...register("newPassword")} />
          </div>

          <div className="w-full">
            <p className="font-bold ">{t('changePassword.confirmPassword')}</p>
            <input className="input h-10 border border-stone-300 w-full" required type='password' {...register("confirmPassword")} />
          </div>

          <button className={`btn gap-2 btn-info w-4/5 uppercase ${isSubmitting && 'loading'}`} type="submit">
            {!isSubmitting && <Icon icon={'fa:cog'} />}
            {t('words.save')}
          </button>
        </form>
      </div>
    </div>
  )
}
