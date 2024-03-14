import { MdAdd } from "react-icons/md";
import Button from "./Button";
import Icon from "./Icon";

const AddListBoard = () => {
  return (
    <>
      <Button text="Add new Listboard" className="hidden md:flex" />
      <Icon IconName={MdAdd} className="md:hidden block" />
    </>
  );
};

export default AddListBoard;
