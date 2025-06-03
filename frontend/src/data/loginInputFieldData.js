import { Mail, Lock} from "lucide-react";

export default [
    
    {
        id: 1,
        label: "email",
        field: "input",
        htmlFor: "email",
        icon: Mail,
        type: "email",
        inputId: "email",
        placeholder: "johndoe@gmail.com",
    },
    {
        "id": 2,
        label: "password",
        field: "input",
        htmlFor: "password",
        icon: Lock,
        type: "password",
        inputId: "password",
        placeholder: "********",
    }
]