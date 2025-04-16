// Modules -------------------------------------------------------------------->
import { ClickableTile } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import React from "react";
import PropTypes from "prop-types";

// Globals -------------------------------------------------------------------->

// Component ------------------------------------------------------------------>

const QuickChatButton = ({ onClick, children }) => {
  return (
    <ClickableTile
      aria-label={children}
      className="quick-chat-button__PromptButton"
      onClick={onClick}
      renderIcon={ArrowRight}
      role="button"
    >
      {children}
    </ClickableTile>
  );
};

QuickChatButton.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

// Public Methods ------------------------------------------------------------->

export default QuickChatButton;
