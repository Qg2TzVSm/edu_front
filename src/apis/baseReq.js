import axios from 'axios'

const Req = axios.create({
   baseURL: "https://edudemo.herokuapp.com/api",
   headers:{
       "Accept": "application/json"
   }
});

export default Req