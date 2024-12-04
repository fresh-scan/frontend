import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

const ItemList = ({
  name,
  registeredDate,
  expiryDate,
  selected,
  onClick,
  onEditClick,
}) => {
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        marginBottom: 1,
        borderRadius: 2,
        backgroundColor: selected ? "#ddf2da" : "#ffffff",
        cursor: "pointer",
      }}
    >
      <Box>
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="subtitle1"
            sx={{
              backgroundColor: "#DFF7E0",
              width: "30px",
              height: "20px",
              color: "#35A745",
              textAlign: "center",
              borderRadius: "15px",
              padding: "2px 4px",
              fontSize: "10px",
              lineHeight: "20px",
              marginRight: "10px",
            }}
          >
            냉장
          </Typography>
          <Typography variant="h6">{name}</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "gray" }}>
          등록일자: {registeredDate}, 소비기한: {expiryDate}
        </Typography>
      </Box>
      <Button
        variant="text"
        color="primary"
        sx={{
          padding: "0 !important",
          minWidth: 0,
        }}
        onClick={(e) => {
          e.stopPropagation(); // 클릭 이벤트 버블링 방지
          onEditClick();
        }}
      >
        수정
      </Button>
    </Paper>
  );
};

export default ItemList;
