import Login from "../Components/Login";

const LoginPage = () => {
  return (
    <div className="h-screen flex items-center justify-center p-10">
      <Login />
      <div className="w-full h-full bg-gradient-to-r opacity-70 from-myBlue to-myPink top-0 -z-10 absolute" />
      <div className="w-full h-full absolute bg-pattern -z-20 top-0"></div>
    </div>
  );
};

export default LoginPage;
