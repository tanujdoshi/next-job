"use client";

import ReviewCard from "./review-card";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormHelperText,
  Snackbar,
  CircularProgress,
  Backdrop,
  Alert,
} from "@mui/material";
import { Button } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useEffect, useState } from "react";
import Textarea from "@mui/joy/Textarea";
import { axiosInstance } from "../../../api";
import { getUserDataFromLocal } from "../(context)/LocatStorageManager";

export default function ReviewComponent({ companyId }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [review, setReview] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [reviews, setReviews] = useState<any>([]);
  const userData = getUserDataFromLocal();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
  };

  const handleSubmit = () => {
    if (review.trim() === "") {
      setError(true);
    } else {
      setIsLoading(true);
      setReview("");
      setReviews((prevReviews: any) => [
        ...(Array.isArray(prevReviews) ? prevReviews : []),
        {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: userData?.email,
          review: review.trim(),
          companyId: companyId,
        },
      ]);

      setOpen(false);
      axiosInstance
        .post("api/review", {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: userData?.email,
          review: review.trim(),
          companyId: companyId,
        })
        .then((res) => {
          setResponseMessage("Review added successfully!");
          setOpenSnackbar(true);
          setIsLoading(false);
        })
        .catch((err) => {
          setResponseMessage("Something went wrong!");
          setOpenSnackbar(true);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    axiosInstance
      .get(`api/getReview/${companyId}`)
      .then((res) => {
        setReviews(res?.data?.reviews);
      })
      .catch((err) => console.log("errror while fetching review ==>", err));
  }, []);

  const handleReviewChange = (e: any) => {
    if (e.target.value.trim() !== "") {
      setError(false);
    }
    setReview(e.target.value);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#003060",
            paddingBottom: 10,
            paddingTop: 10,
          }}
          onClick={handleOpen}
        >
          <CreateIcon style={{ marginRight: 8 }} /> Write Review
        </Button>
      </Box>
      <Box sx={{ alignSelf: "center", paddingTop: 6 }}>
        {reviews?.map((item: any, index: number) => (
          <div style={{ width: 500 }}>
            <ReviewCard
              key={index}
              title={item?.firstName + " " + item?.lastName}
              subheader={item.review}
            />
            {index !== reviews?.length - 1 && <Divider />}
          </div>
        ))}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Write a review</DialogTitle>
        <DialogContent>
          <Textarea
            name="review"
            placeholder="Write your review here..."
            maxRows={8}
            minRows={8}
            sx={{ width: 400 }}
            onChange={handleReviewChange}
            variant="soft"
            required={true}
            error={error}
          />
          {error && (
            <FormHelperText error={true}>
              This field cannot be empty
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        open={isLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" elevation={3}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
