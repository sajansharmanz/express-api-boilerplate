import cors, { CorsOptions } from "cors";
import { ORIGIN_URLS } from "../configs/environment";

const corsOptions: CorsOptions = {
  origin: ORIGIN_URLS.split(",").map((origin) => origin.trim()),
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
