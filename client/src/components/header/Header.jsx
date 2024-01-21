import React, { useContext, useEffect, useRef, useState } from "react";

import style from "./header.module.scss";

import logo from "../../resource/graphics/icons/footer/footer_logo.svg";
import searchIcon from "../../resource/graphics/icons/header/search.svg";
import CreateButtonPopUp from "../createButtonPopUp/CreateButtonPopUp";
import burger from "../../resource/graphics/icons/burgerMenu/burger.svg";
import { Context } from "../..";
import ThemeChangeButton from "../themeChangeButton/ThemeChangeButton";
import SearchAll from "../searchAll/SearchAll";
import { useDebounce } from "../../hooks/useDebounce";
import { searchAll } from "../../http/searchAPI";
import { useClickOutside } from "../../hooks/useClickOutside";

function Header() {
  const { user } = useContext(Context);

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchData, setSearchData] = useState({});

  const useDebounced = useDebounce(search, 200);

  const nodeRef = useRef(null);
  useClickOutside(nodeRef, () => {
    setSearchOpen(false);
  });
  useEffect(() => {
    setIsLoading(true);
    searchAll(useDebounced).then((data) => {
      setSearchData(data);
      setIsLoading(false);
    });
  }, [useDebounced]);

  useEffect(() => {
    setIsLoading(true);
  }, [search]);

  return (
    <header className={style.header}>
      <div className="container">
        <div className={style.header__wrapper}>
          <div
            className={style.header__burgerBtn}
            onClick={() => user.setBurgerActive(!user.burgerActive)}
            style={{ userSelect: "none" }}
          >
            <img src={burger} alt="icon" />
          </div>
          <img src={logo} alt="logo" className={style.header__logo} />
          <div className={style.header__search} ref={nodeRef}>
            <input
              className={style.header__search__input}
              placeholder="Поиск по сайту"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(event) => {
                event.target.setAttribute("autocomplete", "off");
                setSearchOpen(true);
              }}
            />
            <img
              src={searchIcon}
              alt="icon"
              className={style.header__search__icon}
            />
            {searchOpen && (
              <SearchAll
                search={search}
                searchData={searchData}
                isLoading={isLoading}
              />
            )}
          </div>
          <div className={style.header__createButtonPopUp}>
            <CreateButtonPopUp />
            {/* <ThemeChangeButton /> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
