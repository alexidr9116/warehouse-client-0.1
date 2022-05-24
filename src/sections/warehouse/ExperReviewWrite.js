import { useForm } from "react-hook-form"
// import Rating from "../component/components/Rating";


export default function ExperReviewWrite() {

  const { register,handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-500/5 rounded-lg p-5 flex flex-col gap-5 mb-20" >

      <p className="" id="write_review">Your email address will not be published. Required fields are marked *</p>
      <p className="font-bold text-lg">Your rating</p>

      {/* <Rating value={5} className="rating-lg mb-5" /> */}

      <div>
        <p className="font-bold text-lg ">Your review</p>
        <textarea className="rounded-2xl p-5 w-full min-h-[200px]" placeholder="write..." {...register('comment')} />
      </div>

      <div className="flex gap-5 flex-col md:flex-row">
        <div className="grow ">
          <p className="text-lg font-bold mb-3 pl-5">Name</p>
          <input className="input input-lg bg-white w-full" {...register('name')} />
        </div>
        <div className="grow ">
          <p className="text-lg font-bold mb-3 pl-5">Email</p>
          <input className="input input-lg bg-white w-full" {...register('email')} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" className="checkbox checkbox-accent" {...register('infoSave')} />
        <p>Save my name, email, and website in this browser for the next time I comment.</p>
      </div>

      <button type="submit" className="btn btn-wide mr-auto text-white">Submit</button>

    </form>
  )
}