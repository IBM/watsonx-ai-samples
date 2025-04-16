// Modules -------------------------------------------------------------------->

import { useContext } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Image from "next/image";
import { DeploymentContext } from "../../contexts/deployment-context";
import QuickChatButton from "../QuickChatButton/QuickChatButton";

// Globals -------------------------------------------------------------------->
const DEFAULT_DESCRIPTION = "You can chat with your gen AI solution.";

// Component ------------------------------------------------------------------>

function InitialMessage({ onQuestion }) {
  const deployment = useContext(DeploymentContext);

  const promptButtons = deployment?.sample_questions || [];
  const initialGreeting = `Welcome to ${deployment?.name || "watsonx Agent"}`; // TODO translate
  const beforeStart = deployment?.description || DEFAULT_DESCRIPTION;
  const imageUrl = `/${deployment?.placeholder_image}`;
  const initialImageUrl = deployment?.placeholder_image ? imageUrl : null;

  const imageContainerClass = cx("initial-message__imageContainer", {
    ["customImage"]: Boolean(deployment),
  });

  return (
    <div className="initial-message">
      <h2 className="initial-message__header">{initialGreeting}</h2>
      <span className="initial-message__message">{beforeStart}</span>
      <div className={imageContainerClass}>
        {!initialImageUrl && <div className="initial-message__initialMessageImg" />}
        {initialImageUrl && (
          <Image
            src={initialImageUrl}
            alt="ALT TO REPLACE"
            fill
            style={{ objectFit: "cover" }}
            className="relative"
            sizes="(max-width: 768px)"
            priority
          />
        )}
      </div>
      {promptButtons.length > 0 && (
        <>
          <h2 className="initial-message__quickChatHeader">Quick start samples</h2>
          <div className="initial-message__quickChat">
            {promptButtons &&
              promptButtons.map((promptText, idx) => (
                <QuickChatButton
                  key={idx}
                  onClick={() => {
                    onQuestion(promptText);
                  }}
                >
                  {promptText}
                </QuickChatButton>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

InitialMessage.propTypes = {
  onQuestion: PropTypes.func.isRequired,
};

// Public Methods ------------------------------------------------------------->

export default InitialMessage;
