import HelpQrcode from "../../assets/img/HelpQrcode.jpeg";

const Main = () => {
  document.title = "考研互助";
  return (
    <div>
      <div className="img">
        <img
          style={{ width: "100%", height: "100%", marginTop: "15vh" }}
          src={HelpQrcode}
          alt=""
        />
      </div>
    </div>
  );
};

export default Main;
