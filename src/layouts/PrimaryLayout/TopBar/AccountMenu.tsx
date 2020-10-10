import React, { useState } from "react";
import {
  ButtonToolbar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { Lock, UserPlus } from "react-feather";
import { useHistory } from "react-router";

import { useAuthentication } from "components/AuthenticationContext";
import { DropdownLink } from "components/DropdownLink";
import { LinkButton } from "components/LinkButton";
import { User, app, isOnlyAnonymous } from "mongodb-realm";

import styles from "./AccountMenu.module.scss";

function getUserDisplayName(user: User | null) {
  console.log(user && user.state);
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
  const { user, logOut, switchUser } = useAuthentication();
  const history = useHistory();

  const otherActiveUsers = app.allUsers.filter(
    (u) => u !== user && u.state === "active" && !isOnlyAnonymous(user)
  );

  function handleUserSwitch(otherUser: User) {
    switchUser(otherUser);
    history.push("/");
  }

  return user ? (
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
        <DropdownLink to="/user-settings">Settings</DropdownLink>
        <DropdownItem onClick={logOut}>Log out</DropdownItem>
        {otherActiveUsers.length >= 1 && (
          <>
            <DropdownItem divider />
            <DropdownItem header>Switch user</DropdownItem>
            {otherActiveUsers.map((otherUser) => (
              <DropdownItem
                key={otherUser.id}
                onClick={handleUserSwitch.bind(null, otherUser as User)}
              >
                {getUserDisplayName(otherUser as User)}
              </DropdownItem>
            ))}
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  ) : (
    <ButtonToolbar className={styles.AccountMenu__Toolbar}>
      <LinkButton to="/register" color="primary">
        <UserPlus size="1rem" /> Register account
      </LinkButton>
      <LinkButton to="/log-in" color="primary">
        <Lock size="1rem" /> Log in
      </LinkButton>
    </ButtonToolbar>
  );
}
