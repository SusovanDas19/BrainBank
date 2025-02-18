import { IoIosAddCircle } from "react-icons/io";
import { Button } from "./UI/Button";
import { Form } from "../Components/UI/Form";

export const Header = () => {
  return (
    <div className="flex flex-col pt-10">
      <div className="flex justify-end mr-20">
        <Button
          variant="primary"
          size="md"
          text="Add Content"
          startIcon={<IoIosAddCircle className="text-xl" />}
        />
      </div>
      <Form/>
    </div>
  );
};
