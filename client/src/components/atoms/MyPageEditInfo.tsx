import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import globalAxios from "../../data/data";
import { MdDelete } from "react-icons/md";
import { regionCategory } from "../../data/category";
import upload from "../../assets/images/upload.jpeg";
import CommonInput from "./CommonInput";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo, RootState } from "../../types/types";
import profileDefault from "../../assets/images/profileDefault.png";

interface userData {
  nickname: string;
  bio: string;
  profileimg: string;
  price: string;
  height: number;
  weight: number;
  location: string;
  sport: string;
}
interface FormData {
  introduction: string;
  nickname: string;
  height: string;
  weight: string;
  primarySport: string;
}

interface ImageData {
  file: File | null;
  src: string;
}
function MyPageEditInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.login.userInfo);

  const [previewImg, setPreviewImg] = useState<ImageData | null>(null);
  //개인-기업 공통 추가 입력
  const [nickname, setNickname] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [sport, setSport] = useState<string>("");
  //개인 추가 입력
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  //기업 추가 입력
  const [priceInfo, setPriceInfo] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };
  const handlePriceInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInfo(e.target.value);
  };
  const handleSportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSport(e.target.value);
  };
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      // isNaN 체크는 변환된 값이 유효한 숫자인지 확인합니다.
      setHeight(inputValue);
    } else {
      setHeight(0);
    }
  };
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      setWeight(inputValue);
    } else {
      setWeight(0);
    }
  };

  const insertImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // 5MB
      const maxFileSize = 5 * 1024 * 1024;

      // 파일 크기 검사
      if (file.size > maxFileSize) {
        alert("파일 크기가 너무 큽니다! 5MB 이하의 사진만 업로드해주세요.");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const previewImgUrl = reader.result;
        if (typeof previewImgUrl === "string") {
          const newImgData: ImageData = {
            file: file,
            src: previewImgUrl,
          };
          setPreviewImg(newImgData);
        }
      };

      reader.onerror = () => {
        alert("사진 업로드 실패, 잠시 후 다시 시도해 주세요");
        console.error("An error occurred while reading the file.");
      };
    }
  };

  const deleteImg = () => {
    setPreviewImg(null);
  };
  //기존 정보 불러오기
  const getData = async () => {
    try {
      const response = await globalAxios.get("/mypage");
      const data: userData = response.data.data;
      console.log(data);
      const preProfileImg = { file: null, src: data.profileimg };
      if ((preProfileImg.src = "https://fitfolio-photo.s3.ap-northeast-2.amazonaws.com/default+image/default.png")) {
      } else {
        setPreviewImg(preProfileImg);
      }
      setNickname(data.nickname);
      setWeight(data.weight);
      setHeight(data.height);
      setSport(data.sport);
      setBio(data.bio);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async () => {
    const formData = new FormData();
    const requestBody = {
      nickname: nickname,
      weight: weight,
      height: height,
      sport: sport,
      bio: bio,
    };
    console.log(requestBody);
    const blob = new Blob([JSON.stringify(requestBody)], {
      type: "application/json",
    });
    formData.append("requestBody", blob);
    if (previewImg && previewImg.file) {
      formData.append("imageUrl", previewImg.file);
    }
    try {
      const response = await globalAxios.patch("/mypage/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("patch성공", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => console.log(nickname), [nickname]);
  useEffect(() => console.log(weight), [weight]);
  useEffect(() => console.log(height), [height]);
  useEffect(() => console.log(bio), [bio]);
  useEffect(() => console.log(sport), [sport]);
  return (
    <div className="flex flex-row justify-center items-center w-full mt-20 max-tablet:flex-col max-tablet:mt-10 ">
      <div className="w-[300px] mt-4 flex flex-col items-center mr-20 pb-[100px] max-tablet:mr-0 max-tablet mb-0">
        <span className="font-bold">프로필 사진</span>
        <div className="flex justify-center">
          <form encType="multipart/form-data">
            <div className="relative">
              <img
                src={previewImg ? previewImg.src : profileDefault}
                alt="previewImg"
                className="mt-4 rounded-full w-[200px] h-[200px] border object-cover"
              />
              <label
                htmlFor="file"
                className="absolute top-0 left-0 w-[200px] h-[200px] bg-transparent cursor-pointer border-0 rounded-full"
              ></label>
              {previewImg && (
                <button onClick={deleteImg} className="absolute right-[-30] flex flex-row items-center">
                  <MdDelete className="text-[#adaaaa] text-[20px] hover:text-[#595656] transition" />
                </button>
              )}
            </div>
            <input
              type="file"
              id="file"
              accept="image/*"
              className="absolute inset-0 overflow-hidden h-0 w-0"
              onChange={insertImg}
            />
          </form>
        </div>
      </div>
      <div className="w-[300px] mt-4">
        {userInfo.userType === "USER" ? (
          <div className="flex flex-col">
            <div>
              <CommonInput value={nickname} label="닉네임" onChange={handleNicknameChange} />
            </div>
            <div className="flex flex-row">
              <CommonInput value={height} type="number" label="키(cm)" onChange={handleHeightChange} />
              <div className="w-4"></div>
              <CommonInput value={weight} type="number" label="몸무게(kg)" onChange={handleWeightChange} />
            </div>
            <div>
              <CommonInput value={sport} label="주 운동 종목" onChange={handleSportChange} />
            </div>
            <div>
              <CommonInput value={bio} label="자기 소개" onChange={handleBioChange} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div>
              <CommonInput value={nickname} label="닉네임" onChange={handleNicknameChange} />
            </div>
            <div>
              <CommonInput value={location} label="지역" onChange={handleLocationChange} />
            </div>
            <div>
              <CommonInput value={sport} label="주 운동 종목" onChange={handleSportChange} />
            </div>
            <div>
              <CommonInput value={bio} label="기업 소개" onChange={handleBioChange} />
            </div>
            <div>
              <CommonInput value={bio} label="가격 정보" onChange={handleBioChange} />
            </div>
          </div>
        )}

        <div className="flex flex-row items-center justify-center mt-[16px]">
          <button
            onClick={onSubmit}
            className="w-[300px] py-2 rounded-[4px] text-[14px] mt-[25px] font-medium text-white transition bg-sbc hover:bg-sbc-hover mr-2"
          >
            수정하기
          </button>
          <button
            onClick={getData}
            className="w-[300px] py-2 rounded-[4px] text-[14px] mt-[25px] font-medium text-white transition bg-sbc hover:bg-sbc-hover"
          >
            되돌리기
          </button>
        </div>
        <Link to={"/mypage/changepassword"}>
          <div className="my-10">
            <span className="font-bold text-[14px]">{`비밀번호 변경 >`}</span>
          </div>
        </Link>
        <Link to={"/mypage/withdraw"}>
          <div className="flex justify-end my-4">
            <span className="text-red-400 text-[12px]">회원 탈퇴하기</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MyPageEditInfo;
