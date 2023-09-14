import { useState, useRef, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiAlarmWarningFill } from "react-icons/ri";
import { AiFillPlusCircle } from "react-icons/ai";
import globalAxios from '../../data/data'

interface DetailFeedProps {
  feedId: number;
}

function TagModal({
  title,
  size,
  price,
  top,
  left
}: {
  title: string;
  size: string;
  price: number;
  top: string;
  left: string;
}) {
  
  // 위아래
  const modalTopPosition = parseInt(top) > 50 ? "-60px" : "25px";
  // 좌우
  const modalLeftPosition = parseInt(left) > 50 ? "-105px" : "25px";

  return (
    <div
      style={{ top: modalTopPosition, left: modalLeftPosition }}
      className="absolute border w-[100px] rounded-[2px] bg-white text-[12px] mt-[2px] pl-[10px]"
    >
      <div>{title}</div>
      <div className="text-gray-400 text-[8px]">{size}</div>
      <div className="font-bold">₩{price}</div>
    </div>
  );
}

function DetailFeedInd({ feedId }: DetailFeedProps) {
  type ResponseDataType = {
    feedId: number;
    content: string;
    relatedTags: string[];
    images: Array<{
      imageId: number;
      imageUrl: string;
      imageTags: any[];
    }>;
  };

  // 피드 가져오기

  const [responseData, setResponseData] = useState<ResponseDataType | null>(null);

  useEffect(() => {
    async function fetcFeedData() {
      try {
        const response = await globalAxios.get(`/feed/detail/${feedId}`);
        if (response.status === 200) {
          setResponseData(response.data);
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }
    fetcFeedData();
  }, []);

  console.log(responseData?.feedId)

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    console.log("게시물 좋아요");
    setIsLiked(true);
  };

  const handleLikeCancelClick = () => {
    console.log("게시물 좋아요 취소");
    setIsLiked(false);
  };

  const inappropriateviewBtn = () => {
    console.log("게시물 신고");
  };

  // 정보 태그 모달창
  const [showTagModal, setShowTagModal] = useState<{
    photoIndex: number;
    tagIndex: number;
  } | null>(null);


  return (
    <div className="w-full sm:max-w-screen-sm  mx-auto px-4 sm:px-4 lg:px-8">
      
      {responseData?.images.map((image, index) => (
        <div key={index} className="mb-8 relative">
          <img src={image.imageUrl} alt={`Image ${index}`} className="w-full h-auto" />
          {image.imageTags.map((tag, tagIndex) => {
            const top = Math.round(tag.positionY * 100);
            const left = Math.round(tag.positionX * 100);
            return (
              <div
                key={tagIndex}
                className="w-[20px] h-[20px] rounded-full absolute"
                style={{ top: `${top}%`,  left: `${left}%` }}
                onMouseEnter={() => setShowTagModal({ photoIndex: index, tagIndex })}
                onMouseLeave={() => setShowTagModal(null)}
              >
                <AiFillPlusCircle className="w-[20px] h-[20px] text-tag-btn-color" />
                {/* 만약 div위에 마우스 올린게 이미지index와 태그 index가 맞으면 모달창 보여주기 */}
                {showTagModal?.photoIndex === index && showTagModal?.tagIndex === tagIndex && (
                  <TagModal
                    title={tag.productName}
                    size={tag.productInfo}
                    price={parseInt(tag.productPrice)}
                    top={`${top}%`}
                    left={`${left}%`}
                  />
                  )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="font-bold text-gray-400 text-sm mt-[10px]">
        2022
      </div>
      <div className=" mt-[20px]">{responseData?.content}</div>
      <div className=" mt-[20px]">
        {isLiked === false ? (
          <AiOutlineHeart onClick={handleLikeClick} />
        ) : (
          <AiFillHeart onClick={handleLikeCancelClick} />
        )}
      </div>
      <div className=" mt-[40px]">
        <div className="font-bold text-gray-400 text-sm mb-[10px]">
          연관태그
        </div>
        <div>
          {responseData?.relatedTags.map((tag, index) => (
            <span className=" p-1 bg-blue-100 rounded  mr-2" key={index}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-[40px] flex flex-wrap">
          
          {
            responseData?.images.map((image, imageIndex) => (
              image.imageTags.map((tag, tagIndex) => (
                <div className="border rounded flex-grow mr-4 mb-4 p-2 text-sm" key={`${imageIndex}-${tagIndex}`}>
                  <div className="flex">
                    <div className="flex-none" style={{ width: "70px" }}>제품명 : </div>
                    <div className="flex-grow font-bold">{tag.productName}</div>
                  </div>
                  <div className="flex">
                    <div className="flex-none " style={{ width: "70px" }}>가격 : </div>
                    <div>₩ {parseInt(tag.productPrice)}</div>
                  </div>
                  <div className="flex">
                    <div className="flex-none" style={{ width: "70px" }}>추가정보 : </div>
                    <div className="text-btn-color">{tag.productInfo}</div>
                  </div>
                </div>
              ))
            ))
          }
        </div>

    </div>

      <div className="flex justify-end mt-4">
        <button onClick={inappropriateviewBtn} className="focus:outline-none">
          <RiAlarmWarningFill />
        </button>
      </div>

    </div>
  );
}

export default DetailFeedInd;