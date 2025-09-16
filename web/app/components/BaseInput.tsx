"use client";
import { useState } from "react";
import type {
  ChangeEventHandler,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import EyeOpen from "@/public/icons/EyeOpen.svg";
import EyeClosed from "@/public/icons/EyeClosed.svg";

type Props = {
  id?: string;
  name?: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

function BaseInput(p: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const inputType =
    p.type === "password" && isPasswordVisible ? "text" : p.type;

  return (
    <div className="w-full">
      <div className="flex items-center justify-center border border-gray pt-5 pb-2 px-4 rounded-xl transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <div className="relative w-full">
          <input
            id={p.id}
            name={p.name}
            type={inputType || "text"}
            autoComplete={p.autoComplete}
            placeholder=" "
            className="w-full py-1 focus:outline-none peer bg-inherit"
            onChange={p.onChange}
          />
          <label className="absolute text-gray left-0 -top-3.5 cursor-text pointer-events-none text-xs transition-all peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-500">
            {p.placeholder}
          </label>

          {p.type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-1/3 -translate-y-1/2 transform text-gray hover:text-black cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {isPasswordVisible ? <EyeClosed /> : <EyeOpen />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BaseInput;
