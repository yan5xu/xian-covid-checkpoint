import { FC, useState } from "react";
import { Button, Popup } from "zarm";
import "./index.scss";

interface Props {
  data: {
    title: string;
  };
  onOpen?: () => void;
}

export const MakerContent: FC<Props> = ({ data, onOpen }) => {
  const handleClickOpen = () => {
    console.log("进入")
    onOpen && onOpen();
  };
  return (
    <>
      <div className="marker-content">
        <div>{data.title}</div>
        <a onClick={() => handleClickOpen}>
          查看详情
        </a>
      </div>
    </>
  );
};
