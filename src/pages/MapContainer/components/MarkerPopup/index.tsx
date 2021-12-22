import { FC, useState } from "react";
import { Popup } from "zarm";
import "./index.scss";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

export const MakerPopup: FC<Props> = ({ visible, onClose }) => {
  return (
    <>
      <Popup
        visible={visible}
        direction="bottom"
        onMaskClick={() => onClose && onClose()}
        destroy={false}
      >
        <div className="popup-box"></div>
      </Popup>
    </>
  );
};
