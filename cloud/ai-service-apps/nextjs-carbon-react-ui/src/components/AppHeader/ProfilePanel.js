import React, { useState } from "react";
import { HeaderGlobalAction, HeaderPanel } from "@carbon/react";
import { useAppContext } from "@/contexts/app-context";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { getUserInitials, mapUserColor } from "../../utils/user-util";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const profilePanelContentId = "profile-panel-content";

const ProfilePanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { userData } = useAppContext();
  const { givenName, familyName } = userData;

  const userName = userData?.name;
  const refHeaderProfileAction = useOutsideClick(
    () => setIsExpanded(false),
    [profilePanelContentId]
  );
  const userInitials = getUserInitials({ givenName, familyName });
  const userColor = mapUserColor(userName);

  return (
    <>
      {userName && (
        <>
          <HeaderGlobalAction
            aria-label="User profile"
            className="profile-panel__action"
            onClick={() => {
              setIsExpanded((currentValue) => !currentValue);
            }}
            ref={refHeaderProfileAction}
          >
            <div className="profile-panel__actionUserAvatar" style={{ backgroundColor: userColor }}>
              {userInitials}
            </div>
          </HeaderGlobalAction>
          <HeaderPanel className="profile-panel__content" expanded={isExpanded}>
            <div id={profilePanelContentId} className="profile-panel__contentWrapper">
              <div className="profile-panel__appSection">
                <div className="profile-panel__version">Version {process.env.version}</div>
                <div className="profile-panel__themeSection">
                  <ThemeToggle isExpanded={isExpanded} />
                </div>
              </div>
              <div className="profile-panel__userSection">
                <div className="profile-panel__userAvatar" style={{ backgroundColor: userColor }}>
                  {userInitials}
                </div>
                <div className="profile-panel__info">
                  <div className="profile-panel__userName">{userName}</div>
                </div>
              </div>
            </div>
          </HeaderPanel>
        </>
      )}
    </>
  );
};

export default ProfilePanel;
