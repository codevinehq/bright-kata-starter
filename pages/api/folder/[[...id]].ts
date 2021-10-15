import { Folder, Document } from "@prisma/client";
import prisma from "../../../prisma";
import handle from "../../../utils/handle";
import createHttpError from "http-errors";

type BaseResponse = Folder & {
  documents: Document[];
};
type BaseRequest = {
  name: string;
};
export type FolderGetResponse = BaseResponse[];
export type FolderGetIdResponse = BaseResponse;
export type FolderPutResponse = BaseResponse;
export type FolderPutRequest = BaseRequest;
export type FolderPostResponse = BaseResponse;
export type FolderPostRequest = BaseRequest;
export type FolderDeleteResponse = {};

const checkId = (id) => {
  if (!id) {
    throw createHttpError(400, "id is required");
  }
};

const folderRest = handle({
  GET: async (req, res) => {
    const { id }: { id?: string } = req.query;

    if (!id) {
      const folders = await prisma.folder.findMany({
        include: {
          documents: true,
        },
      });

      res.json(folders ?? []);

      return;
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        documents: true,
      },
    });

    if (!folder) {
      throw createHttpError(404, "folder not found");
    }

    res.json(folder);
  },
  PUT: async (req, res) => {
    const { id }: { id?: string } = req.query;
    const body: FolderPutRequest = req.body;

    checkId(id);

    const folder = await prisma.folder.update({
      where: {
        id: Number(id),
      },
      include: {
        documents: true,
      },
      data: {
        name: body.name,
      },
    });

    res.json(folder);
  },
  DELETE: async (req, res) => {
    const { id }: { id?: string } = req.query;

    checkId(id);

    const folder = await prisma.folder.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(folder);
  },
  POST: async (req, res) => {
    const body: FolderPutRequest = req.body;

    if (!body.name) {
      throw createHttpError(400, "Name is required");
    }

    const folder = await prisma.folder.create({
      data: {
        name: body.name,
      },
    });

    res.json(folder);
  },
});

export default folderRest;
