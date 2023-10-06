import { useMutation } from "react-query";
import { API } from "../../services/api";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

const AddAnswer = ({ handleClose, refetch, open, setOpen, question }) => {
  const [postData, setPostData] = useState({ question: question, answer: "" });

  const { mutate } = useMutation(async (data) => await API.postAnswer(data), {
    onSuccess: () => {
      refetch();
      toast.success("Savolingiz muvaffaqiyatli qo'shildi.");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    },
  });

  const handleSubmit = () => {
    mutate(postData);
    setOpen(false);
  };

  return (
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

export default AddAnswer;
