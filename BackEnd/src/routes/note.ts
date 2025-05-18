import express from "express";
import { Request, Response } from "express";
import { isLoggedin } from "../middleware/isLoggedin";
import NotesModel from "../models/notes";
const router = express.Router();

router.post("/create", isLoggedin, async (req: Request, res: Response) => {
  const { title, content, caption } = req.body;
  try {
    const user = req.user;
    const note = await NotesModel.create({
      title,
      content,
      caption,
      author: user._id,
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/update/:id", isLoggedin, async (req: Request, res: Response) => {
  const { title, content, caption } = req.body;
  const { id } = req.params;
  try {
    await NotesModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        content,
        caption,
      }
    );
    const UpdatedNote = await NotesModel.findOne({_id: id});
    res.status(200).json(UpdatedNote);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/delete/:id", isLoggedin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const DeletedNote = await NotesModel.findByIdAndDelete(id);
    res.status(200).json(DeletedNote);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getNote/:id", isLoggedin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const Note = await NotesModel.findById(id);
    res.status(200).json(Note);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getAllNotes", isLoggedin, async (req: Request, res: Response) => {
  try {
    const Notes = await NotesModel.find({ author: req.user._id });
    res.status(200).json(Notes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
