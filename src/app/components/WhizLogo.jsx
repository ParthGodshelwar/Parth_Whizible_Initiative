import useSettings from "app/hooks/useSettings";
// Logo Changed By Madhuri.K On 03-03-2025
import logo from "../../assets/img/SMLogo_2.png";
import compactLogo from "../../assets/img/winitiativelogo-white.png";

export default function WhizLogo({ mode }) {
  const { settings } = useSettings();
  const theme = settings.themes[settings.activeTheme];

  // const logoSrc = mode === "compact" ? compactLogo : logo;
  const logoSrc = logo;
  return (
    <>
      <img
        src={logoSrc}
        alt="Winsights Logo"
        className="mb-0 img-fluid"
        style={{ maxWidth: "52px", marginLeft: "-14px" }}
      />
    </>
  );
}
