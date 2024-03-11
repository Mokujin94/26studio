import { makeAutoObservable } from "mobx";
import { createRef } from "react";
import ProfileProjects from "../components/profilProjects/ProfileProjects";
import AchievementCard from "../components/achievementCard/AchievementCard";
import FriendCard from "../components/friendCard/FriendCard";
import SettingCard from "../components/settingCard/SettingCard";
import projectPhoto from "../resource/graphics/images/projectCard/bg.jpg";

import ProfileSettings from "../components/profileSettings/ProfileSettings";
import ProjectCard from "../components/projectCard/ProjectCard";
import ProgressAchievement from "../components/progressAchievement/ProgressAchievement";
import ProfileAchievements from "../components/profileAchievements/ProfileAchievements";
import ProfileFriends from "../components/profileFriends/ProfileFriends";

export default class ProfileStore {
  constructor() {
    this._wrapperItems = [
			{ id: 0, element: <ProfileProjects />, nodeRef: createRef(null) },
		];

    this._isLoadingProfile = true;

    this._menuItems = [
      { id: 0, title: "Проекты" },
    ];

    this._menuItemsOtherUser = [
      { id: 0, title: "Проекты" },
    ];

    this._menuFriends = [
      { id: 0, title: "Друзья" },
      { id: 1, title: "Заявки" }
    ]

    this._WrapperMenuFriends = [
      { id: 0, element: <ProfileFriends />, nodeRef: createRef(null) },
      { id: 1, element: <ProfileFriends />, nodeRef: createRef(null) },
    ]

    this._selectedMenu = { id: 0, title: "Проекты" };

		this._editModal = false;
		this._isOnSetting = false;
    makeAutoObservable(this);
  }

  setWrapperItems(wrapperItems) {
    this._wrapperItems = wrapperItems;
  }

  setIsLoadingProfile(isLoadingProfile) {
    this._isLoadingProfile = isLoadingProfile;
  }

	setEditModal(editModal) {
    this._editModal = editModal;
	}
	
	setIsOnSetting(isOnSetting) {
    this._isOnSetting = isOnSetting;
  }

  setMenuItems(menuItems) {
    this._menuItems = menuItems;
  }

  setMenuItemsOtherUser(menuItemsOtherUser) {
    this._menuItemsOtherUser = menuItemsOtherUser;
  }

  setSelectedMenu(menuItems) {
    this._selectedMenu = menuItems;
  }

  setMenuFriends(menuFriends) {
    this._menuFriends = menuFriends;
  }

  setWrapperMenuFriends(wrapperMenuFriends) {
    this._wrappermenuFriends = wrapperMenuFriends;
  }

  get wrapperItems() {
    return this._wrapperItems;
  }

  get isLoadingProfile() {
    return this._isLoadingProfile;
  }

  get menuItems() {
    return this._menuItems;
  }

  get menuItemsOtherUser() {
    return this._menuItemsOtherUser;
  }

  get selectedMenu() {
    return this._selectedMenu;
  }

  get menuFriends() {
    return this._menuFriends;
  }

  get wrapperMenuFriends() {
    return this._wrapperMenuFriends;
  }

	get editModal() {
    return this._editModal;
	}
	
	get isOnSetting() {
    return this._isOnSetting;
  }
}
