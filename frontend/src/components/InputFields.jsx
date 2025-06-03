import React from "react";

const InputFields = (props) => {
  const Icon = props.icon;
  const InputTag = props.field;
  const categories = props.categories;

  return (
    <div>
      <label
        htmlFor={props.htmlFor}
        className="block text-sm font-medium text-gray-300"
      >
        {props.label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}

        {/* input field for non select tag */}
        {InputTag != "select" && (
          <InputTag
            id={props.inputId}
            type={props.type}
            ref={props.inputRef}
            required
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            className={`block ${props.type === "file" ? "w-fit" : "w-full"} ${
              Icon === undefined ? "pl-3" : "pl-10"
            } px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
          />
        )}

        {/* input field if it is a select tag */}
        {InputTag === "select" && (
          <select
            id={props.inputId}
            type={props.type}
            required
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            className={`block w-full ${
              Icon === undefined ? "pl-3" : "pl-10"
            } px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
          >
            <option value="">--Select a category--</option>
            {categories.map((category, index) => {
              return (
                <option key={index} value={category}>
                  {" "}
                  {category}{" "}
                </option>
              );
            })}
          </select>
        )}
      </div>
    </div>
  );
};

export default InputFields;
