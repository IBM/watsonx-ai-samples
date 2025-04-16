// Modules -------------------------------------------------------------------->

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import {
  Watsonx,
  Bot,
  Connect,
  WatsonHealth3DCurveAutoColon,
  Bee,
  ChatBot,
  DataCategorical,
  FaceActivated,
  Gamification,
  User,
  Branch,
  Concept,
  Bicycle,
  Umbrella,
  Chemistry,
  DecisionTree,
  Flash,
  Gem,
} from "@carbon/react/icons";

// Globals -------------------------------------------------------------------->

const ICONS = {
  Watsonx: {
    ICON: () => <Watsonx />,
    REF: Watsonx,
  },
  Bot: {
    ICON: () => <Bot />,
    REF: Bot,
  },
  Connect: {
    ICON: () => <Connect />,
    REF: Connect,
  },
  WatsonHealth3DCurveAutoColon: {
    ICON: () => <WatsonHealth3DCurveAutoColon />,
    REF: WatsonHealth3DCurveAutoColon,
  },
  Bee: {
    ICON: () => <Bee />,
    REF: Bee,
  },
  ChatBot: {
    ICON: () => <ChatBot />,
    REF: ChatBot,
  },
  DataCategorical: {
    ICON: () => <DataCategorical />,
    REF: DataCategorical,
  },
  FaceActivated: {
    ICON: () => <FaceActivated />,
    REF: FaceActivated,
  },
  Gamification: {
    ICON: () => <Gamification />,
    REF: Gamification,
  },
  User: {
    ICON: () => <User />,
    REF: User,
  },
  Branch: {
    ICON: () => <Branch />,
    REF: Branch,
  },
  Concept: {
    ICON: () => <Concept />,
    REF: Concept,
  },
  Bicycle: {
    ICON: () => <Bicycle />,
    REF: Bicycle,
  },
  Umbrella: {
    ICON: () => <Umbrella />,
    REF: Umbrella,
  },
  Chemistry: {
    ICON: () => <Chemistry />,
    REF: Chemistry,
  },
  DecisionTree: {
    ICON: () => <DecisionTree />,
    REF: DecisionTree,
  },
  Flash: {
    ICON: () => <Flash />,
    REF: Flash,
  },
  Gem: {
    ICON: () => <Gem />,
    REF: Gem,
  },
};

const COLORS = {
  background: "avatar__colorBackground",
  supportWarning: "avatar__colorSupportWarning",
  supportCautionMajor: "avatar__colorSupportCautionMajor",
  supportError: "avatar__colorSupportError",
  backgroundSelected: "avatar__colorBackgroundSelected",
  layerAccentActive02: "avatar__colorLayerAccentActive02",
  backgroundBrand: "avatar__colorBackgroundBrand",
  supportSuccessInverse: "avatar__colorSupportSuccessInverse",
  tagBackground: "avatar__colorTagBackground",
  linkPrimary: "avatar__colorLinkPrimary",
  supportInfo: "avatar__colorSupportInfo",
  supportSuccess: "avatar__colorSupportSuccess",
};

// Classes -------------------------------------------------------------------->

const Avatar = ({ color = "background", icon = "Bot", chat = false, profile = false }) => {
  const avatarStyle = cx("avatar__avatar", COLORS[color], {
    ["chat"]: chat,
    ["profile"]: profile,
  });

  return <div className={avatarStyle}>{icon && ICONS[icon].ICON()}</div>;
};

Avatar.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  chat: PropTypes.bool,
};

// Public Methods ------------------------------------------------------------->

export { Avatar, ICONS, COLORS };
