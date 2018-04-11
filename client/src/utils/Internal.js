import axios from "axios";

const Internal = {

    checkUser: (input) => {
        return axios.get("/checkuser", { params: input});
    },

    getUser: (id) => {
        return axios.get(`/getUser/${id}`);
    },
    
    checkDup: (input) => {
        return axios.get("/checkdup", { params: input });
    },

    createUser: (addNew) => {
        return axios.post("/createuser", addNew );
    }

}

export default Internal;