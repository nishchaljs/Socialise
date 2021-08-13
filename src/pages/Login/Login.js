import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// style file 
import "./Login.scss";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";

// api service
import UserService from "../../services/UserService";

const Login = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(
    LanguageContext
  );
  var language = isEnglish ? english : german;

  // user context
  const { setUserData } = useContext(UserContext);

  // ******* end global state ******* //

  // local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);

  // utils
  const history = useHistory();
  let userToken = "";

  // set page title
  document.title = language.login.pageTitle;

  // execute login operation
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    // login user
    UserService.loginUser({ email, password })
      .then((res) => {
        userToken = res.data.userToken;
        localStorage.setItem("auth-token", userToken);
      })
      .then(() => {
        if (userToken) {
          // get data of logged in user, and pass it to global state
          UserService.getAuthenticatedUser(userToken)
            .then((res) => {
              setUserData({
                token: userToken,
                user: res.data,
                isAuth: true,
              });
            })
            .then(() => {
              history.push("/");
            })
            .catch((err) => console.error("Error while get user data", err));
        }
      })
      .then(() => {
        // everything done, so reset our states
        setErrors({});
        setLoading(false);
        setPassword("");
      })
      .catch((err) => {
        console.error("Error while login", err.response.data);
        setErrors(err.response.data);
        setLoading(false);
        setPassword("");
      });
  };

  return (
    <div
      className='main-box '
      style={{
        background: theme.background,
      }}
    >
      <div
        className='main'
        style={{
          background: theme.background,
        }}
      >
        <div className='logo'>
          <img src="https://img.icons8.com/doodle/100/000000/online-community.png"/>
        </div>
        <h4
          className='title'
          style={{
            color: theme.typoMain,
          }}
        >
          {language.login.header}
        </h4>
        {errors.general && (
          <small
            id='general-error'
            className='form-text'
            style={{
              color: theme.error,
            }}
          >
            {errors.general}
          </small>
        )}
        <div className='form'>
          <form onSubmit={handleSubmit}>
            <div
              className='form-group form__inputBox'
              style={{
                background: theme.foreground,
                borderBottomColor: `${
                  errors.email ? theme.error : theme.mainColor
                }`,
              }}
            >
              <label
                htmlFor='exampleInputEmail1'
                className='form__inputBox__label'
                style={{
                  color: theme.typoSecondary,
                }}
              >
                {language.login.emailLabel}
              </label>
              <input
                type='email'
                className='form-control form__inputBox__input'
                id='exampleInputEmail1'
                style={{
                  color: theme.typoMain,
                }}
                aria-describedby='emailHelp'
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <small
                  id='emailHelp'
                  className='form-text'
                  style={{
                    color: theme.error,
                  }}
                >
                  * {errors.email}
                </small>
              )}
            </div>
            <div
              className='form-group form__inputBox'
              style={{
                background: theme.foreground,
                borderBottomColor: `${
                  errors.password ? theme.error : theme.mainColor
                }`,
              }}
            >
              <label
                htmlFor='exampleInputPassword1'
                className='form__inputBox__label'
                style={{
                  color: theme.typoSecondary,
                }}
              >
                {language.login.passwordLabel}
              </label>
              <input
                type='password'
                className='form-control form__inputBox__input'
                id='exampleInputPassword1'
                style={{
                  color: theme.typoMain,
                }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                aria-describedby='passHelp'
                autoComplete="on"
              />
              {errors.password && (
                <small
                  id='passHelp'
                  className='form-text'
                  style={{
                    color: theme.error,
                  }}
                >
                  * {errors.password}
                </small>
              )}
            </div>
            <button
              type='submit'
              className='btn btn-primary form__button'
              style={{
                background: theme.mainColor,
              }}
              disabled={isLoading}
            >
              {isLoading ? language.login.loading : language.login.logInButton}
            </button>
          </form>
        </div>
        <div className='signUp'>
          <span
            style={{
              color: theme.mainColor,
            }}
          >
            {language.login.question}
            {"  "}
            <Link
              to='/signup'
              className='signUp__link'
              style={{
                color: theme.mainColor,
              }}
            >
              {language.login.link}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
