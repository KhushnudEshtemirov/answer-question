import { Autocomplete, TextField } from "@mui/material";
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
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

import "./index.scss";
import { API } from "../../services/api";
import EditAnswer from "../../components/editAnswer/EditAnswer";
import AddAnswer from "../../components/addAnswer/AddAnswer";

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
  const [editData, setEditData] = useState(undefined);
  const [page, setPage] = useState(1);
  const [question, setQuestion] = useState("");
  const [searchData, setSearchData] = useState([]);

  const { isLoading, data, refetch } = useQuery(
    ["getAnswers", page],
    async () => await API.getAllQuestions(page)
  );

  const { mutate: searchMutate } = useMutation(
    async (search) => await API.searchQuestion(search),
    {
      onSuccess: (result) => {
        const data = result.data.results.map((res) => {
          return { ...res, label: res.question };
        });
        setSearchData(data);
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

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (search) => {
    setQuestion(search);
    searchMutate(search);
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

  useEffect(() => {
    searchMutate("");
  }, []);

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  const allData = data.data.results;

  const paginationCount = Math.ceil(data.data.count / 10);

  const handleEditOpen = (id) => {
    setEditData(allData.find((item) => item.id === parseInt(id)));
    setOpenEdit(true);
  };

  return (
    <div className="home">
      <div className="home__search">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={searchData}
          sx={{ width: "50%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Savolni yozing"
              value={question}
              onChange={(e) => handleSearch(e.target.value)}
              // onClick={() => handleSearch("")}
            />
          )}
        />
        <div className="home__modal">
          <Button variant="contained" color="success" onClick={handleClickOpen}>
            Savol qo'shish
          </Button>
          {open && (
            <AddAnswer
              handleClose={handleClose}
              refetch={refetch}
              open={open}
              setOpen={setOpen}
              question={question}
            />
          )}
          {openEdit && (
            <EditAnswer
              open={openEdit}
              data={editData}
              handleClose={handleClose}
              refetch={refetch}
            />
          )}
        </div>
      </div>
      <div className="home__table">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Savol</StyledTableCell>
                <StyledTableCell>Javob</StyledTableCell>
                <StyledTableCell sx={{ width: "60px" }}>
                  Amallar
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData.length > 0 ? (
                allData.map((item, index) => (
                  <StyledTableRow key={index}>
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
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={3} sx={{ textAlign: "center" }}>
                    Hozircha savollar mavjud emas.
                  </StyledTableCell>
                </StyledTableRow>
              )}
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
