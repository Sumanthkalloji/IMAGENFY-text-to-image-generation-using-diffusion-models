import {Link} from 'react-router-dom'
import {v4 as uuid} from 'uuid'
const MyHome = ({routesList})=>{
 return (
    <div className='main-center-div'>
        <h1>Hello These few My Projects I will be Developing!!</h1>
        <p>Happpy React</p>
        <ul>
            {routesList.map(item=><li key={uuid()}><Link to={`/${item}`}>{item}</Link></li>)}
        </ul>
      </div>
 )   
}
export default MyHome