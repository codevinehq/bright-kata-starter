import createError from "http-errors";
import { Document } from "@prisma/client";
import prisma from "../../../prisma";
import handle from "../../../utils/handle";

type BaseResponse = Document;
export type DocumentGetResponse = BaseResponse[];
export type DocumentGetIdResponse = BaseResponse;
export type DocumentPutRequest = {
  name?: string;
  type?: string;
  folderId?: number;
};
export type DocumentPostResponse = BaseResponse;
export type DocumentPostRequest = {
  name: string;
  type: string;
  folderId?: number;
};
export type DocumentDeleteResponse = {};

const checkId = (id) => {
  if (!id) {
    throw createError(400, "id is required");
  }
};

const documentRest = handle({
  GET: async (req, res) => {
    const { id }: { id?: string } = req.query;

    if (!id) {
      const documents = await prisma.document.findMany();

      res.json(documents ?? []);

      return;
    }

    const document = await prisma.document.findFirst({
      where: {
        id: Number(id),
      },
    });

    res.json(document);
  },
  PUT: async (req, res) => {
    const { id }: { id?: string } = req.query;
    const body: DocumentPutRequest = req.body;

    checkId(id);

    const document = await prisma.document.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        type: body.type,
        folder: body.folderId
          ? {
              connect: {
                id: Number(body.folderId),
              },
            }
          : undefined,
      },
    });

    res.json(document);
  },
  DELETE: async (req, res) => {
    const { id }: { id?: string } = req.query;

    checkId(id);

    const document = await prisma.document.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(document);
  },
  POST: async (req, res) => {
    const body: DocumentPutRequest = req.body;
    const document = await prisma.document.create({
      data: {
        name: body.name,
        type: body.type,
        folder: body.folderId
          ? {
              connect: {
                id: Number(body.folderId),
              },
            }
          : undefined,
      },
    });

    res.json(document);
  },
});

export default documentRest;
