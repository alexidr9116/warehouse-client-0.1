
export default function PriceInput({ registers=[()=>{},()=>{}] }) {

    
    return (
        <div className="flex items-center  border rounded-lg w-full">
            
            <input type="number" required  className={`input grow w-1/2 text-right`} step={0.01} {...registers[0]}  />
            <div className="grow-0 ml-2 text-info">₮</div>
            <input type="number" required className={`input grow w-1/2 text-right`} step={0.01} {...registers[1]} />
            <div className="grow-0 mr-2 text-info">¥</div>
        </div>
    )
}