import React, { useState } from "react";
import "../css/Main.css";
import ItemList from "./ItemList";
import { Menu, MenuItem, Button, Fab } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";

const Main = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortMethod, setSortMethod] = useState("소비기한 적게 남은 순");
  const [selectedIds, setSelectedIds] = useState([]); // 선택된 ItemList의 id 배열
  const [items, setItems] = useState([
    {
      id: 1,
      name: "양파",
      registeredDate: "2024.11.29",
      expiryDate: "2024.12.05",
    },
    {
      id: 2,
      name: "당근",
      registeredDate: "2024.11.28",
      expiryDate: "2024.12.10",
    },
    {
      id: 3,
      name: "파프리카",
      registeredDate: "2024.11.30",
      expiryDate: "2024.12.07",
    },
    {
      id: 4,
      name: "브로콜리",
      registeredDate: "2024.11.25",
      expiryDate: "2024.12.01",
    },
    {
      id: 5,
      name: "상추",
      registeredDate: "2024.11.26",
      expiryDate: "2024.12.03",
    },
    {
      id: 6,
      name: "피망",
      registeredDate: "2024.11.27",
      expiryDate: "2024.12.06",
    },
    {
      id: 7,
      name: "가지",
      registeredDate: "2024.11.24",
      expiryDate: "2024.12.02",
    },
    {
      id: 8,
      name: "호박",
      registeredDate: "2024.11.23",
      expiryDate: "2024.11.30",
    },
    {
      id: 9,
      name: "고구마",
      registeredDate: "2024.11.22",
      expiryDate: "2024.12.15",
    },
    {
      id: 10,
      name: "토마토",
      registeredDate: "2024.11.21",
      expiryDate: "2024.12.12",
    },
  ]);

  // 메뉴 열기
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 정렬 변경
  const handleSortChange = (method) => {
    setSortMethod(method);
    handleMenuClose();

    const sortedItems = [...items];
    if (method === "최근 등록 순") {
      sortedItems.sort(
        (a, b) => new Date(b.registeredDate) - new Date(a.registeredDate)
      );
    } else if (method === "소비기한 적게 남은 순") {
      sortedItems.sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
      );
    } else if (method === "식재료 이름(ㄱ-ㅎ)") {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }
    setItems(sortedItems);
  };

  // ItemList 클릭 이벤트 처리
  const handleItemClick = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  return (
    <div>
      <div className="list_header">
        <Button
          variant="contained"
          color="white"
          startIcon={<SwapVertIcon />}
          onClick={handleMenuOpen}
          sx={{
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {sortMethod}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => handleSortChange("최근 등록 순")}
            sx={{
              color: sortMethod === "최근 등록 순" ? "#35A745" : "inherit",
            }}
          >
            최근 등록 순
          </MenuItem>
          <MenuItem
            onClick={() => handleSortChange("소비기한 적게 남은 순")}
            sx={{
              color:
                sortMethod === "소비기한 적게 남은 순" ? "#35A745" : "inherit",
            }}
          >
            소비기한 적게 남은 순
          </MenuItem>
          <MenuItem
            onClick={() => handleSortChange("식재료 이름(ㄱ-ㅎ)")}
            sx={{
              color:
                sortMethod === "식재료 이름(ㄱ-ㅎ)" ? "#35A745" : "inherit",
            }}
          >
            식재료 이름(ㄱ-ㅎ)
          </MenuItem>
        </Menu>
        <div className="delete_button">재료삭제</div>
      </div>
      <div className="list_container">
        {items.map((item) => (
          <ItemList
            key={item.id}
            id={item.id}
            name={item.name}
            registeredDate={item.registeredDate}
            expiryDate={item.expiryDate}
            selected={selectedIds.includes(item.id)}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </div>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          backgroundColor: "#35A745",
          "&:hover": { backgroundColor: "#2e9440" },
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default Main;
