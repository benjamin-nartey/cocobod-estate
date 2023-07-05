import axios from "axios";

export default axios.create({
  baseURL: "https://json-api-6r5i.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
