import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // This will take the user to the previous page in history
  };

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title="Go Back" arrow>
        <Button
          onClick={handleBackClick}
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{
            padding: "8px 16px",
            borderRadius: "8px",
            boxShadow: 2,
            "&:hover": {
              boxShadow: 6,
              backgroundColor: "primary.main",
            },
          }}
        >
          <span>Back</span>
        </Button>
      </Tooltip>
    </Box>
  );
};

export default BackButton;
