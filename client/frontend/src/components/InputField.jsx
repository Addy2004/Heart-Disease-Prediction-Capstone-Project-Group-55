import React, { useState } from "react";
import Select from "react-select";
import "./InputField.css";

const InputField = ({ label, type, name, value, onChange, options = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleChange = (inputValue) => {
    if (type === "select") {
      onChange({
        target: { name, value: inputValue?.value || "" },
      });
      setIsFocused(false);
      setIsHovered(false);
    } else {
      const val = inputValue.target.value;
      if (type === "number") {
        if (/^\d*$/.test(val))
          onChange({
            target: { name, value: val },
          });
      } else if (type === "decimal") {
        if (/^-?\d*(\.\d{0,1})?$/.test(val))
          onChange({
            target: { name, value: val },
          });
      }
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setIsHovered(false);
    }, 100);
  };
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMenuOpen = () => {
    setIsClosing(false);
    setMenuOpen(true);
  };
  const handleMenuClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
      setIsFocused(false);
      setIsHovered(false);
    }, 300);
  };

  const numberInputStyles = {
    backgroundColor: "#A8C94F",
    borderRadius: "2.00rem",
    borderColor: isFocused || isHovered ? "#C94FA8" : "#8EAF36",
    borderWidth: "2px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#C94FA8",
    height: "42.5px",
    textAlign: "center",
    caretColor: "#EBE778",
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const selectCustomStyles = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: "#a8c94f",
      borderColor: state.isFocused || isHovered ? "#C94FA8" : "#8EAF36",
      borderWidth: "2px",
      fontSize: "1rem",
      borderRadius: "2.00rem",
      display: "flex",
      justifyContent: "center",
      boxShadow: "none",
      transition: "border-color 0.3s ease",
      "&:hover": {
        borderColor: "#C94FA8",
      },
      textAlign: "center",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#704FC9"
        : state.isFocused
        ? "#A8C94F"
        : "#A8C94F",
      color: state.isSelected ? "#EBE778" : "#C94FA8",
      fontSize: "18px",
      fontWeight: "700",
      "&:active": {
        backgroundColor: "rgba(201, 79, 168, 0.9)",
      },
      "&:hover": {
        backgroundColor: "#C94FA8",
        color: "#EBE778",
      },
      borderRadius: "2.00rem",
      textAlign: "center",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: "none",
      color: "#C94FA8",
      "&:hover": {
        color: "#C94FA8",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#a8c94f",
      borderRadius: "1.50rem",
      boxShadow: "0 6px 6px rgba(0, 0, 0, 0.3)",
      opacity: menuOpen && !isClosing ? 1 : 0,
      transform: menuOpen && !isClosing ? "translateY(0)" : "translateY(-10px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      animation:
        menuOpen && !isClosing
          ? "slideIn 0.3s ease-out"
          : "slideOut 0.3s ease-in",
      zIndex: 9999,
      pointerEvents: menuOpen ? "auto" : "none",
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "18px",
      fontWeight: "700",
      color: "#C94FA8",
    }),
    placeholder: (base, state) => ({
      ...base,
      fontSize: "18px",
      fontWeight: "700",
      color: state.isFocused ? "rgba(0, 0 , 0, 0.3)" : "#C94FA8",
      textAlign: "center",
    }),
    input: (base) => ({
      ...base,
      fontSize: "18px",
      fontWeight: "700",
      color: "#ebe778", //"#436b16",
      display: "flex",
      justifyContent: "center",
      caretColor: "#ebe778",
      caretWidth: "5px",
      textAlign: "center",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
      backgroundColor: "#C94FA8",
      width: "2px",
    }),
  };

  const renderInputField = () => {
    switch (type) {
      case "number":
      case "decimal":
        return (
          <input
            type="text"
            id={name}
            name={name}
            value={value || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full mt-2 rounded text-center custom-number-input"
            style={numberInputStyles}
          />
        );

      case "select":
        return (
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Select
              id={name}
              name={name}
              value={options.find((option) => option.value === value) || null}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              options={options}
              className="w-full mt-2"
              classNamePrefix="react-select"
              styles={selectCustomStyles}
              menuPortalTarget={null}
              menuIsOpen={menuOpen}
              onMenuOpen={handleMenuOpen}
              onMenuClose={handleMenuClose}
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full mt-2 border border-gray-300 rounded text-center text-gray-700"
            style={{
              height: "38px",
            }}
          />
        );
    }
  };

  return (
    <div className="relative w-full">
      <label
        htmlFor={name}
        className={`block text-center transition-all duration-300 ${
          isFocused || isHovered
            ? "text-[#ebe778] text-[22px] font-semibold"
            : "text-[#436b16] text-[18px] font-semibold"
        }`}
      >
        {label}
      </label>
      {renderInputField()}
    </div>
  );
};

export default InputField;
