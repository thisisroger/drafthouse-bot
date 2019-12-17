import axios from "axios";

export default axios.create({
  baseURL: `https://feeds.drafthouse.com/adcService/showtimes.svc/market/0800/`
});
