import classNames from "classnames";
import React from "react";
import { Plus } from "react-feather";

import styles from "./SideBar.module.scss";
import { SideBarItem } from "./SideBarItem";
import { LinkButton } from "../../../LinkButton";

type SideBarProps = { className?: string };

export function SideBar({ className }: SideBarProps) {
  return (
    <div className={classNames(styles.SideBar, className)}>
      <section className={styles.SideBar__QuickAction}>
        <LinkButton to="/events/create" color="primary" block>
          <Plus size="1rem" /> New Event
        </LinkButton>
      </section>
      <nav className={styles.SideBar__Navigation}>
        <SideBarItem to="/projects" icon="Briefcase">
          Projects
        </SideBarItem>
        <SideBarItem to="/events" icon="Calendar">
          Events
        </SideBarItem>
        <SideBarItem to="/participants" icon="Users">
          Participants
        </SideBarItem>
        <SideBarItem to="/concepts" icon="Layers">
          Concepts
        </SideBarItem>
        <SideBarItem to="/criteria" icon="CheckCircle">
          Criteria
        </SideBarItem>
      </nav>
    </div>
  );
}
