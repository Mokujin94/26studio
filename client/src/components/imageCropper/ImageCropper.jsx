import React, { useContext, useEffect, useRef } from "react";

import "react-image-crop/dist/ReactCrop.css";

import style from "./imageCropper.module.scss";
import ReactCrop, {
  centerCrop,
  convertToPercentCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { useState } from "react";
import setCanvasPreview from "../../hooks/setCanvasPreview";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { updateAvatar } from "../../http/userAPI";
import FunctionButton from "../functionButton/FunctionButton";
import Spinner from "../spinner/Spinner";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = observer(({ imageSrc, setImageSrc, setAvatarFile }) => {
  const { user, modal } = useContext(Context);
  const imgRef = useRef(null);
  const blobUrlRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false)

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const cropPixel = makeAspectCrop(
      {
        unit: "px",
        width: 150,
      },
      ASPECT_RATIO,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);
    const centeredCropPixel = centerCrop(cropPixel, width, height);
    setCrop(centeredCrop);
    setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(
        centeredCropPixel,
        imgRef.current.width,
        imgRef.current.heigth
      )
    );
  };

  const onCompletedCrop = (c) => {
    setCompletedCrop(c);
    setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(c, imgRef.current.width, imgRef.current.heigth)
    );
  };

  const onButtonProfileMiniature = async () => {
    setIsLoading(true)
    // setCanvasPreview(
    //   imgRef.current,
    //   previewCanvasRef.current,
    //   convertToPixelCrop(crop, imgRef.current.width, imgRef.current.heigth)
    // );
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.width / image.width;
    const scaleY = image.height / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/jpeg",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    const file = await blobToFile(blob, "avatarFile.jpg");
    const formData = new FormData();
    formData.append("id", user.user.id);
    formData.append("avatar", file);
    await updateAvatar(formData)
      .then((data) => {
        user.setUser(data);
        setAvatarFile(null);
        user.setModalProfileMiniature(false);
        setTimeout(() => {
          setImageSrc(null);
        }, 300);
        modal.setModalComplete(true);
        modal.setModalCompleteMessage("Изображение обновлено!");
      })
      .catch((e) => console.log(e))
      .finally(setIsLoading(true))
  };

  async function blobToFile(blob, fileName) {
    // Создаем массив байтов из Blob
    const arrayBuffer = await blob.arrayBuffer();

    // Создаем File из массива байтов
    const file = new File([arrayBuffer], fileName, { type: blob.type });

    return file;
  }

  return (
    <>
      {imageSrc && (
        <div className={style.imageCropper}>
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => {
              setCrop(percentCrop);
            }}
            onComplete={(c) => {
              onCompletedCrop(c);
            }}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="image"
              style={{ maxHeight: "500px" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <div className={style.imageCropper__btn}>
            <FunctionButton onClick={onButtonProfileMiniature}>
              {
                isLoading ? <Spinner/> : "Загрузить фотографию"
              }
              
            </FunctionButton>
          </div>
        </div>
      )}
      <div>
        <canvas
          ref={previewCanvasRef}
          style={{
            display: "none",
          }}
        />
      </div>
    </>
  );
});
export default ImageCropper;
