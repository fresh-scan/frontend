import React, { useState, useRef } from "react";
import "../css/Main.css";
import ItemList from "./ItemList";
import {
  Menu,
  MenuItem,
  Button,
  Fab,
  Dialog,
  DialogContent,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";

const Main = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortMethod, setSortMethod] = useState("소비기한 적게 남은 순");
  const [selectedIds, setSelectedIds] = useState([]); // 선택된 ItemList의 id 배열
  const [items, setItems] = useState([]); // API에서 받아온 데이터 저장


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

  // 카메라 기능 관련

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]); // 여러 이미지를 저장
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const getCameraStream = async () => {
    console.log("[DEBUG] 카메라 목록 가져오기 시작...");
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("[DEBUG] 디바이스 목록 가져오기 성공:", devices);

      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("[DEBUG] 비디오 입력 디바이스 목록:", videoDevices);

      const backCamera = videoDevices.find((device) =>
        device.label.toLowerCase().includes("back")
      );
      if (backCamera) {
        console.log("[DEBUG] 후면 카메라 선택됨:", backCamera.label);
        return navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: backCamera.deviceId } },
        });
      } else {
        console.log("[DEBUG] 후면 카메라가 없으므로 기본 카메라를 사용합니다.");
        return navigator.mediaDevices.getUserMedia({ video: true });
      }
    } catch (error) {
      console.error("[ERROR] 카메라 목록 가져오기 실패:", error);
      throw error; // 에러를 상위 호출로 전달
    }
  };

  const handleCameraOpen = async () => {
    console.log("[DEBUG] 카메라 열기 시작...");
    setCameraOpen(true);
    try {
      const stream = await getCameraStream();
      console.log("[DEBUG] 카메라 스트림 가져오기 성공:", stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log("[DEBUG] 카메라 스트림이 비디오 요소에 연결되었습니다.");
      }
    } catch (error) {
      console.error("[ERROR] 카메라 접근에 실패했습니다:", error);
    }
  };

  const handleCameraClose = () => {
    console.log("[DEBUG] 카메라 닫기 시작...");
    setCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      console.log("[DEBUG] 비디오 트랙 중지:", tracks);
      tracks.forEach((track) => {
        track.stop();
        console.log("[DEBUG] 트랙 중지 완료:", track);
      });
    } else {
      console.warn(
        "[WARN] 카메라 스트림이 이미 종료되었거나 정의되지 않았습니다."
      );
    }
  };

  const handleCapture = () => {
    console.log("[DEBUG] 사진 촬영 시작...");
    console.log("[DEBUG] videoRef 상태:", videoRef.current);
    console.log("[DEBUG] canvasRef 상태:", canvasRef.current);

    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      console.log("[DEBUG] 캔버스 크기 설정 완료:", {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      });

      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      console.log("[DEBUG] 비디오 프레임을 캔버스에 그리기 완료.");

      const imageData = canvasRef.current.toDataURL("image/png");
      console.log("[DEBUG] 캡처된 이미지 데이터(Base64):", imageData);

      // 이미지 배열에 추가
      setCapturedImages((prev) => {
        console.log("[DEBUG] 기존 이미지 배열:", prev);
        const updated = [...prev, imageData];
        console.log("[DEBUG] 업데이트된 이미지 배열:", updated);
        return updated;
      });
      alert("사진이 찍혔습니다");
    } else {
      console.error("[ERROR] 비디오 또는 캔버스가 정의되지 않았습니다.");
    }
  };

  const sendImageToBackend = async () => {
    console.log("[DEBUG] 백엔드로 이미지 전송 시작...");
    try {
      const formData = new FormData();

      // 캡처된 이미지를 처리
      for (let i = 0; i < capturedImages.length; i++) {
        console.log(
          `[DEBUG] 처리 중인 이미지 ${i + 1}/${capturedImages.length}`
        );
        console.log(`[DEBUG] Base64 데이터를 Blob으로 변환 중 (${i + 1})...`);
        const response = await fetch(capturedImages[i]);
        const blob = await response.blob();
        console.log(`[DEBUG] Blob 데이터 생성 완료 (${i + 1}):`, blob);

        // 고유 파일 이름 생성
        const uniqueFileName = `image-${Date.now()}-${i + 1}.png`;
        formData.append("files", blob, uniqueFileName);
        console.log(`[DEBUG] FormData에 이미지 추가 (${uniqueFileName})`);
      }

      console.log("[DEBUG] FormData 객체 생성 완료. 백엔드로 전송 준비 중...");
      console.log("[DEBUG] FormData 상태:", formData);

      // POST 요청
      console.log("[DEBUG] POST 요청 전송 중...");

      //!!!!!!!!!!!!!!ngrok 주소 매번 변경해서 가져와야함!!!!!!!!!!
      const res = await fetch("http://localhost:8080/api/process-images", {
        method: "POST",
        body: formData,
      });

      // 응답 처리
      if (res.ok) {
        const data = await res.json();
        const mappedItems = data.id.map((id, index) => ({
          id,
          name: data.name[index] || "이름 없음",
          registeredDate: data.registeredDate[index] || "날짜 없음",
          expiryDate: data.expiryDate[index] || "날짜 없음",
        }));
        setItems(mappedItems);
        alert("이미지 업로드 성공!");
      } else {
        console.error("이미지 업로드 실패:", res.statusText);
        alert(`이미지 업로드 실패: ${res.statusText}`);
      }
    } catch (error) {
      console.error("이미지 전송 중 오류 발생:", error);
      alert("이미지 전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
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
            "&:hover": { boxShadow: "none" },
          }}
        >
          {sortMethod}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleSortChange("최근 등록 순")}>
            최근 등록 순
          </MenuItem>
          <MenuItem onClick={() => handleSortChange("소비기한 적게 남은 순")}>
            소비기한 적게 남은 순
          </MenuItem>
          <MenuItem onClick={() => handleSortChange("식재료 이름(ㄱ-ㅎ)")}>
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
        onClick={handleCameraOpen}
      >
        <AddIcon />
      </Fab>

      {/* 카메라 다이얼로그 */}
      <Dialog
        open={cameraOpen}
        onClose={handleCameraClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <div style={{ textAlign: "center" }}>
            <video
              ref={videoRef}
              style={{ width: "100%" }}
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCapture}
              sx={{ mt: 2 }}
            >
              사진 촬영
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 캡처된 이미지 미리보기 */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>촬영된 이미지:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {capturedImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Captured ${index}`}
              style={{ width: "100px", height: "100px" }}
            />
          ))}
        </div>
        {capturedImages.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={sendImageToBackend}
            sx={{ mt: 2 }}
          >
            완료
          </Button>
        )}
      </div>
    </div>
  );
};

export default Main;
