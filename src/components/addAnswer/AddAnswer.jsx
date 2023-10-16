import { useQuery } from "react-query";
import { API } from "../../services/api";
import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import useRequests from "../../hooks/useRequests";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

const AddAnswer = ({ handleClose, refetch, open, setOpen, question }) => {
  const [postData, setPostData] = useState({
    question: question,
    answer: "",
    category: null,
  });
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ id: null, label: "" });
  const [showChange, setShowChange] = useState(false);
  const [active, setActive] = useState(false);

  // Here get all categories
  const { isLoading, refetch: refetchCategories } = useQuery(
    "getCategories",
    async () => await API.getAllCategories(),
    {
      onSuccess: (data) => {
        const result = data.data.results.map((item) => {
          return { ...item, label: item.text };
        });

        setCategories(result);
      },
    }
  );

  // Here add new question
  const { addMutate: addQuestion } = useRequests({
    url: API.postAnswer,
    refetch,
  });

  // Here add new category
  const { addMutate: addCategory } = useRequests({
    url: API.addCategory,
    refetch: refetchCategories,
  });

  // Here update category
  const { updateMutate } = useRequests({
    url: API.updateCategory,
    refetch: refetchCategories,
  });

  // Here delete category
  const { deleteMutate } = useRequests({
    url: API.deleteCategory,
    refetch: refetchCategories,
    refetchQuestions: refetch,
  });

  const handleSubmit = () => {
    addQuestion(postData);
    setOpen(false);
  };

  const handleSearch = (event, value) => {
    setCategory({ ...category, id: value?.id, label: value?.text });
    setPostData((prev) => ({
      ...prev,
      category: value && value.id,
    }));
  };

  const handleChange = (e) => {
    setCategory({ ...category, label: e });
  };

  const handleClick = () => {
    addCategory({ text: category.label });
  };

  const handleEdit = () => {
    updateMutate({ id: category.id, text: category.label });
    setShowChange(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Ushbu kategoriyadagi barcha savollar ham o'chib ketadi.",
      text: "Ushbu kategoriyani o'chirishga ishonchingiz komilmi?",
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
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Savol qo'shish</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            style={{ position: "relative" }}
            className="add-category"
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={categories}
              noOptionsText={
                <Button
                  sx={
                    active
                      ? { pointerEvents: "all", opacity: "1" }
                      : { pointerEvents: "none", opacity: "0.5" }
                  }
                  onMouseDown={handleClick}
                >
                  Kategoriya qo'shish
                </Button>
              }
              onChange={handleSearch}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`${!showChange ? "Kategoriyani tanlang" : ""}`}
                  value={category.label}
                  onChange={(e) => {
                    handleChange(e.target.value);
                    e.target.value.length > 0
                      ? setActive(true)
                      : setActive(false);
                  }}
                />
              )}
              renderOption={(props, option) => (
                <div
                  {...props}
                  key={option.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                  }}
                >
                  {option.text}
                  <EditIcon
                    sx={{
                      fill: "blue",
                      cursor: "pointer",
                      marginRight: "6px",
                      marginLeft: "auto",
                    }}
                    onClick={() => setShowChange(true)}
                  />
                  <DeleteIcon
                    sx={{ fill: "red", cursor: "pointer" }}
                    onClick={() => handleDelete(option.id)}
                  />
                </div>
              )}
            />
            {showChange ? (
              <>
                <TextField
                  label="Kategoriyani o'zgartirish"
                  value={category.label}
                  sx={{
                    width: "95%",
                    position: "absolute",
                    top: "32px",
                    background: "white",
                    zIndex: "99",
                  }}
                  InputProps={{ style: { paddingRight: "53px" } }}
                  onChange={(e) =>
                    setCategory({ ...category, label: e.target.value })
                  }
                />
                <CheckIcon
                  titleAccess="O'zgartirish"
                  onClick={handleEdit}
                  sx={{
                    position: "absolute",
                    top: "55%",
                    right: "35px",
                    zIndex: "999",
                    fill: "green",
                    cursor: "pointer",
                  }}
                />
                <ClearIcon
                  titleAccess="Bekor qilish"
                  onClick={() => setShowChange(false)}
                  sx={{
                    position: "absolute",
                    top: "55%",
                    right: "5px",
                    zIndex: "999",
                    fill: "red",
                    cursor: "pointer",
                  }}
                />
              </>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Savolni kiriting"
              variant="outlined"
              value={postData.question}
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
              multiline
              rows={4}
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
            postData?.answer?.length > 0 &&
            postData?.question?.length > 0 &&
            postData?.category
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
  );
};

export default AddAnswer;
