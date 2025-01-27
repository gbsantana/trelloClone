const Task = require('../models/task')
const Section = require('../models/section')

exports.create = async (req, res) => {
  const { sectionId } = req.body;
  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const tasksCount = await Task.countDocuments({ section: sectionId });
    const task = await Task.create({
      section: sectionId,
      position: tasksCount,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err); // Log the error details
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { taskId } = req.params
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $set: req.body }
    )
    res.status(200).json(task)
  } catch (err) {
    res.status(500).json(err)
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
    res.status(500).json(err);
  }
};