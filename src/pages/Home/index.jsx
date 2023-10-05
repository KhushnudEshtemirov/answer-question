import { Autocomplete, Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

import "./index.scss";
import { API } from "../../services/api";
import EditAnswer from "../../components/editAnswer/EditAnswer";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [page, setPage] = useState(1);
  const [postData, setPostData] = useState({ answer: "", question: "" });

  const { isLoading, data, refetch } = useQuery(
    "getAnswers",
    async () => await API.getAllQuestions()
  );

  const { mutate } = useMutation(async (data) => await API.postAnswer(data), {
    onSuccess: () => {
      refetch();
      toast.success("Savolingiz muvaffaqiyatli qo'shildi.");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    },
  });

  const { mutate: updateMutate } = useMutation(
    async (data) => await API.updateAnswer(data),
    {
      onSuccess: () => {
        refetch();
        toast.success("Savol muvaffaqiyatli yangilandi.");
      },
      onError: () => {
        toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      },
    }
  );

  const { mutate: deleteMutate } = useMutation(
    async (id) => await API.deleteAnswer(id),
    {
      onSuccess: () => {
        refetch();
        toast.success("Savol muvaffaqiyatli o'chirildi.");
      },
      onError: () => {
        toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      },
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
  };

  const handleSubmit = () => {
    mutate(postData);
    setOpen(false);
  };

  const handleChange = (event, value) => {
    setPage(value);
    setActivePage(value - 1);
  };

  const handleEditOpen = (id) => {
    setEditId(id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Ushbu savolni o'chirishga ishonchingiz komilmi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ha",
      cancelButtonText: "Yo'q",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutate(id);
      }
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const allData = data.data.results;

  const paginationCount = Math.ceil(allData.length / 10);

  return (
    <div className="home">
      <div className="home__search">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={top100Films}
          sx={{ width: "50%" }}
          renderInput={(params) => (
            <TextField {...params} label="Savolni yozing" />
          )}
        />
        <div className="home__modal">
          <Button variant="contained" color="success" onClick={handleClickOpen}>
            Savol qo'shish
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Savol qo'shish</DialogTitle>
            <DialogContent
              sx={{
                height: "160px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "30px",
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    sx={{ width: "100%" }}
                    id="outlined-basic"
                    label="Savolni kiriting"
                    variant="outlined"
                    onChange={(e) =>
                      setPostData((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    sx={{ width: "100%" }}
                    id="outlined-basic"
                    label="Javobni kiriting"
                    variant="outlined"
                    onChange={(e) =>
                      setPostData((prev) => ({
                        ...prev,
                        answer: e.target.value,
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ paddingBottom: "20px", paddingRight: "20px" }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={
                  postData.answer.length > 0 && postData.question.length > 0
                    ? null
                    : { pointerEvents: "none", opacity: "0.5" }
                }
              >
                Qo'shish
              </Button>
              <Button onClick={handleClose} variant="contained" color="error">
                Bekor qilish
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <div className="home__table">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>T/R</StyledTableCell>
                <StyledTableCell>Savol</StyledTableCell>
                <StyledTableCell>Javob</StyledTableCell>
                <StyledTableCell sx={{ width: "60px" }}>
                  Amallar
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData
                .slice(10 * activePage, 10 * activePage + 10)
                .map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {item.id}
                    </StyledTableCell>
                    <StyledTableCell>{item.question}</StyledTableCell>
                    <StyledTableCell>{item.answer}</StyledTableCell>
                    <StyledTableCell>
                      <EditIcon
                        onClick={() => handleEditOpen(item.id)}
                        sx={{
                          fill: "blue",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      />
                      <DeleteIcon
                        onClick={() => handleDelete(item.id)}
                        sx={{ fill: "red", cursor: "pointer" }}
                      />
                      {open && (
                        <EditAnswer
                          open={open}
                          id={item.id}
                          handleClose={handleClose}
                        />
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {paginationCount > 1 ? (
        <div className="home__pagination">
          <Stack spacing={2}>
            <Pagination
              count={paginationCount}
              size="large"
              page={page}
              onChange={handleChange}
            />
          </Stack>
        </div>
      ) : null}
    </div>
  );
};

export default HomePage;

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
  { label: "Fight Club", year: 1999 },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    label: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { label: "Forrest Gump", year: 1994 },
  { label: "Inception", year: 2010 },
  {
    label: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: "Goodfellas", year: 1990 },
  { label: "The Matrix", year: 1999 },
  { label: "Seven Samurai", year: 1954 },
  {
    label: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { label: "City of God", year: 2002 },
  { label: "Se7en", year: 1995 },
  { label: "The Silence of the Lambs", year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: "Life Is Beautiful", year: 1997 },
  { label: "The Usual Suspects", year: 1995 },
  { label: "Léon: The Professional", year: 1994 },
  { label: "Spirited Away", year: 2001 },
  { label: "Saving Private Ryan", year: 1998 },
  { label: "Once Upon a Time in the West", year: 1968 },
  { label: "American History X", year: 1998 },
  { label: "Interstellar", year: 2014 },
  { label: "Casablanca", year: 1942 },
  { label: "City Lights", year: 1931 },
  { label: "Psycho", year: 1960 },
  { label: "The Green Mile", year: 1999 },
  { label: "The Intouchables", year: 2011 },
  { label: "Modern Times", year: 1936 },
  { label: "Raiders of the Lost Ark", year: 1981 },
  { label: "Rear Window", year: 1954 },
  { label: "The Pianist", year: 2002 },
  { label: "The Departed", year: 2006 },
  { label: "Terminator 2: Judgment Day", year: 1991 },
  { label: "Back to the Future", year: 1985 },
  { label: "Whiplash", year: 2014 },
  { label: "Gladiator", year: 2000 },
  { label: "Memento", year: 2000 },
  { label: "The Prestige", year: 2006 },
  { label: "The Lion King", year: 1994 },
  { label: "Apocalypse Now", year: 1979 },
  { label: "Alien", year: 1979 },
  { label: "Sunset Boulevard", year: 1950 },
  {
    label:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { label: "The Great Dictator", year: 1940 },
  { label: "Cinema Paradiso", year: 1988 },
  { label: "The Lives of Others", year: 2006 },
  { label: "Grave of the Fireflies", year: 1988 },
  { label: "Paths of Glory", year: 1957 },
  { label: "Django Unchained", year: 2012 },
  { label: "The Shining", year: 1980 },
  { label: "WALL·E", year: 2008 },
  { label: "American Beauty", year: 1999 },
  { label: "The Dark Knight Rises", year: 2012 },
  { label: "Princess Mononoke", year: 1997 },
  { label: "Aliens", year: 1986 },
  { label: "Oldboy", year: 2003 },
  { label: "Once Upon a Time in America", year: 1984 },
  { label: "Witness for the Prosecution", year: 1957 },
  { label: "Das Boot", year: 1981 },
  { label: "Citizen Kane", year: 1941 },
  { label: "North by Northwest", year: 1959 },
  { label: "Vertigo", year: 1958 },
  {
    label: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { label: "Reservoir Dogs", year: 1992 },
  { label: "Braveheart", year: 1995 },
  { label: "M", year: 1931 },
  { label: "Requiem for a Dream", year: 2000 },
  { label: "Amélie", year: 2001 },
  { label: "A Clockwork Orange", year: 1971 },
  { label: "Like Stars on Earth", year: 2007 },
  { label: "Taxi Driver", year: 1976 },
  { label: "Lawrence of Arabia", year: 1962 },
  { label: "Double Indemnity", year: 1944 },
  {
    label: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { label: "Amadeus", year: 1984 },
  { label: "To Kill a Mockingbird", year: 1962 },
  { label: "Toy Story 3", year: 2010 },
  { label: "Logan", year: 2017 },
  { label: "Full Metal Jacket", year: 1987 },
  { label: "Dangal", year: 2016 },
  { label: "The Sting", year: 1973 },
  { label: "2001: A Space Odyssey", year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: "Toy Story", year: 1995 },
  { label: "Bicycle Thieves", year: 1948 },
  { label: "The Kid", year: 1921 },
  { label: "Inglourious Basterds", year: 2009 },
  { label: "Snatch", year: 2000 },
  { label: "3 Idiots", year: 2009 },
  { label: "Monty Python and the Holy Grail", year: 1975 },
];
