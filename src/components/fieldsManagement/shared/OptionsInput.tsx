import React, { useEffect, useRef, useState } from "react";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import { styled } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { appColors } from "./constants";

const OptionsInputDiv = styled("div")({
  flex: 1,
  display: "flex",
  alignItems: "center",
  padding: "9px 14px",
  borderRadius: "4px",
  border: "1px solid",
  borderColor: appColors.offWhite,
  marginTop: "3px",
  height: "35px",
  boxSizing: "border-box",
  flexWrap: "wrap",
  gap: "5px",
  position: "relative",

  "&:hover": {
    borderColor: appColors.darkViolet,
  },
});

const OptionsInputField = styled("input")({
  fontSize: "12px",
  border: 0,
  outline: "none",
});

const OptionsClearBtn = styled(IconButton)({
  position: "absolute",
  top: "4px",
  right: "4px",
});

const Error = styled("small")({
  display: "inline",
  marginTop: "3px",
  color: appColors.theme.danger.main,
  fontSize: "11px",
});

const HelperText = styled("small")({
  fontSize: "11px",
  marginTop: "4px",
  color: appColors.gray,
});

interface OptionsInputProps {
  options: string[];
  onAdd: (newOption: string) => void;
  onDelete: (deletedOption: string) => void;
  onClear: () => void;
}

function OptionsInput({ options, onAdd, onDelete, onClear }: OptionsInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newOption, setNewOption] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!inputRef.current) return;
    //inputRef.current.focus();
  }, []);

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!newOption || options.includes(newOption)) return setError(true);
      onAdd(newOption);
      setNewOption("");
      setError(false);
    }
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (error) setError(false);
    setNewOption(e.target.value);
  }

  function handleDelete(option: string) {
    onDelete(option);
  }

  function handleClear() {
    setError(false);
    onClear();
  }
  return (
    <>
      <OptionsInputDiv>
        {options &&
          options.map((item) => (
            <Chip size='small' label={item} key={item} onDelete={() => handleDelete(item)} />
          ))}
        <OptionsInputField
          ref={inputRef}
          placeholder='Enter an option here'
          onKeyDown={handleEnter}
          onChange={handleChange}
          value={newOption}
        />
        {options.length > 0 && (
          <OptionsClearBtn size='small' onClick={handleClear}>
            <CloseIcon fontSize='small' />
          </OptionsClearBtn>
        )}
      </OptionsInputDiv>
      <HelperText>Press 'Enter' to register an option.</HelperText>
      {error && <Error>The provided value already exists.</Error>}
    </>
  );
}

export default OptionsInput;
