const Task = require('../models/task')
const Section = require('../models/section')

exports.create = async (req, res) => {
  const { sectionId, title, content } = req.body;

  if (!sectionId || !title || !content) {
    return res.status(400).json({ message: 'Section ID, title, and content are required' });
  }

  try {
    // Fix the count logic
    const tasksCount = await Task.find({ section: sectionId }).countDocuments();

    // Create the task
    const task = await Task.create({
      section: sectionId,
      title: title || 'Untitled',
      content: content || 'Default content',
      position: tasksCount, // Assign position based on count
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $set: req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
}

exports.delete = async (req, res) => {
  const { taskId } = req.params;
  try {
    const currentTask = await Task.findById(taskId);
    if (!currentTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: taskId });

    const tasks = await Task.find({ section: currentTask.section }).sort('position');
    await Promise.all(
      tasks.map((task, index) =>
        Task.findByIdAndUpdate(task._id, { $set: { position: index } })
      )
    );

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};

exports.updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId,
  } = req.body;
  const resourceListReverse = resourceList.reverse();
  const destinationListReverse = destinationList.reverse();
  try {
    if (resourceSectionId !== destinationSectionId) {
      for (const key in resourceListReverse) {
        await Task.findByIdAndUpdate(resourceListReverse[key].id, {
          $set: { section: resourceSectionId, position: key },
        });
      }
    }
    for (const key in destinationListReverse) {
      await Task.findByIdAndUpdate(destinationListReverse[key].id, {
        $set: { section: destinationSectionId, position: key },
      });
    }
    res.status(200).json('updated');
  } catch (err) {
    console.error('Error updating task positions:', err);
    res.status(500).json({ message: 'Failed to update task positions', error: err.message });
  }
};