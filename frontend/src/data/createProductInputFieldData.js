import { Upload } from "lucide-react"

export default [
    {
        "id": 1,
        label: "Product Name",
        htmlFor: "name",
        field: "input",
        type: "text",
        inputId: "name",
        placeholder: "Enter a product.",
    },
    {
        "id": 2,
        label: "Description",
        htmlFor: "description",
        field: "textarea",
        type: null,
        inputId: "description",
        placeholder: "Give a short description about the product",
    },
    {
        "id": 3,
        label: "Price",
        htmlFor: "price",
        field: "input",
        type: "number",
        inputId: "price",
        placeholder: "Price in Naira",
    },
    {
        "id": 4,
        label: "Category",
        htmlFor: "category",
        field: "select",
        type: null,
        inputId: "category",
        placeholder: "",
    },
    {
        "id": 5,
        label: "In Stock",
        htmlFor: "inStock",
        field: "input",
        type: "number",
        inputId: "inStock",
        placeholder: "how many units",
    },
    {
        id: 6,
        label: "Upload Image",
        // htmlFor: "image",
        field: "input",
        type: "file",
        icon: Upload,
        inputId: "image",
        placeholder: "",
    }
]