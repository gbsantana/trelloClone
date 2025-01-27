const Section = require('../models/section');
const Task = require('../models/task');

exports.create = async (req, res) => {
  const { boardId } = req.params;
  try {
    const section = await Section.create({ board: boardId });
    section._doc.tasks = []; // Include tasks explicitly in the response
    res.status(201).json(section);
  } catch (err) {
    console.error('Error creating section:', err); // Log the error
    res.status(500).json({ message: 'Failed to create section', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { $set: req.body },
      { new: true } // Return the updated document
    );
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    section._doc.tasks = []; // Include tasks explicitly in the response
    res.status(200).json(section);
  } catch (err) {
    console.error('Error updating section:', err); // Log the error
    res.status(500).json({ message: 'Failed to update section', error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await Task.deleteMany({ section: sectionId });
    await Section.deleteOne({ _id: sectionId });

    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (err) {
    console.error('Error deleting section:', err); // Log the error
    res.status(500).json({ message: 'Failed to delete section', error: err.message });
  }
};
