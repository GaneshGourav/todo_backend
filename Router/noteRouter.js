const express = require("express");
const { notesModel } = require("../Modals/noteModel");
const { auth } = require("../Middleware/auth");

const notesRouter = express.Router();

notesRouter.post("/create",auth, async (req, res) => {
 
  try {
    let note = new notesModel(req.body);
    await note.save();
    res.status(200).json({ msg: "New Note added" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error " });
  }
});

notesRouter.get("/",async(req,res)=>{
  try {
    let note = await notesModel.find({userID: req.body.userID});
    if(note){
      res.status(200).json({"msg":"Your notes"})
    }else{
      res.status(400).json({"msg":"No notes created yet !"})
    }
  } catch (error) {
    
  }
})

notesRouter.patch("/update/:noteID",async(req,res)=>{
  const {noteID} = req.params;

  try {
    const note = await notesModel.findOne({_id:noteID, userID:req.body.userID});
    if(!note){
      res.status(401).json({"msg":"You're not authorized"})
    }else{
      await notesModel.findByIdAndUpdate({_id:noteID},req.body);
      res.status(200).json({"msg":"Notes has been updated."})
    }
  } catch (error) {
    res.status(500).json({"msg":"Internal Server Error"})
    
  }
})

notesRouter.delete("/delete/:noteID",async(req,res)=>{
  const {noteID} = req.params;
  try {
    const note = await notesModel.findOne({_id:noteID,userID:req.body.userID});
    if(!note){
      res.status(401).json({"msg":"You're not authorized"})
    }else{
      await notesModel.findByIdAndDelete({_id:noteID});
      res.status(200).json({"msg":"Notes has been Deleted."})
    }
  } catch (error) {
    res.status(500).json({"msg":"Internal Server Error"})
  }

})

module.exports = { notesRouter };
