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
        <LinkButton to="/evaluations/create" color="primary" block>
          <Plus size="1rem" /> New Evaluation
        </LinkButton>
      </section>
      <nav className={styles.SideBar__Navigation}>
        <SideBarItem to="/projects" icon="Briefcase" disabled>
          Projects
        </SideBarItem>
        <SideBarItem to="/evaluations" icon="Calendar">
          Evaluations
        </SideBarItem>
        <SideBarItem to="/participants" icon="Users" disabled>
          Participants
        </SideBarItem>
        <SideBarItem to="/concepts" icon="Layers" disabled>
          Concepts
        </SideBarItem>
        <SideBarItem to="/criteria" icon="CheckCircle" disabled>
          Criteria
        </SideBarItem>
      </nav>
    </div>
  );
}
