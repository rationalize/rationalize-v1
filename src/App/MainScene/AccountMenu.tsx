import React, { useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { History } from "history";

import { app } from "../../RealmApp";

import styles from "./AccountMenu.module.scss";

function getUserDisplayName(user: Realm.User<any> | null) {
  if (user && user.state === "active") {
    return (
      user.profile.firstName ||
      user.profile.name ||
      user.profile.email ||
      "Anonymous"
    );
  } else {
    return "Logged out";
  }
}

function handleLogOut(history: History) {
  if (app.currentUser) {
    app.currentUser.logOut().then(() => {
      history.push("/log-in");
    });
  }
}

export function AccountMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const history = useHistory();

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        tag="span"
        className={styles.AccountMenu__Toggle}
        data-toggle="dropdown"
        aria-expanded={dropdownOpen}
      >
        {getUserDisplayName(app.currentUser)}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={handleLogOut.bind(null, history)}>
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
