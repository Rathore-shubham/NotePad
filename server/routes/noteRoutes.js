const express = require('express');
const router = express.Router();

const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  downloadNote
} = require('../controllers/noteController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getNotes);      
router.post('/', createNote);   

router.get('/:id', getNoteById);    
router.put('/:id', updateNote);     
router.delete('/:id', deleteNote); 

router.get('/download/:id', downloadNote); 

module.exports = router;
