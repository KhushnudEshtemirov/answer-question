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
import { useMutation } from "react-query";
import { API } from "../../services/api";
import { toast } from "react-toastify";

const EditAnswer = ({ open, data, handleClose, refetch }) => {
  const [editData, setEditData] = useState({
    id: data?.id,
    answer: data?.answer,
    question: data?.question,
  });

  const { mutate } = useMutation(async (data) => await API.updateAnswer(data), {
    onSuccess: () => {
      refetch();
      toast.success("Savol muvaffaqiyatli yangilandi.");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    },
  });

  const handleSubmit = () => {
    mutate(editData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Savolni o'zgartirish</DialogTitle>
      <DialogContent
        sx={{
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
              value={editData?.question}
              onChange={(e) =>
                setEditData((prev) => ({
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
              value={editData?.answer}
              multiline
              rows={4}
              onChange={(e) =>
                setEditData((prev) => ({
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
            editData?.answer?.length > 0 && editData?.question?.length > 0
              ? null
              : { pointerEvents: "none", opacity: "0.5" }
          }
        >
          Yangilash
        </Button>
        <Button onClick={handleClose} variant="contained" color="error">
          Bekor qilish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAnswer;
