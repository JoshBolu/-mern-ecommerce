import { Mail, Lock, User } from "lucide-react";

export default [
    {
        "id": 1,
        label: "Full Name",
        field: "input",
        htmlFor: "name",
        icon: User,
        type: "text",
        inputId: "name",
        placeholder: "John Doe",
    },
    {
        id: 2,
        label: "email",
        field: "input",
        htmlFor: "email",
        icon: Mail,
        type: "email",
        inputId: "email",
        placeholder: "johndoe@gmail.com",
    },
    {
        id: 3,
        label: "enter password",
        field: "input",
        htmlFor: "password",
        icon: Lock,
        type: "password",
        inputId: "password",
        placeholder: "********",
    },
    {
        id: 4,
        label: "confirm password",
        field: "input",
        htmlFor: "confirmPassword",
        icon: Lock,
        type: "password",
        inputId: "confirmPassword",
        placeholder: "********",
    }
]