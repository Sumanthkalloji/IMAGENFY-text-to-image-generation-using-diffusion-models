import {useLocation,useNavigate} from 'react-router-dom'

const Header  = ()=>{
    const location = useLocation()
    const name = location.pathname
    const nav = useNavigate()
    return (
        <div>
            <h1>
                {name}
            </h1>
            {name!=="/"&&<button onClick={()=>{nav('/')}}>Go Back!</button>}
        </div>
    )
}
export default Header