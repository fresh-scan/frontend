import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ItemList = ({ name, registeredDate, expiryDate, selected, onClick }) => {
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        padding: 2,
        marginBottom: 1,
        borderRadius: 2,
        backgroundColor: selected ? "#ddf2da" : "#ffffff", // 선택 상태에 따라 배경색 변경
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            backgroundColor: "#DFF7E0",
            color: "#35A745",
            borderRadius: "12px",
            padding: "2px 8px",
            fontSize: "10px",
          }}
        >
          냉장
        </Typography>
        <Typography variant="h7" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: "gray", fontSize: "11px" }}>
        등록일자 {registeredDate} 소비기한 {expiryDate}
      </Typography>
    </Paper>
  );
};

export default ItemList;
