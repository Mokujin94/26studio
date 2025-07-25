import React, { useState, useEffect, useContext } from "react";
import style from "./profileFriends.module.scss";

import FriendCard from "../friendCard/FriendCard";
import { getFriends, getRequestFriends } from "../../http/friendAPI";
import { useLocation, useParams } from "react-router-dom";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const ProfileFriends = observer(({ status }) => {
  const { user } = useContext(Context)
  const { id } = useParams();

  const [friendData, setFriendData] = useState([]);

  const location = useLocation()

  useEffect(() => {
    getFriends(id, status).then((data) => {
      setFriendData(data);
    });
  }, [location.pathname, user.user.id]);

  return (
    <>
      {(friendData.length) ? (
        friendData.map(({ id_sender, id_recipient }) => {
          if (Number(id) === id_sender && status) {
            return <FriendCard userId={id_recipient} key={id} />;
          } else if (Number(id) === id_sender && !status) {
            return <div className={style.friends}>
              <svg
                className={style.friends__icon}
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M177.818 76.0347C193.128 62.879 219.565 56.3475 239.677 64.7699C304.609 91.9587 269.1 183.452 204.028 174.369C160.167 168.248 162.583 84.1728 196.691 69.8894"
                    stroke="#000000"
                    stroke-opacity="0.9"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M142.592 149C111.564 182.552 91.4488 286.487 107.863 329.195C109.631 333.784 114.081 334.831 117.45 331.31C155.592 308 201.533 267.999 236.81 234.342C238.48 232.748 240.596 232.585 242.747 232.858C243.34 233.617 243.261 234.425 243.183 235.222C241.916 248 241.311 272.377 240.996 285.219C240.708 296.882 239.477 308.533 239.564 320.225C239.585 323.115 239.284 329.44 239.564 332.31C239.78 334.509 244.215 335.724 243.183 338.048"
                    stroke="#000000"
                    stroke-opacity="0.9"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M142.71 148.845C142.007 152.51 148.963 167.717 151.144 170.81C169.028 196.155 189.4 232.596 223.701 236.643C226.813 237.01 229.933 235.319 232.977 236.992C233.683 237.382 234.488 236.478 235.107 235.976C237.021 234.424 238.895 232.819 240.285 230.783C241.588 228.877 242.709 226.899 245.782 227.905C248.761 228.883 250.756 230.562 250.968 233.665C251.089 235.434 251.085 237.181 251.929 238.814C267.165 268.244 280.722 296.267 291.172 327.626C292.39 331.283 294.472 333.263 298.883 332.765"
                    stroke="#000000"
                    stroke-opacity="0.9"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
              <h2 className={style.friends__icon__title}>
                {
                  status ? "У вас нет друзей" : "У вас нет заявок"
                }

              </h2>
            </div>
          } else if (Number(id) === id_recipient && status) {
            return <FriendCard userId={id_sender} key={id} />;
          } else if (Number(id) === id_recipient && !status) {
            return <FriendCard userId={id_sender} options={2} key={id} />;
          }
        })
      ) : (
        <div className={style.friends}>
          <svg
            className={style.friends__icon}
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M177.818 76.0347C193.128 62.879 219.565 56.3475 239.677 64.7699C304.609 91.9587 269.1 183.452 204.028 174.369C160.167 168.248 162.583 84.1728 196.691 69.8894"
                stroke="#000000"
                stroke-opacity="0.9"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M142.592 149C111.564 182.552 91.4488 286.487 107.863 329.195C109.631 333.784 114.081 334.831 117.45 331.31C155.592 308 201.533 267.999 236.81 234.342C238.48 232.748 240.596 232.585 242.747 232.858C243.34 233.617 243.261 234.425 243.183 235.222C241.916 248 241.311 272.377 240.996 285.219C240.708 296.882 239.477 308.533 239.564 320.225C239.585 323.115 239.284 329.44 239.564 332.31C239.78 334.509 244.215 335.724 243.183 338.048"
                stroke="#000000"
                stroke-opacity="0.9"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M142.71 148.845C142.007 152.51 148.963 167.717 151.144 170.81C169.028 196.155 189.4 232.596 223.701 236.643C226.813 237.01 229.933 235.319 232.977 236.992C233.683 237.382 234.488 236.478 235.107 235.976C237.021 234.424 238.895 232.819 240.285 230.783C241.588 228.877 242.709 226.899 245.782 227.905C248.761 228.883 250.756 230.562 250.968 233.665C251.089 235.434 251.085 237.181 251.929 238.814C267.165 268.244 280.722 296.267 291.172 327.626C292.39 331.283 294.472 333.263 298.883 332.765"
                stroke="#000000"
                stroke-opacity="0.9"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
          <h2 className={style.friends__icon__title}>
            {
              status ? "У вас нет друзей" : "У вас нет заявок"
            }

          </h2>
        </div>
      )}
    </>
  );
})

export default ProfileFriends;
