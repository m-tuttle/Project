import axios from "axios";

const Internal = {
  checkUser: input => {
    return axios.get("/checkuser", { params: input });
  },

  getUser: id => {
    return axios.get(`/getUser/${id}`);
  },

  checkDup: input => {
    return axios.get("/checkdup", { params: input });
  },

  createUser: addNew => {
    return axios.post("/createuser", addNew);
  },

  saveShow: show => {
    return axios.post(`/saveshow`, show);
  },

  showUsers: () => {
    return axios.get('/showallusers');
  },
    
  topTrending: () => {
    return axios.get('/toptrending');
  },

  updateShow: show => {
    return axios.post('/updateshow', show)
  },

  deleteShow: (show) => {
    return axios.post('/deleteshow', show)
  },

  getUsersByShow: (title) => {
    return axios.get('/usersbyshow', { params: { title } })
  },

  getFlow: () => {
    return axios.get('/flow')
  },

  getComments: (show) => {
    return axios.get(`/comments/${show}`, { params: {show}})
  },

  postComment: (input) => {
    return axios.post('/savecomments', input)
  }
  
};


export default Internal;