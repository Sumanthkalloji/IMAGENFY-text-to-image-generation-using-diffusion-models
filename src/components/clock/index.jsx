import {useEffect, useState} from 'react'


const MyClock = ()=>{
    const [show,setShow] = useState(false)
    const [time , setTime] = useState(new Date())
    
    useEffect(()=>{
        const timerId = setInterval(()=>{
            setTime(new Date())
        },1000)
        console.log('Fetched!!')

        return ()=>{    
            clearInterval(timerId)
            console.log("Cleared the clock")
        }
    },[])
    return (
    <div className='my-clock'>    
        
        <h1>My Clock</h1>
        <button onClick={()=>setShow(pre=>!pre)}>Click</button>
        {show && <p>Time: {time.toLocaleTimeString()}</p>}
    </div>)
}
export default MyClock