import { ReactElement } from "react";

type ShowProps = {
    when: boolean;
    children: ReactElement;
}

export const Show = (props:ShowProps)=>{
    return props.when ? props.children : null;

}