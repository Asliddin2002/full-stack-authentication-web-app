const allowedOrigins = ["https://x18k8ls2-5173.euw.devtunnels.ms/"];

export const corsOptions = {
  origin: (origin: string, callback: (arg: any, arg2?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
