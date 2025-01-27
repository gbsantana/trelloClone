import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import { setBoards } from '../redux/features/boardSlice';
import { useNavigate } from 'react-router-dom';
import boardApi from '../api/boardApi';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const createBoard = async () => {
    setLoading(true);
    try {
      const res = await boardApi.create();
      dispatch(setBoards((prevBoards) => [...prevBoards, res]));
      navigate(`/boards/${res._id}`); // Use `res._id` instead of `res.id`
    } catch (err) {
      console.error('Error Creating Board:', err);
      alert(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LoadingButton
        variant="outlined"
        color="success"
        onClick={createBoard}
        loading={loading}
      >
        Click here to create your first board
      </LoadingButton>
    </Box>
  );
};

export default Home;
