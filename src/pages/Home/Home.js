import React, { useState, useContext, useEffect, Fragment } from "react";
import {useHistory } from "react-router-dom";

// style
import "./Home.scss";
// Global vars import
import variables from "../../style/CssVariables.scss";
import {Helmet} from "react-helmet";
//import "./refresh.js"


// api service
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";

// context (global state)
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import UserContext from "../../context/UserContext";
import PostsContext from "../../context/PostsContext";
import LikeButton from "../../components/Buttons/LikeButton";
import CommentButton from "../../components/Buttons/CommentButton";

// components
import PostCard from "../../components/PostCard/PostCard";
import Spinner from "../../components/Spinner/Spinner";
import WhoToAdd from "../../parts/WhoToAdd/WhoToAdd";
import AddNewPost from "../../parts/AddNewPost/AddNewPost";
import PinnedPost from "../../parts/PinnedPost/PinnedPost";
import video from "./a.mp4"
import gif from "./gif.gif"

const Home = () => {
  // ******* start global state ******* //

  // theme context
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;

  // language context
  const { isEnglish, english, german } = useContext(LanguageContext);
  var language = isEnglish ? english : german;

  // user context
  const { userData, setUserData } = useContext(UserContext);

  // posts context
  const { posts, setPostsData } = useContext(PostsContext);

  // ******* end global state ******* //

  // local state
  const [lastKey, setKey] = useState("");
  const [posts_loading, setPostsLoading] = useState(false);
  const [nextPosts_loading, setNextPostsLoading] = useState(false);

  // history init
  const history = useHistory();

  // set page title
  document.title = language.home.pageTitle;

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setPostsLoading(true);
      // get first batch of posts to show in home
      PostService.postsFirstFetch()
        .then((res) => {
          setKey(res.data.lastKey);
          setPostsData(res.data.posts);
          setPostsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPostsLoading(false);
        });

      // get data of logged in user, and pass it to global state
      let userToken = localStorage.getItem("auth-token");
      if (userToken) {
        UserService.getAuthenticatedUser(userToken)
          .then((res) => {
            setUserData({
              token: userToken,
              user: res.data,
              isAuth: true,
            });
          })
          .catch((err) => console.error("Error while get user data", err));
      }
    }
    return () => mounted = false;
  }, []);

  /**
   * used to apply pagination on posts
   * @param {String} key
   * @return next batch of posts
   * will fire on user click on load more posts button in the end of home.
   */
  const fetchMorePosts = (key) => {
    if (key.length > 0) {
      setNextPostsLoading(true);
      PostService.postsNextFetch({ lastKey: key })
        .then((res) => {
          setKey(res.data.lastKey);
          // add new posts to old posts, rather than delete old posts and show new posts,
          // of course we need all posts to be shown.
          setPostsData(posts.concat(res.data.posts));
          setNextPostsLoading(false);
        })
        .catch((err) => {
          console.log(err.response.data);
          setNextPostsLoading(false);
        });
    }
  };

  // direct to post details page on click on post
  const toPostDetails = (postID) => {
    history.push("/posts/" + postID);
  };


  function tokenhtl(prop){

      return(<div>
      <form action="/imagecaption" id="todo=form">
          <ul class="photo__comments">
            <li class="photo__comment">
                <input type="none" name="url" value={prop.link} style={{display: 'none'}}/>
                <input type="submit" name="submit_button" value="Image Caption" id="hi"/>
                <button type='button' id='hey'></button>
            </li>
         </ul>
         {/* <hr style="width:100%;text-align:center;margin-left:4px 2px"></hr> */}
      </form>   
      </div>
      
      )
    
  }

  // store first batch of posts, on page load first
  const firstPosts = !posts_loading ? (
    <Fragment>
      {posts.map((post) => { var ans=undefined;
        return (
          <div key={post.postId} >
            <div onClick={() => toPostDetails(post.postId)}>
                 <PostCard post={post} />
            </div>
             {post.postImage?(
             <div className='postCard'>
                <form action="/imagecaption">
                    <ul class="photo__comments">
                      <li class="photo__comment">
                          <input type="none" name="url" value={post.postImage} style={{display: 'none'}}/>
                          <input type="submit" name="submit_button" value="Image Caption" id="hi"/>
                          <button type='button' id='hey'></button>
                          
                      </li>
                   </ul>
                   {/* <hr style="width:100%;text-align:center;margin-left:4px 2px"></hr> */}
                </form>
                
              <tokenhtl link={post.postImage}></tokenhtl>
            </div>): (
            ""
          )}

          {post.postContent?(
             <div className='postCard'>
                <form action="/textcaption">
                    <ul class="photo__comments">
                      <li class="photo__comment">
                          <input type="none" name="url" value={post.postContent} style={{display: 'none'}}/>
                          <input type="submit" name="submit_button" value="Text Caption" id="hi"/>
                          <button type='button' id='hey'></button>
                      </li>
                   </ul>
                   {/* <hr style="width:100%;text-align:center;margin-left:4px 2px"></hr> */}
                </form>
                
                <tokenhtl link={post.postImage}></tokenhtl>
            </div>): (
            ""
          )}


          </div>
          );
      })}
    </Fragment>
  ) : (
    <Spinner />
  );

  return (
    <div className='home-box' style={{ background: `${theme.background}` }}>
      {/* page title */}
      <div
        className='home-box__title'
        style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.background}`,
        }}
      >
        <h1
          style={{
            color: `${theme.typoMain}`,
          }}
        >
          {language.home.title}
        </h1>
      </div>

      <div className='home-box__content'>
        {/* 'add new post' section */}
        {userData.isAuth ? (
          <div
            className='home-box__addNewPostWrapper'
            style={{ borderBottom: `10px solid  ${theme.addPostBorder}` }}
          >
            <AddNewPost inputId='staticPart' setOpen={false}/>
           
          </div>
        ) : (
          ""
        )}

        {/* 'pinned post' section */}
        {/* <PinnedPost /> */}
        <div className='home-box__posts'>
         <video width="100%" height="100%" controls >
              <source src={video} type="video/mp4"/>
          </video>
          <div>
          <form action="/videotrans" method="get">
          {/* <span class="photo__likes">5 likes</span> */}
            <ul class="photo__comments">
                <li class="photo__comment">
                    {/* <span class="photo__comment-author"></span> */}
                    <input type="submit" name="submit_button" value="Start transcript" id="hi1"/>
                   
                </li> 
                <li class="photo__comment">
                   <h3 className='show__hint' style={{ color: `${theme.typoMain}` }}>
                        {window.token}
                   </h3>
                   <div class="row">
                      <div class="column" id ="like">
                        <CommentButton post={" "} />
                      </div>
                      <div class="column" id = "like">
                       <LikeButton post={" "} />
                      </div>
                  </div>
                </li>
                <li>
                    <button type='button' id='hey'></button>
                </li>


                        
            </ul>
            {/* <hr style="width:100%;text-align:center;margin-left:4px 2px"></hr> */}
         </form>
      
          </div>
         
       </div>
       <div className='home-box__posts'>
       <img src={gif} width="100%" height="100%" alt="Flowers in Chania"/>
          <form action="/giftrans" method="get">
          {/* <span class="photo__likes">5 likes</span> */}
            <ul class="photo__comments">
                <li class="photo__comment">
                    {/* <span class="photo__comment-author"></span> */}
                    <input type="submit" name="submit_button" value="Start transcript" id="hi1"/>
                </li> 

                <li>
                 <div class="row">
                      <div class="column" id ="like">
                        <CommentButton post={" "} />
                      </div>
                      <div class="column" id = "like">
                       <LikeButton post={" "} />
                      </div>
                  </div>
                </li>

                <li>
                    <button type='button' id='hey'></button>
                </li>

               


                {/* <hr style="width:100%;text-align:center;margin-left:4px 2px"></hr> */}
              {/*  <li class="photo__comment">
                   <h3 className='show__hint' style={{ color: `${theme.typoMain}` }}>
                        {window.token}
                   </h3>
                </li> */}
            </ul>
            
         </form>
         {/* <CommentButton  />
          <LikeButton /> */}
         
       </div>
       

        {/* 'posts first fetch' section */}
        <div className='home-box__posts'>{firstPosts}</div>

        {/* 'who to add' section */}
        {userData.isAuth ? <WhoToAdd /> : ""}

        {/* 'button to fetch more posts' section */}
        <div className='home-box__spinner' style={{ textAlign: "center" }}>
          {nextPosts_loading && !posts_loading ? (
            <Spinner />
          ) : lastKey.length > 0 ? (
            <button
              className='home-box__SettingsButton'
              onClick={() => fetchMorePosts(lastKey)}
              style={{
                backgroundColor: theme.mainColor,
                color: "#fff",
                borderRadius: variables.radius,
              }}
            >
              <i className='fal fa-chevron-down home-box__SettingsButton__icon'></i>
              <span className='home-box__SettingsButton__text'>
                {language.home.SettingsButton}
              </span>
            </button>
          ) : (
            ""
          )}
        </div>

        {/* note shown when there is no more posts */}
        <div
          className='home-box__note'
          style={{ color: `${theme.typoSecondary}` }}
        >
          {!nextPosts_loading && lastKey.length === 0 && !posts_loading ? (
            <span>
              {language.home.bottomHint}{" "}
              <i
                className='fas fa-stars'
                style={{ color: theme.mainColor }}
              ></i>
            </span>
          ) : (
            ""
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Home;
