const Note = require('../models/Note');
const PDFDocument = require('pdfkit');

exports.getNotes = async (req, res) => {
   try {
     const userId = req.user.id; // This comes from middleware
  const notes = await Note.find({ user: userId });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = new Note({
      user:req.user.id, 
      title,
      content,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote:", error.message);
    res.status(500).json({ message: "Server error while saving note" });
  }
};

exports.updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    { ...req.body, updated_at: Date.now() },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  await note.deleteOne(); // or note.remove()
  res.status(200).json({ message: "Note deleted" });
};

exports.downloadNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user_id: req.user.id });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  const doc = new PDFDocument();
  res.setHeader('Content-disposition', `attachment; filename="${note.title}.pdf"`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);
  doc.fontSize(20).text(note.title, { underline: true });
  doc.moveDown().fontSize(14).text(note.content);
  doc.end();
};
