export default function DeliveryCostInput({ registers=[()=>{}], suffix = "%", prefix = "General", defaultValue = 0 }) {
    
    
    return (
        <div className="flex items-center  border rounded-lg w-full">
            <div className="flex-none ml-2 ">{prefix}</div>
            
            <input type="number" required  className={`input flex-1 w-[140px] text-right`} step={0.01} {...registers[0]} defaultValue = {defaultValue}  disabled={(suffix === 'disabled')} />
            <div className="flex-none mr-2 ">{suffix.replace('disabled','')}</div>
        </div>
    )
}