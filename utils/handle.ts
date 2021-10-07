import createHttpError, { HttpError } from "http-errors";
import { NextApiRequest, NextApiResponse } from "next";

type handle = {
  GET?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  PUT?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  POST?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  DELETE?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
};

export default function handle(handlers: handle) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const handler = handlers[req.method];

    if (handler) {
      try {
        await handler(req, res);
      } catch (_e) {
        let e;

        console.error(_e);

        if (createHttpError.isHttpError(_e)) {
          let e = _e as HttpError;
          res.status(e.statusCode);
          res.json({
            message: e.message,
          });
        } else {
          res.status(500);
          res.json({
            message: "Something went wrong",
          });
        }
      }
    } else {
      res.setHeader("Allow", Object.keys(handlers));
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
}
