import React, { useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

import styles from "./AccountMenu.module.scss";
import { useAuthentication } from "../../../AuthenticationContext";
import { User } from "../../../../RealmApp";
import { Link } from "react-router-dom";

function getUserDisplayName(user: User | null) {
  if (user && user.state === "active") {
    const { firstName, lastName } = user.customData;
    if (typeof firstName === "string" && typeof lastName === "string") {
      return `${firstName} ${lastName}`;
    } else if (typeof firstName === "string") {
      return firstName;
    } else {
      return "Anonymous";
    }
  } else {
    return "Logged out";
  }
}

export function AccountMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { user, logOut } = useAuthentication();

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        tag="span"
        className={styles.AccountMenu__Toggle}
        data-toggle="dropdown"
        aria-expanded={dropdownOpen}
      >
        {getUserDisplayName(user)}
      </DropdownToggle>
      <DropdownMenu right>
        <Link to="/profile">
          <DropdownItem>Profile</DropdownItem>
        </Link>
        <DropdownItem onClick={logOut}>Log out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
