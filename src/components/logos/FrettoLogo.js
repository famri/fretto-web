import logo from "../../assets/logos/fretto_logo.png";

const FrettoLogo = (props) => {
  return (
    <div className="text-center my-5">
      <img src={logo} alt="flutter_logo" width={props.width}></img>
    </div>
  );
};

export default FrettoLogo;
