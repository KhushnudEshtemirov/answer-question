import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { API } from "../../services/api";

const EditAnswer = ({ open, id, handleClose }) => {
  const [postData, setPostData] = useState({ answer: "", question: "" });

  const { isLoading, data } = useQuery(["getOneAnswer", id], (id) =>
    API.getOneQuestion(id)
  );

  const handleSubmit = () => {};

  if (isLoading) {
    return <p>Loading...</p>;
  }

  console.log(data);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Savolni o'zgartirish</DialogTitle>
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
  );
};

export default EditAnswer;
