import { InputBox } from "./InputBox"

export const Form = () => {
    return(
        <div>
            <form action="">
                <InputBox placeholder="Title" type="text" name="title"/>
                <InputBox placeholder="Description" type="text" name="description"/>
            
                <select name="options" id="" className="w-50 bg-transparent text-black">
                    <option value="Youtube"> </option>
                    <option value="Linkedin"> </option>
                    <option value="Notion"> </option>
                </select>
                <InputBox placeholder="Link" type="text" name="link"/>
            </form>
        </div>
    )
}