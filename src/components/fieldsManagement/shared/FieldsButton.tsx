import Button, { ButtonProps } from "@material-ui/core/Button";
import { styled } from "@material-ui/styles";
import { appColors } from "./constants";

const { theme } = appColors;
interface BtnProps extends ButtonProps {
  btnColor?: keyof typeof theme;
  btnType?: "filled" | "outlined";
}

const FieldsButton = styled(
  ({ btnColor = "primary", btnType = "filled", ...others }: BtnProps) => (
    <Button {...others} />
  )
)({
  height: 35,
  borderRadius: 3,
  padding: 7,
  paddingRight: 15,
  paddingLeft: 15,
  minWidth: 80,
  alignSelf: "center",
  textTransform: "capitalize",
  flexShrink: 0,
  border: ({ btnColor, btnType }: BtnProps) => {
    const color = (btnColor ? btnColor : "primary") as keyof typeof theme;
    return btnType === "outlined"
      ? `1px solid ${theme[color].main}`
      : "1px solid transparent";
  },
  color: ({ btnColor, btnType }: BtnProps) => {
    const color = (btnColor ? btnColor : "primary") as keyof typeof theme;
    return btnType === "outlined" ? theme[color].main : appColors.white;
  },
  backgroundColor: ({ btnColor, btnType }: BtnProps) => {
    const color = (btnColor ? btnColor : "primary") as keyof typeof theme;
    return btnType === "outlined" ? appColors.white : theme[color].main;
  },
  "&:hover": {
    backgroundColor: ({ btnColor }: BtnProps) => {
      if (!btnColor) return theme.primary.hover;
      return theme[btnColor].hover;
    },
    color: appColors.white,
    borderColor: "transparent",
  },
});

// export default function FieldsButton(props: BtnProps) {
//   return <BaseButton {...props} />;
// }

export default FieldsButton;
