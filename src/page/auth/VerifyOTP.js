import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
// hooks
import useAuth from '../../hook/useAuth';
import Page from '../../component/Page';


// ----------------------------------------------------------------------

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { otpVerify } = useAuth();
  
  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  };

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: 'onBlur', defaultValues });

  const values = watch();

  const handlePasteClipboard = useCallback((event) => {
    let data = event?.clipboardData?.getData('Text') || '';

    data = data.split('');

    [].forEach.call(document.querySelectorAll('.field-code'), (node, index) => {
      node.value = data[index];
      const fieldIndex = `code${index + 1}`;
      setValue(fieldIndex, data[index]);
    });
  },[setValue]);

  useEffect(() => {
    document.addEventListener('paste', handlePasteClipboard);
  }, [handlePasteClipboard]);

  const onSubmit = async (data) => {
    const result = await otpVerify(Object.values(data).join(''));
    if(result.success){
      navigate('/client/profile',{replace:true})
    }
    else{
      toast.error(result.err);
    } 
  };



  const handleChangeWithNextField = (event, handleChange) => {
    const { maxLength, value, name } = event.target;
    const fieldIndex = name.replace('code', '');
    const fieldIntIndex = Number(fieldIndex);
    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          nextfield.focus();
        }
      }
    }

    handleChange(event);
  };

  return (
    <Page title = "verify-otp">
    <div className='container max-w-sm text-center py-10'>
      <p className='text-3xl font-bold mb-5'>
        Verify sms code
      </p>
      <p className='mb-5'>
        Please enter cerification code we sent to your phone number
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex gap-3 justify-center mb-5' >
          {Object.keys(values).map((name, index) => (
            <Controller
              key={name}
              name={`code${index + 1}`}
              control={control}
              render={({ field }) => (
                <input
                  className={`
                    field-code 
                    input w-9 h-11 sm:w-16 sm:h-20 bg-gray-500/10 
                    focus:border-gray-300 border-gray-200
                    text-3xl text-center  p-0
                  `}
                  maxLength={1} required
                  {...field}
                  autoFocus={index === 0}
                  placeholder="-"
                  onChange={(event) => handleChangeWithNextField(event, field.onChange)}
                />
              )}
            />
          ))}
        </div>
        <button
          className={
            `btn gap-2 btn-info w-4/5 uppercase mb-5
            ${isSubmitting && ' loading'} 
            ${!isValid && ' disabled'} `
          }
          type="submit"
        >
          Next
        </button>
      </form>
    
        <div className = "text-lg">Haven't got your OTP number yet?  &nbsp;</div>
        <div className='btn btn-link no-underline text-blue-500' onClick={() => { }}>
          Resend code
        </div>
    </div>
    </Page>
  );
}
