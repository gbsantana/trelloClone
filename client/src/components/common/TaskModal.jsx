import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Moment from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import taskApi from '../../api/taskApi';

import '../../css/custom-editor.css';

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%',
};

const TaskModal = (props) => {
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const editorWrapperRef = useRef();

  useEffect(() => {
    if (props.task) {
      setTask(props.task);
      setTitle(props.task.title || '');
      setContent(props.task.content || '');
      updateEditorHeight();
    }
  }, [props.task]);

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current;
        const editor = box.querySelector('.ck-editor__editable_inline');
        if (editor) {
          editor.style.height = `${box.offsetHeight - 50}px`;
        }
      }
    }, 100); // Shorter delay for better UX
  };

  const onClose = () => {
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    if (!task || !boardId) return;
    try {
      await taskApi.delete(boardId, task.id);
      props.onDelete(task); // Update the parent
      setTask(null); // Close the modal
    } catch (err) {
      console.error('Error deleting task:', err);
      alert(err.response?.data?.message || 'Failed to delete task');
      setTask(task); // Ensure task state is maintained
    }
  };
  const debouncedUpdate = (callback, delay = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

  const updateTaskTitle = async (newTitle) => {
    if (!task || !boardId) return;
    try {
      await taskApi.update(boardId, task.id, { title: newTitle });
    } catch (err) {
      console.error('Error updating title:', err);
      alert(err.response?.data?.message || 'Failed to update title');
    }
  };

  const updateTaskContent = async (newContent) => {
    if (!task || !boardId) return;
    try {
      await taskApi.update(boardId, task.id, { content: newContent });
    } catch (err) {
      console.error('Error updating content:', err);
      alert(err.response?.data?.message || 'Failed to update content');
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setTask({ ...task, title: newTitle });
    debouncedUpdate(updateTaskTitle)(newTitle);
  };

  const handleContentChange = (event, editor) => {
    const newContent = editor.getData();
    setContent(newContent);
    setTask({ ...task, content: newContent });
    debouncedUpdate(updateTaskContent)(newContent);
  };

  return (
    <Modal
      open={!!task}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={!!task}>
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <IconButton variant="outlined" color="error" onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>

          {/* Body */}
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              padding: '2rem 5rem 5rem',
            }}
          >
            {/* Title */}
            <TextField
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              variant="outlined"
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px',
              }}
            />

            {/* Date */}
            <Typography variant="body2" fontWeight="700">
              {task ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>

            <Divider sx={{ margin: '1.5rem 0' }} />

            {/* Content Editor */}
            <Box
              ref={editorWrapperRef}
              sx={{
                position: 'relative',
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={handleContentChange}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
