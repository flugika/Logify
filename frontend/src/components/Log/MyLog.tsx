import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { setMoods, setCategories, setErrorMessage, setSelectedUser, clearFilters } from '../../stores/Slice/searchSlice';
import LogCard from './LogCard';
import SearchBar from '../SearchPage/SearchBar/SearchBar';
import ImageSlider from '../ImageSliders/ImageSlider';
import { ListCategories, ListLogs, ListMoods, SearchLogs } from "../../services/HttpClientService";
import MoodFilter from "../Filter/MoodFilter";
import CategoryFilter from "../Filter/CategoryFilter";
import { Link } from 'react-router-dom';
import "../Filter/Filter.css";
import Layout from "../Layout";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { LogInterface } from "../../interfaces/ILog";

const MyLogButton = styled(Button)({
  color: '#F5FFFC',
  borderRadius: '50px',
  minWidth: '50px',
  minHeight: '50px',
  width: '50px',
  padding: '0.5rem',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: "#8ba896",
  boxShadow: "2px 4px 4px rgba(1, 27, 10, 0.2), -2px -4px 4px rgba(255, 255, 255, 0.3)",
  transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    backgroundColor: '#7A9484',
    color: '#F5FFFC',
    boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
  },
});

function MyLog() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMood, selectedCategory, errorMessage } = useSelector((state: RootState) => state.search.data);
  const [logs, setLogs] = useState<LogInterface[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [sortedLogs, setSortedLogs] = useState(logs);
  const [isLike, setIsLike] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState<string>("");
  const uid = localStorage.getItem("uid")

  const fetchData = async () => {
    try {
      setLoading(true);
      const [moods, categories] = await Promise.all([
        ListMoods(),
        ListCategories(),
      ]);
      if (moods) dispatch(setMoods(moods));
      if (categories) dispatch(setCategories(categories));
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const searchData = async () => {
    try {
      setLoading(true);
      const res = await SearchLogs({
        userID: parseInt(uid + ""),
        keyword: keyword,
        moodID: selectedMood,
        categoryID: selectedCategory
      });
      console.log(res)

      if (res) {
        setIsEmpty(false);
        setLogs(res);
      } else {
        setIsEmpty(true);
        dispatch(setErrorMessage("cannot find log"))
        setLogs([])
      }
    } catch (error) {
      setIsEmpty(true);
      dispatch(setErrorMessage("cannot find log"))
      setLogs([])
      console.error("Error fetching logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortLikes = () => {
    setIsLike(!isLike);
  };

  const handleSortSaves = () => {
    setIsSave(!isSave);
  };

  useEffect(() => {
    const applySort = () => {
      if (isLike && !isSave) return [...logs].sort((a, b) => (b.LikesCount || 0) - (a.LikesCount || 0));
      if (!isLike && isSave) return [...logs].sort((a, b) => (b.SavesCount || 0) - (a.SavesCount || 0));
      if (isLike && isSave) return [...logs].sort((a, b) => (b.LikesCount || 0) - (a.LikesCount || 0) || (b.SavesCount || 0) - (a.SavesCount || 0));
      return logs;
    };

    setSortedLogs(applySort());
  }, [isLike, isSave, logs]);

  const filteredAndSortedLogs = sortedLogs.filter(log => {
    const moodMatches = selectedMood ? log.Mood?.ID === selectedMood : true;
    const categoryMatches = selectedCategory ? log.Category?.ID === selectedCategory : true;
    return moodMatches && categoryMatches;
  });

  useEffect(() => {
    fetchData();
    dispatch(clearFilters());
    // Ensure fetchData only runs on component mount
  }, []);

  useEffect(() => {
    if (selectedMood || selectedCategory) {
      searchData();  // Only trigger search when filters change
    }
  }, [selectedMood, selectedCategory]);

  useEffect(() => {
    if (keyword === "") {
      searchData();  // Avoid re-running searchData unnecessarily
    }
  }, [keyword === ""]);

  return (
    <Layout>
      <Box
        sx={{
          width: '100%',
          height: {
            xs: '200px',
            sm: '250px',
            md: '300px',
            lg: '360px',
          },
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: '0.8',
          '&:hover': {
            opacity: '1',
            transition: '.8s',
          },
        }}
      >
        <ImageSlider />
      </Box>
      <SearchBar searchData={searchData} keyword={keyword} setKeyword={setKeyword} />
      <Grid container spacing={2} sx={{ marginTop: { xs: "-2rem", md: "-1rem" } }}>
        <Grid item xs={0} sm={0} md={1} lg={3}></Grid>
        <Grid item xs={12} sm={12} md={10} lg={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 3, md: 4 },
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row", gap: { xs: 3, md: 4 }, marginTop: { xs: "-0.5rem", md: "0rem" } }}>
              <Box sx={{ width: '160px', maxWidth: '400px' }}>
                <MoodFilter />
              </Box>
              <Box sx={{ width: '160px', maxWidth: '400px' }}>
                <CategoryFilter />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: { xs: 3, md: 4 }, flexDirection: "row", marginTop: { xs: "-1.2rem", md: "0rem" } }}>
              <MyLogButton
                onClick={handleSortLikes}
              >
                {isLike ? <FavoriteIcon sx={{ color: "#F5FFFC" }} /> : <FavoriteBorderIcon sx={{ color: "#F5FFFC" }} />}
              </MyLogButton>
              <MyLogButton
                onClick={handleSortSaves}
              >
                {isSave ? <BookmarkIcon sx={{ color: "#F5FFFC" }} /> : <BookmarkBorderIcon sx={{ color: "#F5FFFC" }} />}
              </MyLogButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={0} sm={0} md={1} lg={3}></Grid>
      </Grid>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: '5rem' }}>
          <CircularProgress size={80} sx={{ color: "#E36951" }} />
        </Box>
      ) : (
        <Box sx={{ padding: '1rem', flexGrow: 1, marginTop: { xs: "-0.8rem", md: "0rem" } }}>
          {isEmpty ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, paddingTop: "2rem", color: "#F5FFFC" }}>
              <ErrorOutlineIcon sx={{ fontSize: 40, filter: 'drop-shadow(6px 2px 8px rgba(0, 0, 0, 0.2))' }} />
              <Typography sx={{ marginTop: "-8px", fontSize: "40px", textShadow: '6px 2px 8px rgba(0, 0, 0, 0.2)' }}>
                {errorMessage}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {filteredAndSortedLogs.map(log => (
                <Grid
                  item
                  key={log.ID}
                  xs="auto"
                  sm="auto"
                  md="auto"
                  lg="auto"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexBasis: 'auto',
                    maxWidth: '345px',
                  }}
                >
                  <Link to={`/log/${log.ID}`} style={{ textDecoration: "none" }}>
                    <LogCard log={log} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
      <Box sx={{ width: '100%', height: '48px' }} />
    </Layout>
  );
}

export default MyLog;
