import React, { useContext } from "react";

// style
import "./Show.scss";

// assets
import Error404 from "../../assets/Images/page404.svg";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";

const Show = () => {
  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  return (
    <div className='show' style={{ background: `${theme.background}` }}>
      <div className='show__imgBox'>
        <img alt='show' src={Error404} />
      </div>
      <h3 className='show__hint' style={{ color: `${theme.typoMain}` }}>
        {window.token}
      </h3>
    </div>
  );
};

export default Show;
