import { useContext } from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  SkipToContent,
} from "@carbon/react";
import { DeploymentContext } from "../../contexts/deployment-context";
import ProfilePanel from "./ProfilePanel";

const AppHeader = () => {
  const deployment = useContext(DeploymentContext);
  const brandName = deployment?.name;

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Aplication header" className="app-header">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="/" prefix="IBM">
            {brandName}
          </HeaderName>
          <HeaderGlobalBar className="app-header__navbar">
            <ProfilePanel />
          </HeaderGlobalBar>
        </Header>
      )}
    />
  );
};

export default AppHeader;
