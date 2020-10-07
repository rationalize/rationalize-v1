import React from "react";
import * as icons from "react-feather";

import * as customIcons from "./Icons";

export type IconName = keyof typeof icons | keyof typeof customIcons;

export type IconProps = {
  name: IconName;
} & icons.Props;

function getIconComponent(name: IconName): icons.Icon {
  if (name in customIcons) {
    return customIcons[name as keyof typeof customIcons];
  } else if (name in icons) {
    return icons[name as keyof typeof icons];
  } else {
    throw new Error(`Unexpected icon named ${name}`);
  }
}

export function Icon({ name, ...rest }: IconProps) {
  const IconComponent = getIconComponent(name);
  return <IconComponent {...rest} />;
}
