import { Request, Response } from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
export async function getProfilePicture(req: Request, res: Response) {
  const id = req.params.id;
  const pwd = dirname(fileURLToPath(import.meta.url));
  const spwd = pwd.split("/");
  spwd.splice(spwd.length - 2);
  const path = `${spwd.join("/")}/uploads/profile_pic/${id}.jpeg`;
  res.sendFile(path, (err) => {
    if (err) {
      res.status(400).send("Couldn't find image");
    }
  });
}
